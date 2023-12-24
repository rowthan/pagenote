function makeSha(object: any) {
  return '';
}

function findCommonAncestorIndex(arr1: string[], arr2: string[]): { index1: number; index2: number } | null {
  let index1 = arr1.length - 1;
  let index2 = arr2.length - 1;

  // 从数组末尾向前遍历，找到最后一个共同节点
  while (index1 >= 0 && index2 >= 0) {
    if (arr1[index1] === arr2[index2]) {
      return { index1, index2 };
    }
    index1--;
    index2--;
  }

  return null; // 没有找到共同节点
}

/**
 * 配置项
 * */
interface Storage {
  get: (id: string) => Promise<any>;
  set: (id: string, data: any) => Promise<void>;
}

interface Option {
  branch: string;
  localStorage: Storage;
  serverStorage: Storage;
  writeFileToLocal: (items: { filename: string; data: any }[]) => Promise<void>;
  // 一堆文件中，选择最新版
  checkFresh: (files: { filename?: string; data?: any }[]) => number;
}

/**
 * 参考 .git 的文件管理模式，以及数据结构来管理版本、同步
 * 文件夹结构：
 *
 * 1. **`objects/`：**
 *    - 存储所有的 Git 对象（blob、tree、commit、tag等）。
 *    - 使用 SHA-1 哈希值作为文件名，以压缩的格式存储。
 *
 * 2. **`refs/`：**
 *    - 存储引用（references），包括分支（`heads/`）、标签（`tags/`）和远程跟踪分支（`remotes/`）。
 *    - `heads/` 目录存储分支引用，`tags/` 存储标签引用。
 *
 * 3. **`HEAD`：**
 *    - 记录当前所在的分支或具体的提交。
 *    - 通常包含分支引用（例如 `ref: refs/heads/main`）或直接是一个提交的 SHA-1 哈希值。
 *
 * 4. **`config`：**
 *    - 存储仓库级别的配置，包括用户信息、别名等。
 *    - 对应 `git config` 命令的配置。
 *
 * 5. **`index`：**
 *    - 存储暂存区的内容，即即将提交的文件快照的信息。
 *    - 二进制文件，用于记录文件状态。
 *
 * 6. **`hooks/`：**
 *    - 包含客户端或服务器端的钩子脚本，允许在特定的事件发生时触发自定义操作。
 *
 * 7. **`logs/`：**
 *    - 记录引用（分支和 HEAD）的变更历史，用于查看命令的执行历史。
 *
 * 8. **`info/`：**
 *    - 包含一些全局的 Git 配置信息。
 *
 * 9. **`packed-refs`：**
 *    - 存储一些较大的仓库引用的压缩版本，以提高性能。
 *
 * */

interface Commit {
  sha: string; // SHA-1 哈希值
  tree: string; // 与此提交相关联的树对象的 SHA-1 哈希值
  parents: string[]; // 与此提交相关联的父提交的 SHA-1 哈希值数组
  author: string; // 作者
  committer: string; // 提交者
  message: string; // 提交消息
  date: number; // 提交时间戳
}

interface TreeEntry {
  mode: string; // 文件的权限和类型
  sha: string; // 与文件或子目录关联的对象的 SHA-1 哈希值
  filename: string; // 文件或子目录的名称
}

interface Tree {
  sha: string; // SHA-1 哈希值
  entries: TreeEntry[]; // 文件和子目录的数组
}
export default class GitManager {
  private readonly _branch: string;
  private _option: Option;

  /**
   * 暂存区，待提交的文件快照。使用者可监听暂存数量，选择性执行commit,支持纯文本和二进制数据
   * */
  private _index = new Map<string, string | Blob>();

  constructor(option: Option) {
    this._branch = option.branch || 'main';
    this._option = option;
  }

  /**
   * 加入暂存区的数据，如 webpage/xxxx, {id:"xxxx"}
   * */
  add(filename: string, data: string | Blob) {
    this._index.set(filename, data);
  }

