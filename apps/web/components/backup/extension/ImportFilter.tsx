import React, { useState } from 'react'
import { BackupData, BackupVersion } from '@pagenote/shared/lib/@types/data'
import extApi from '@pagenote/shared/lib/pagenote-api'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import classNames from "classnames";
import {ToastAction} from "../../../@/components/ui/toast";
import useWhoAmi from "../../../hooks/useWhoAmi";

enum ImportState {
  unset = 0,
  resolved = 1,
  importing = 2,
}

const TableMap:Record<string, string> = {
  'webpage': '网页',
  'note': '备忘录',
  'light': '标记',
  'snapshot': '截图',
  'html': '离线网页',
  'clipboard':"剪切板",
  'config':'配置'
}

export default function ImportFilter(props: {
  backupData: Omit<BackupData, 'pages'|'light'|'box'|'snapshots'|'notes'|'htmlList'>
  onSuccess: () => void
}) {
  const { backupData } = props
  const [importState, setImportState] = useState<ImportState>(ImportState.unset)
  const [blockedIndex, setBlockedIndex] = useState<number[]>([])
  const [whoAmi] = useWhoAmi()
  function toggleSelect(key: number) {
    const index = blockedIndex.indexOf(key)
    if (index > -1) {
      blockedIndex.splice(index,1)
    } else {
      blockedIndex.push(index)
    }
    setBlockedIndex([...blockedIndex])
  }

  function goHome(){
    extApi.commonAction.openTab({
      url: `${whoAmi?.origin}/pagenote.html`,
      reUse: true,
      tab:{}
    })
  }

  async function doImport() {
    setImportState(ImportState.importing)

    extApi.lightpage
      .importBackup(
        {
          backupData: backupData,
        },
        {
          timeout: 120 * 1000,
        }
      )
      .then(function (res) {
        console.log(res, '导入结果')
        if (res.success) {
          toast({
            title: '导入成功',
            action: (
                <ToastAction altText="reload page" onClick={goHome}>查看</ToastAction>
            )
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


  const importIng = importState === ImportState.importing

  return (
    <div>
      {/*<h3 className="font-bold text-lg">请确认你的备份文件</h3>*/}
      <div className="py-4">
        {/*<p>如果插件已有你导入的数据，将自动合并采用更新版本的数据。</p>*/}
        <div className=" flex justify-center mb-4">
          <Button
              disabled={importIng}
              className={`btn btn-primary ${importIng ? 'loading' : ''}`}
              onClick={doImport}
          >
            确定导入
          </Button>
        </div>
        {/*<table className="table table-compact w-full">*/}
        {/*  <thead>*/}
        {/*  <tr>*/}
        {/*    <th>数据类型</th>*/}
        {/*    <th>数量</th>*/}
        {/*  </tr>*/}
        {/*  </thead>*/}
        {/*  <tbody>*/}
        {/*  {*/}
        {/*    backupData.items.map((item, index) => (*/}
        {/*        <tr key={index} className={classNames({*/}
        {/*          "hide": item.list.length === 0*/}
        {/*        })}>*/}
        {/*          <td>{TableMap[item.table]}</td>*/}
        {/*          <td>{item.list.length}个</td>*/}
        {/*        </tr>*/}
        {/*    ))*/}
        {/*  }*/}
        {/*  </tbody>*/}
        {/*</table>*/}
      </div>

    </div>
  )
}
