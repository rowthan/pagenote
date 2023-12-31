import React, { useState } from 'react'
import { BackupData, BackupVersion } from '@pagenote/shared/lib/@types/data'
import extApi from '@pagenote/shared/lib/pagenote-api'
import { toast } from '@/components/ui/use-toast'
import FilterCheckBox from './FilterCheckBox'
import { Button } from '@/components/ui/button'

enum ImportState {
  unset = 0,
  resolved = 1,
  importing = 2,
}

export default function ImportFilter(props: {
  backupData: BackupData
  onSuccess: () => void
}) {
  const { backupData } = props
  const {
    pages = [],
    lights = [],
    snapshots = [],
    htmlList = [],
    //@ts-ignore
    notes = [],
  } = backupData || {}
  const [importState, setImportState] = useState<ImportState>(ImportState.unset)
  const [selected, setSelected] = useState([
    'html',
    'page',
    'light',
    'snapshot',
    'note',
  ])

  function toggleSelect(key: string) {
    const index = selected.indexOf(key)
    if (index === -1) {
      selected.push(key)
    } else {
      selected.splice(index, 1)
    }
    setSelected([...selected])
  }

  async function doImport() {
    setImportState(ImportState.importing)
    const importData = {
      ...backupData,
      //@ts-ignore
      notes: backupData.notes || backupData.note || [],
    }
    extApi.lightpage
      .importBackup(
        {
          backupData: importData,
        },
        {
          timeout: 90 * 1000,
        }
      )
      .then(function (res) {
        console.log(res, '导入结果')
        if (res.success) {
          toast({
            title: '导入成功',
          })
          props.onSuccess()
        } else {
          toast({
            title: '导入失败',
            content: res.error,
          })
        }
        setImportState(ImportState.unset)
      })
  }

  let pageCnt,
    lightCnt,
    snapshotCnt,
    noteCnt,
    htmlCnt = 0
  if ((backupData.version || 0) >= BackupVersion.version7) {
    backupData.items.forEach(function (item) {
      switch (item.table) {
        case 'webpage':
          pageCnt = item.list?.length || 0
          break
        case 'light':
          lightCnt = item.list?.length || 0
          break
        case 'snapshot':
          snapshotCnt = item.list?.length || 0
          break
        case 'note':
          noteCnt = item.list?.length || 0
          break
        case 'html':
          htmlCnt = item.list?.length || 0
          break
      }
    })
  } else {
    pageCnt = pages.length
    lightCnt = lights.length
    snapshotCnt = snapshots.length
    noteCnt = notes.length
    htmlCnt = htmlList.length
  }

  const importIng = importState === ImportState.importing

  return (
    <div>
      <h3 className="font-bold text-lg">请确认你的备份文件</h3>
      <div className="py-4">
        <p>如果插件已有你导入的数据，将自动合并采用更新版本的数据。</p>
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th>数据类型</th>
              <th>数量</th>
              <th>筛选</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>网页</td>
              <td>{pageCnt}个</td>
              <td>
                <FilterCheckBox
                  field={'page'}
                  selected={selected}
                  onChange={toggleSelect}
                />
              </td>
            </tr>
            <tr>
              <td>标记</td>
              <td>{lightCnt}个</td>
              <td>
                <FilterCheckBox
                  field={'light'}
                  selected={selected}
                  onChange={toggleSelect}
                />
              </td>
            </tr>
            <tr>
              <td>截图</td>
              <td>{snapshotCnt}个</td>
              <td>
                <FilterCheckBox
                  field={'snapshot'}
                  selected={selected}
                  onChange={toggleSelect}
                />
              </td>
            </tr>
            <tr>
              <td>离线网页</td>
              <td>{htmlCnt}个</td>
              <td>
                <FilterCheckBox
                  field={'html'}
                  selected={selected}
                  onChange={toggleSelect}
                />
              </td>
            </tr>
            <tr>
              <td>备忘录</td>
              <td>{noteCnt}个</td>
              <td>
                <FilterCheckBox
                  field={'note'}
                  selected={selected}
                  onChange={toggleSelect}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="modal-action">
        <Button
          disabled={importIng}
          className={`btn btn-primary ${importIng ? 'loading' : ''}`}
          onClick={doImport}
        >
          确定导入
        </Button>
      </div>
    </div>
  )
}