  /**
   * 提交变更，请生成 commit id
   * */
  async commit(commitInfo: Omit<Commit, 'parents' | 'sha' | 'tree'>) {
    /** 当前分支的 commit id*/
    const commitId = await this._localHeadCommit();
    /** 创建 commit 节点*/
    const commitNode: Commit = {
      ...commitInfo,
      parents: [commitId],
      sha: '',
      tree: ''
    };

    /** 创建变更 tree*/
    const commitTree: Tree = {
      sha: '',
      entries: []
    };
    /** 处理暂存区内容，上传文件，填充变更 tree ，并清除暂存区*/
    this._index.forEach((value: any, key: string) => {
      const treeEntity: TreeEntry = {
        filename: key,
        mode: typeof value === 'string' ? 'string' : 'blob',
        sha: makeSha(value)
      };

      /** 本地和远程保存文件数据*/
      this._bothWrite(treeEntity.sha, value);

      commitTree.entries.push(treeEntity);
    });

    /** 上传变更树对象*/
    commitTree.sha = makeSha(commitTree.entries);
    await this._bothWrite(commitTree.sha, commitTree);

    /** 上传commit节点*/
    commitNode.tree = commitTree.sha;
    commitNode.sha = makeSha(commitNode);
    await this._bothWrite(commitNode.sha, commitNode);

    /** 提交到本地，修改本地指针,**/
    /** 当前指针指向的分支*/
    const HEAD = await this._localHEAD();
    await this._option.localStorage.set(HEAD, commitNode.sha);
    /** 清空本地暂存区域*/
    this._index.clear();
  }

  /**
   * 用于拉取变更树的历史节点，方便本地快速的操作
   * */
  async fetch(branch?: string) {
    const commitId = await this._remoteBranchCommit(branch);
    const local = await this._option.localStorage.get(`objects/${commitId}`);
    /** 如果本地没有此条记录，则从远程拉取*/
    if (!local) {
      await this._fetchCommits(commitId);
    }
    return;
  }

  /**
   * 快速的读取文件，有限存本地获取，然后从远程获取
   * */
  private async _fastRead(path: string) {
    const localData = await this._option.localStorage.get(path);
    if (localData) {
      return localData;
    } else {
      const serverData = await this._option.serverStorage.get(path);
      if (serverData) {
        this._option.localStorage.set(path, serverData);
      }
      return serverData;
    }
  }

  /**
   * local/remote 双写
   * */
  private _bothWrite(path: string, data: any) {
    this._option.localStorage.set(path, data);
    return this._option.serverStorage.set(path, data);
  }

  /**
   * HEAD指针文件
   * */
  private async _localHEAD() {
    return (await this._option.localStorage.get('HEAD')) || 'refs/heads/main';
  }

  /**
   * HEAD 指针对应的 commit id
   * */
  private async _localHeadCommit() {
    const HEAD = await this._localHEAD();
    return (await this._option.localStorage.get(HEAD)) || '';
  }

  /**
   * 远端分支指向 commit 节点
   * */
  private async _remoteBranchCommit(branch?: string): Promise<string> {
    return await this._option.serverStorage.get(`remotes/heads/${branch || this._branch}`);
  }

  private async _fetchCommits(startCommitId: string) {
    const local = await this._option.localStorage.get(`objects/${startCommitId}`);
    // todo 这里还需要检查 local.tree 是否本地有，如果没有也需要更新
    if (local) {
      for (let i = 0; i < local.parents.length; i++) {
        const parentId = local.parents[i];
        await this._fetchCommits(parentId);
      }
    } else {
      // 如果本地没有记录，则从远端拉取，并检查父节点是否有相关信息
      const commitInfo = (await this._option.serverStorage.get(`objects/${startCommitId}`)) as Commit;
      await this._option.localStorage.set(`objects/${startCommitId}`, commitInfo);
      const parentIds = commitInfo.parents;
      for (let i = 0; i < parentIds.length; i++) {
        await this._fetchCommits(parentIds[i]);
      }
    }
    return;
  }

