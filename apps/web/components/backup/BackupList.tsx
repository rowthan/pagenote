import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  BackupData,
  BackupDataType,
  BackupVersion,
  SnapshotResource,
  Step,
  WebPage,
} from '@pagenote/shared/lib/@types/data'
import extApi from '@pagenote/shared/lib/pagenote-api'
import dayjs from 'dayjs'
import useWhoAmi from '../../hooks/useWhoAmi'
import {
  addBackup,
  downloadBackupAsFile,
  getBackupDetail,
  listBackupList,
  removeBackup,
} from './db'
import { pick } from 'next/dist/lib/pick'
import { toast } from '../../utils/toast'
import { importLights, importPages, importSnapshots } from './api'

const PAGE_SIZE = 50
export default function BackupList() {
  const [backupList, setBackupList] = useState<Partial<BackupData>[]>([])
  const [loading, setLoading] = useState(false)
  const [whoAmi] = useWhoAmi()
  useEffect(function () {
    loadList()
  }, [])

  function loadList() {
    listBackupList().then(function (res) {
      const list = res.map(function (item) {
        return pick(item, [
          'backupId',
          'backup_at',
          'remark',
          'dataType',
          'version',
          'extension_version',
        ])
      })
      setBackupList(list)
    })
  }

  function getAllLights(
    page = 0,
    lights: Partial<Step>[] = []
  ): Promise<Partial<Step>[]> {
    return extApi.lightpage
      .queryLights({
        query: {
          deleted: false,
        },
        limit: PAGE_SIZE, // 一次拉取100条，避免数据量过大，导致信息超载无法通信，分页拉取所有
        //@ts-ignore
        skip: PAGE_SIZE * page,
        page: page,
      })
      .then(async (res) => {
        if (res.success) {
          lights = lights.concat(res.data.list as Step[])
          if (res.data.has_more) {
            /**避免数据量过大，无法通过单次请求拉取完，采用递归方式分批次拉取*/
            const result = await getAllLights(page + 1)
            lights = lights.concat(result)
          }
          return lights
        }
        return lights || []
      })
  }

  function getAllPages(
    page = 0,
    pages: Partial<WebPage>[] = []
  ): Promise<Partial<WebPage>[]> {
    return extApi.lightpage
      .queryPages({
        query: {
          deleted: false,
        },
        limit: PAGE_SIZE, // 一次拉取100条，避免数据量过大，导致信息超载无法通信，分页拉取所有
        //@ts-ignore
        skip: PAGE_SIZE * page,
        page: page,
      })
      .then(async (res) => {
        if (res.success) {
          pages = pages.concat(res.data?.list || [])
          console.log('pages:', res)
          if (res.data?.has_more) {
            const result = await getAllPages(page + 1)
            pages = pages.concat(result)
          }
          return pages
        }
        return pages || []
      })
  }

  function getAllSnapshots(
    page = 0,
    snapshots: Partial<SnapshotResource>[] = []
  ): Promise<Partial<SnapshotResource>[]> {
    return extApi.lightpage
      .querySnapshots({
        limit: 5,
        //@ts-ignore
        skip: 5 * page,
        page: page,
      })
      .then(async function (res) {
        if (res.success) {
          snapshots = snapshots.concat(res.data.list)
          if (res.data.has_more) {
            const result = await getAllSnapshots(page + 1)
            snapshots = snapshots.concat(result)
          }
        }
        return snapshots || []
      })
  }

  function selectBackup(backupId: string) {
    setLoading(true)
    getBackupDetail(backupId).then(async function (res) {
      if (res) {
        const { pages = [], lights = [], snapshots = [] } = res
        await importLights(lights)
        await importPages(pages)
        await importSnapshots(snapshots)
      }
      toast('已导入')
      setLoading(false)
    })
  }

  async function createNewBackup() {
    if (backupList.length > 10) {
      return false
    }

    setLoading(true)

    Promise.all([getAllLights(), getAllPages(), getAllSnapshots()]).then(
      function ([lights, pages, snapshots]) {
        addBackup({
          backupId: dayjs().format('YYYY-MM-DD_HH_mm_ss'),
          backup_at: Date.now(),
          box: [],
          dataType: [BackupDataType.light, BackupDataType.pages],
          extension_version: whoAmi?.version,
          lights: lights,
          pages: pages,
          snapshots: snapshots,
          remark: `共计 ${lights.length} 个标记； ${pages.length} 个网页; ${snapshots.length} 个截图快照`,
          size: 0,
          items: [],
          version: BackupVersion.version4,
        })
          .then(function () {
            setLoading(false)
            loadList()
            toast('备份成功')
          })
          .catch(function (reason) {
            toast('备份失败')
          })
      }
    )
  }

  return (
    <div className="max-w-6xl dark:text-gray-200 mx-auto">
      <h2>时间机器：备份、还原数据</h2>
      <div className="opacity-80">
        {/*备份数据存储在当前浏览器下（浏览器卸载时清空），插件卸载也不会丢失。重新安装时，可用于还原。*/}
      </div>
      <div className="overflow-x-auto">
        <table className="table table-compact w-full min-h-100">
          <thead>
            <tr>
              <th>序号</th>
              <th>备份时间</th>
              {/*<th>备份类型</th>*/}
              <th>插件版本</th>
              <th>数据版本</th>
              <th>备注</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {backupList.map(function (item, index) {
              return (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{dayjs(item.backup_at).format('YYYY-MM-DD HH:mm:ss')}</td>
                  {/*<td>{item.dataType?.join(',')}</td>*/}
                  <td>{item.extension_version}</td>
                  <td>{item.version}</td>
                  <td>{item.remark}</td>
                  <td>
                    <div className="dropdown dropdown-left">
                      <label tabIndex={0} className="btn m-1 btn-sm">
                        使用此备份
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                      >
                        <li>
                          <button
                            onClick={() =>
                              downloadBackupAsFile(item.backupId as string)
                            }
                            disabled={loading}
                            className="m-2 btn btn-sm btn-info btn-outline"
                          >
                            下载为文件
                          </button>
                        </li>
                        <li>
                          <button
                            disabled={loading}
                            onClick={() => {
                              selectBackup(item.backupId as string)
                            }}
                            className="m-2 btn btn-sm btn-success"
                          >
                            导入此备份数据至 PAGENOTE 插件
                          </button>
                        </li>
                        <li>
                          <button
                            disabled={loading}
                            onClick={() =>
                              removeBackup(item.backupId as string).then(() => {
                                loadList()
                              })
                            }
                            className="m-2 btn btn-sm btn-warning"
                          >
                            删除备份
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <th>共计{backupList.length}</th>
              <th colSpan={3}>{/*<UploadBackup onUpload={loadList} />*/}</th>
              <th colSpan={2}>
                {/*<button*/}
                {/*  disabled={loading}*/}
                {/*  onClick={createNewBackup}*/}
                {/*  className="btn btn-outline btn-success"*/}
                {/*>*/}
                {/*  创建新的 备份时间节点*/}
                {/*</button>*/}
                {/*<DeveloperTip taskInfo={developerTask.importPart} />*/}

                {loading && (
                  <div className="fixed bottom-0 max-w-lg alert alert-info shadow-lg">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-current flex-shrink-0 w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span>请稍后...</span>
                      <progress
                        className="progress progress-success w-56"
                        value="100"
                        max="100"
                      ></progress>
                    </div>
                  </div>
                )}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
