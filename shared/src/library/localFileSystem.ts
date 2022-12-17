export interface PathStat {
  // Stats
  isDirectory: boolean
  isFile: boolean
  handle: FileSystemHandle | FileSystemDirectoryHandle | null
  ctimeMs: number
  mtimeMs: number
  pathArray: string[]
}

interface Filter {
  dirFilter?: RegExp
  fileFilter?: RegExp
  excludeFileFilter?: RegExp
  excludeDirFilter?: RegExp
  deep: boolean
}

export async function verifyPermission(
    fileHandle: FileSystemHandle | null,
    mode?: FileSystemPermissionMode
) {
  if (!fileHandle) {
    return null
  }
  const options: FileSystemHandlePermissionDescriptor = {
    mode,
  }
  // Check if permission was already granted. If so, return true.
  if ((await fileHandle.queryPermission(options)) === 'granted') {
    return true
  }

  let request = null
  try {
    request = await fileHandle.requestPermission(options)
    // Request permission. If the user grants permission, return true.
  } catch (e) {
    return null
  }
  if (request === 'granted') {
    return true
  }
  // The user didn't grant permission, so return false.
  return false
}

export function concatPaths(pathArray: string[]) {
  let path = ''
  for (let i = 0; i < pathArray.length; i++) {
    const suffix = i !== pathArray.length - 1 ? '/' : ''
    path += (pathArray[i] || '').replace(/^\//, '').replace(/\/$/, '') + suffix
  }
  if (path[0] !== '/') {
    path = '/' + path
  }
  return path
}

interface Props {
  rootDirctoryHandle?: FileSystemDirectoryHandle
}
export default class LocalFileSystem {
  private rootDirctoryHandle: FileSystemDirectoryHandle | null = null
  public rootName = ''
  public hasPermission = false
  public browserSupport = true;

  constructor(props: Props) {
    this.setRootHandle(props.rootDirctoryHandle)
  }

  public async setRoot(): Promise<FileSystemDirectoryHandle | null> {
    const directoryHandle = await window.showDirectoryPicker()
    if (!directoryHandle) {
      return null
    }
    this.rootDirctoryHandle = directoryHandle
    this.setRootHandle(directoryHandle)
    return directoryHandle
  }

  public setRootHandle(handle?: FileSystemDirectoryHandle) {
    if (handle) {
      this.rootDirctoryHandle = handle
      this.rootName = this.rootDirctoryHandle?.name || ''
    }
    this.requestPermission()
  }

  public async requestPermission(
      mode: FileSystemPermissionMode = 'readwrite'
  ): Promise<boolean> {
    const permission = await verifyPermission(this.rootDirctoryHandle, mode)
    this.hasPermission = !!permission
    return this.hasPermission
  }

  public async getHandleAndPathArray(
      path: string,
      mode: FileSystemPermissionMode = 'readwrite'
  ): Promise<{
    handle: FileSystemDirectoryHandle | null
    pathArray: string[] // 解析 path 的每一个层级路径地址
  }> {
    const directoryHandle = this.rootDirctoryHandle
    const permission = await verifyPermission(directoryHandle, mode)
    if (!permission) {
      throw new Error(`无文件 ${path} ${mode}夹权限`)
    }
    const pathArr = path
        .replace(/\/+$/, '')
        .split('/')
        .filter(function (item) {
          return !!item
        })
    // const responsePath = pathArr.slice(1, pathArr.length)
    return {
      handle: directoryHandle,
      pathArray: pathArr,
    }
  }

  public async readFile(path: string): Promise<string> {
    const handleAndPathArray = await this.getHandleAndPathArray(path, 'read')
    let directoryHandle = handleAndPathArray.handle
    const pathArr = handleAndPathArray.pathArray
    if (!directoryHandle) {
      throw new Error(`${path} is not valid`)
    } else {
      let i = 0
      for (; i < pathArr.length - 1; i++) {
        directoryHandle = await directoryHandle.getDirectoryHandle(pathArr[i])
      }
      const file = await (
          await directoryHandle.getFileHandle(pathArr[i])
      ).getFile()
      return file.text()
    }
  }

  public async writeFile(
      path: string,
      data: string,
      keepExistingData = false
  ): Promise<File> {
    const result = await this.getHandleAndPathArray(path, 'readwrite')
    let directoryHandle = result.handle
    const pathArr = result.pathArray
    if (!directoryHandle) {
      throw new Error(`${path} is not valid`)
    } else {
      let i = 0
      for (; i < pathArr.length - 1; i++) {
        directoryHandle = await directoryHandle.getDirectoryHandle(pathArr[i], {
          create: true,
        })
      }
      const fileHandle = await directoryHandle.getFileHandle(pathArr[i], {
        create: true,
      })
      // https://wicg.github.io/file-system-access/#api-filesystemfilehandle-createwritable
      const writable = await fileHandle.createWritable({ keepExistingData })
      await writable.write(data)
      await writable.close()

      const fileinfo = await fileHandle.getFile()
      return fileinfo
    }
  }

  public async readdir(path: string, filter?: Filter): Promise<string[]> {
    const result = await this.getHandleAndPathArray(path, 'read')
    let directoryHandle = result.handle
    const pathArr = result.pathArray
    if (!directoryHandle) {
      throw new Error(`${path} is not valid`)
    } else {
      for (let i = 0; i < pathArr.length; i++) {
        directoryHandle = await directoryHandle.getDirectoryHandle(pathArr[i])
      }
      const names = []
      for await (const entry of directoryHandle.values()) {
        const fullPathName = concatPaths([path, entry.name])

        if (filter?.excludeDirFilter) {
          if (entry.kind === 'directory') {
            if (filter.excludeDirFilter.test(entry.name)) {
              continue
            }
          }
        }

        if (filter?.excludeFileFilter) {
          if (entry.kind === 'file') {
            if (filter.excludeFileFilter.test(entry.name)) {
              continue
            }
          }
        }

        if (filter?.fileFilter) {
          if (entry.kind === 'file' && filter.fileFilter.test(fullPathName)) {
            names.push(fullPathName)
          }
        } else if (filter?.dirFilter) {
          if (
              entry.kind === 'directory' &&
              filter.dirFilter.test(fullPathName)
          ) {
            names.push(fullPathName)
          }
        } else {
          names.push(fullPathName)
        }
        if (filter?.deep) {
          if (entry.kind === 'directory') {
            const deepPath = concatPaths([path, entry.name])
            const result = await this.readdir(deepPath, filter)
            names.push(...result)
          }
        }
      }
      return names
    }
  }

  public async unlink(path: string): Promise<void> {
    path = concatPaths(['/', path])
    const result = await this.getHandleAndPathArray(path, 'readwrite')
    let directoryHandle = result.handle
    const pathArr = result.pathArray
    if (!directoryHandle) {
      throw new Error(`${path} is not valid`)
    } else {
      let i = 0
      for (; i < pathArr.length - 1; i++) {
        directoryHandle = await directoryHandle.getDirectoryHandle(pathArr[i])
      }
      return await directoryHandle.removeEntry(pathArr[i], { recursive: true })
    }
  }

  public async stats(path: string): Promise<PathStat | null> {
    const result = await this.getHandleAndPathArray(path, 'read')
    let directoryHandle = result.handle
    const pathArr = result.pathArray
    if (!directoryHandle) {
      throw new Error(`${path} is not valid`)
    } else {
      let i = 0
      for (; i < pathArr.length - 1; i++) {
        directoryHandle = await directoryHandle.getDirectoryHandle(pathArr[i])
      }
      let fHandle: FileSystemFileHandle | null = null
      let dHandle: FileSystemDirectoryHandle | null = null
      try {
        dHandle = await directoryHandle.getDirectoryHandle(pathArr[i])
      } catch (error) {
        fHandle = await directoryHandle.getFileHandle(pathArr[i])
      }
      return {
        isDirectory: !!dHandle,
        isFile: !!fHandle,
        pathArray: pathArr,
        handle: fHandle || dHandle,
        ctimeMs: fHandle ? (await fHandle.getFile()).lastModified : Date.now(),
        mtimeMs: fHandle ? (await fHandle.getFile()).lastModified : Date.now(),
      }
    }
  }

  public async mkdir(path: string): Promise<FileSystemDirectoryHandle> {
    const filepath = concatPaths(['/', path])
    const result = await this.getHandleAndPathArray(filepath, 'readwrite')
    let directoryHandle = result.handle
    const pathArr = result.pathArray
    if (!directoryHandle) {
      throw new Error(`${filepath} is not valid`)
    } else {
      for (let i = 0; i < pathArr.length; i++) {
        directoryHandle = await directoryHandle.getDirectoryHandle(pathArr[i], {
          create: true,
        })
      }
      return directoryHandle
    }
  }

  public copyFile(
      currentPath: string,
      newPath: string,
      keepExistingData = true
  ): Promise<boolean> {
    return this.readFile(currentPath).then((result) => {
      return this.writeFile(newPath, result, keepExistingData).then(function (
          file
      ) {
        return !!file
      })
    })
  }

  public async exists(path: string): Promise<boolean> {
    const result = await this.getHandleAndPathArray(path, 'read')
    let directoryHandle = result.handle
    const pathArr = result.pathArray
    if (!directoryHandle) {
      throw new Error(`${path} is not valid`)
    } else {
      let i = 0
      for (; i < pathArr.length - 1; i++) {
        try {
          directoryHandle = await directoryHandle?.getDirectoryHandle(pathArr[i])
        } catch (error) {
          return false
        }
      }
      try {
        await directoryHandle.getFileHandle(pathArr[i])
        return true
      } catch (error) {
        try {
          await directoryHandle.getDirectoryHandle(pathArr[i])
          return true
        } catch (error) {
          return false
        }
      }
    }
  }

  /**
   * Assuming rename only file but not path
   * @param oldPath
   * @param newPath
   */
  public async rename(oldPath: string, newPath: string): Promise<void> {
    const data = await this.readFile(oldPath) // Could be buggy for binary file
    await this.writeFile(newPath, data as any)
    await this.unlink(oldPath)
  }
}