  /**
   * 拉取数据至本地
   * 比较本地与远程的 commit 节点信息差异，
   * 默认采用 merge 操作，更加高效一些
   * */
  async pull(branch?: string, rebase?: false) {
    await this.fetch();
    const localCommit = await this._localHeadCommit();
    const remoteCommit = await this._remoteBranchCommit(branch);
    const [localDiff, remoteDiff] = await this._diff([localCommit], [remoteCommit]);
    const diffTreeEntry = new Map<string, TreeEntry>();
    for (const i in localDiff) {
      const commit: Commit = await this._option.localStorage.get(`objects/${localDiff[i]}`);
      const tree: Tree = await this._option.localStorage.get(`objects/${commit.tree}`);
      tree.entries.forEach(function (value) {
        if (!diffTreeEntry.has(value.filename)) {
          diffTreeEntry.set(value.filename, value);
        }
      });
    }

    /** 通过 rebase 操作，一个节点一个节点的处理 todo 这里逻辑待后面来看*/
    if (rebase) {
      for (const i in remoteDiff) {
        const commit: Commit = await this._option.localStorage.get(`objects/${remoteDiff[i]}`);
        const tree: Tree = await this._option.localStorage.get(`objects/${commit.tree}`);
        const remoteChangeTreeEntry = new Map<string, TreeEntry>();

        const conflictFiles: TreeEntry[] = [];
        tree.entries.forEach(function (value) {
          if (!remoteChangeTreeEntry.has(value.filename)) {
            remoteChangeTreeEntry.set(value.filename, value);
          }
          if (diffTreeEntry.has(value.filename)) {
            conflictFiles.push(value);
          }
        });

        /**
         * 没有冲突时，通过 cherry-pick 处理，将远程的 commit 节点
         * */
        if (conflictFiles.length === 0) {
          await this._pickCommit(commit);
        } else {
          await this._resolveConfict(commit, conflictFiles);
        }
      }
    } else {
      /** merge 操作，将所有变更，打包一次性处理*/
      const remoteChangeTreeEntry = new Map<string, TreeEntry>();
      /** 收集commit change tree*/
      for (const i in remoteDiff) {
        const commit: Commit = await this._option.localStorage.get(`objects/${remoteDiff[i]}`);
        const tree: Tree = await this._option.localStorage.get(`objects/${commit.tree}`);
        for (const j in tree.entries) {
          const value = tree.entries[j];
          /** 多个commit 对同一个文件均做了修改，只保存最新的一个*/
          if (!remoteChangeTreeEntry.has(value.filename)) {
            remoteChangeTreeEntry.set(value.filename, value);
          }
        }
      }

      /**
       * 处理远程的变更
       * */
      for (const i in remoteChangeTreeEntry) {
        const localChange = diffTreeEntry.get(i);
        const serverChange = remoteChangeTreeEntry.get(i);
        /** 如果本地也有修改，则需要处理冲突，决策使用哪一个版本*/
        if (localChange) {
          // todo 取值路径为 objects/xxx
          const localFile =
            (await this._option.localStorage.get(localChange.sha)) ||
            (await this._option.serverStorage.get(localChange.sha));

          let serverFile;
          if (serverChange?.sha) {
            serverFile =
              (await this._option.localStorage.get(serverChange?.sha)) ||
              (await this._option.serverStorage.get(serverChange?.sha));
          }

          const files = [
            {
              filename: localChange.filename,
              data: localFile
            },
            {
              filename: serverChange?.filename,
              data: serverFile
            }
          ];

          const pickIndex = this._option.checkFresh(files);

          const pickData = pickIndex === 1 ? serverChange : localChange;

          if (pickData) {
            diffTreeEntry.set(i, pickData);
          }
        } else if (serverChange) {
          diffTreeEntry.set(i, serverChange);
        }
      }
    }

    /** diff change 收集完毕后*/

    // 远程已有 commit 的情况下
    if (remoteCommit) {
      const tree: Tree = {
        entries: [],
        sha: ''
      };

      diffTreeEntry.forEach(function (value) {
        tree.entries.push(value);
      });
      const treeId = makeSha(tree);
      await this._bothWrite(treeId, tree);

      /** 在远程的基础上继续，添加节点*/
      const commit: Commit = {
        author: 'auto merge',
        committer: 'puller',
        date: Date.now(),
        message: `MR for: ${localDiff}`,
        parents: [remoteCommit],
        sha: '',
        tree: treeId
      };

      /** 上传commit*/
      const commitId = makeSha(commit);
      await this._bothWrite(commitId, commit);
      /** 同步文件至本地*/
      await this._writeDiffTreeToLocal(diffTreeEntry);
      await this._option.localStorage.set(await this._localHEAD(), commitId);
    }
  }

