import React, {type ReactNode, useState} from 'react'
import CloseSvg from 'assets/svg/close.svg'
import ImportFilter from './ImportFilter'
import ExportFilter from './ExportFilter'
import {
  BackupData,
  BackupVersion,
  ContentType,
  MetaResourceType,
  SnapshotResource,
  Step
} from '@pagenote/shared/lib/@types/data'
import {toast} from 'utils/toast'
import {resolveImportString} from '@pagenote/shared/lib/utils/data'
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {UploadIcon} from '@radix-ui/react-icons'
import {readFiles} from "../../../utils/file";
import {cloneDeep} from "lodash";
import {LightFormatFromWebPage} from "../../../utils/backup";
import md5 from "md5";

interface Props {
  children?: ReactNode
}

export default function ImportAndExport(props: Props) {
  const { children } = props
  const [backupData, setBackupData] = useState<BackupData | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  function onImportBackup(files: FileList) {
    const selectedFile = files || []
    if (selectedFile.length === 0) {
      return toast('未选择备份文件', 'error')
    }

    readFiles(files).then(function (list) {
      const mergeBackupData: BackupData  = {
        items: []
      }
      for(let i = 0; i < list.length; i++){
        try{
          const backupData = resolveImportString(list[i])
          if (backupData) {
            console.log(backupData,'backupdata')
            // 格式初始化
            mergeBackupData.items = mergeBackupData.items || []
            // 继承 items 数据
            if(backupData.items && backupData.items.length > 0){
              mergeBackupData.items.push(...backupData.items)
            }

            // 低版本数据处理
            if((backupData.version || 0) < BackupVersion.version7){
              if(backupData.pages && backupData.pages.length > 0){
                mergeBackupData.items.push({
                  db: "lightpage",
                  table: "webpage",
                  list: (backupData.pages || []) as any[],
                })

                const lights: Step[] = []
                const snapshots: SnapshotResource[] = []

                backupData.pages.forEach(page => {
                  if(page.plainData?.steps && page.plainData.steps.length > 0){
                    page.plainData.steps.forEach(function (step) {
                      const tempLight = LightFormatFromWebPage(step,page);
                      lights.push(tempLight)
                    })
                    page.plainData.steps = [];
                  }
                  // 低版本的数据兼容处理
                  if(page.plainData?.snapshots && page.plainData.snapshots.length > 0){
                    page.plainData.snapshots.forEach(function (item) {
                      snapshots.push({
                        height: 0,
                        width: 0,
                        pageUrl: page.url || page.key || '',
                        updateAt: Date.now(),
                        key: md5(item),
                        pageKey: page.key || '',
                        url: item as string,
                        type: MetaResourceType.image,
                        createAt: Date.now(),
                        thumb: '',
                        deleted: false,
                        contentType: ContentType.jpeg,
                      })
                    })
                    page.plainData.snapshots = [];
                  }

                })
                if(lights.length > 0){
                  mergeBackupData.items.push({
                    db: "lightpage",
                    table: "light",
                    list: lights,
                  })
                }
                if(snapshots.length > 0){
                  mergeBackupData.items.push({
                    db: "lightpage",
                    table: "snapshot",
                    list: snapshots,
                  })
                }
              }
              if(backupData.lights && backupData.lights.length > 0){
                mergeBackupData.items.push({
                  db: "lightpage",
                  table: "light",
                  list: (backupData.lights || []) as any[],
                })
              }
              if(backupData.box && backupData.box.length > 0){
                mergeBackupData.items.push({
                  db: "boxroom",
                  table: "clipboard",
                  list: (backupData.box || []) as any[],
                })
              }
              if(backupData.snapshots && backupData.snapshots.length > 0){
                mergeBackupData.items.push({
                  db: "lightpage",
                  table: "snapshot",
                  list: (backupData.snapshots || []) as any[],
                })
              }
              // @ts-ignore
              backupData.notes = backupData.notes || backupData.note || [];
              if(backupData.notes && backupData.notes.length > 0){
                mergeBackupData.items.push({
                  db: "lightnote",
                  table: "note",
                  list: (backupData.notes || []) as any[],
                })
              }
              if(backupData.htmlList && backupData.htmlList.length > 0){
                mergeBackupData.items.push({
                  db: "resource",
                  table: "html",
                  list: (backupData.htmlList || []) as any[],
                })
              }

              mergeBackupData.pages = [];
              mergeBackupData.notes = [];
              mergeBackupData.htmlList = [];
              mergeBackupData.lights = [];
              mergeBackupData.box =  [];
              mergeBackupData.snapshots =  [];
            }
          } else {
            toast('解析备份文件失败', 'error')
          }
        }catch (e) {
          toast('解析备份文件失败，请联系管理员', 'error')
        }
      }

      console.log(mergeBackupData,'mergeBackupData')
      setBackupData(mergeBackupData)
      setShowConfirmModal(true)
    }).catch(function (reason) {
      console.error(reason)
      toast('读取备份文件失败', 'error')
    })
  }

  function onDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    onImportBackup(e.dataTransfer.files)
  }

  function onDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div className="">
      {children}
      <div>
        <Dialog >
          <DialogTrigger asChild>
            <Button variant={'outline'} className={'w-full block'}>
              备份
            </Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>导出数据</DialogTitle>
              <DialogDescription>保存为单个备份文件，你可以导入到其他设备以实现数据交换</DialogDescription>
            </DialogHeader>
            <ExportFilter />
          </DialogContent>
        </Dialog>


        <div className={'mt-6 p-4 rounded border-2 border-dashed border-gray-300'}>
          <label
              htmlFor={'backup-input'}
              className={'text-center cursor-pointer'}
              onDropCapture={onDrop}
              onDragOver={onDragOver}
          >
            <div className={'flex justify-center'}>
              <UploadIcon className={'h-8 w-8'} />
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-sm text-center text-muted-foreground">
                拖入文件至此处，或选择文件
              </p>
            </div>
            <input
                id={'backup-input'}
                type="file"
                multiple
                className={'h-0 block w-0'}
                onChange={(e)=>{
                  // @ts-ignore
                  onImportBackup(e?.target?.files || [])
                }}
            />
          </label>
        </div>
      </div>
      {showConfirmModal && backupData && (
        <div className="modal modal-open">
          <div className="modal-box">
            <button
              className={'absolute right-4'}
              onClick={() => {
                setShowConfirmModal(false)
              }}
            >
              <CloseSvg />
            </button>
            <ImportFilter
              backupData={backupData}
              onSuccess={() => {
                setShowConfirmModal(false);
                setBackupData(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

ImportAndExport.defaultProps = {}