  private async _writeDiffTreeToLocal(tree: Map<string, TreeEntry>) {
    const files = [];
    for (const i in tree) {
      const item = tree.get(i);
      const { sha = '', filename } = item || {};
      const file = await this._option.localStorage.get(`objects/${sha}`);
      if (filename) {
        files.push({
          filename,
          data: file
        });
      }
    }

    return this._option.writeFileToLocal(files);
  }

  // todo 有冲突，需要解决
  _resolveConfict(commit: Commit, treeEntries: TreeEntry[]) {
    // todo 针对有冲突的文件处理一下
  }

  private async _pickCommit(commit: Commit) {
    const { tree } = commit;
    const treeInfo: Tree = await this._option.localStorage.get(tree);
    const files: (TreeEntry & { data: any })[] = [];

    /** 收集文件变更*/
    for (const i in treeInfo.entries) {
      const value = treeInfo.entries[i];
      const file = await this._option.serverStorage.get(value.sha);
      files.push({
        ...value,
        data: file
      });
    }

    /**
     * 创建新的 commit 节点
     * */
    const newCommit: Commit = {
      ...commit,
      parents: [await this._localHeadCommit()]
    };
    newCommit.sha = makeSha(newCommit);

    // todo 这里改为事务，保证文件修改和指针偏移的一致性
    /** 写入文件变更至本地*/
    await this._option.writeFileToLocal(files);
    /**
     * 修改指针
     * */
    const HEAD = await this._localHEAD();
    await this._option.localStorage.set(HEAD, newCommit.sha);
  }

  async push() {
    await this.pull();
    // todo
  }

  /**
   * 比较两个分支、节点的差异;
   * commit1: {parents: [a]}, commit1: {parents: [b]}
   * 两个节点数组，如 [a,b,c,d] , [f,e,d]
   * 找到他们的共同祖先节点d,对应的下标 3,2
   * */
  async _diff(localCommits: string[], originCommits: string[]): Promise<[string[], string[]]> {
    await this.fetch();
    const result = findCommonAncestorIndex(localCommits, originCommits);
    if (result === null) {
      const localCommit = localCommits[localCommits.length - 1];
      const originCommit = originCommits[originCommits.length - 1];

      const localInfo: Commit = await this._option.localStorage.get(`objects/${localCommit}`);
      const originInfo: Commit = await this._option.localStorage.get(`objects/${originCommit}`);

      if (!localInfo && !originInfo) {
        return [localCommits, originCommits];
      } else {
        if (localInfo) {
          localCommits.push(...(localInfo.parents || []));
        }
        if (originInfo) {
          originCommits.push(...(originInfo.parents || []));
        }
        return this._diff(localCommits, originCommits);
      }
    } else {
      const { index1, index2 } = result;
      const diffCommitsLocal = localCommits.slice(0, index1 - 1);
      const diffCommitsOrigin = originCommits.slice(0, index2 - 1);

      return [diffCommitsLocal, diffCommitsOrigin];
    }
  }
}
