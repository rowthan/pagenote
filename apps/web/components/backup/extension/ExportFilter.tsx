import React, { useState } from 'react'
import extApi from '@pagenote/shared/lib/pagenote-api'
import {
  BackupData,
  BackupVersion,
  ContentType,
} from '@pagenote/shared/lib/@types/data'
import dayjs from 'dayjs'
import useWhoAmi from 'hooks/useWhoAmi'
import { Button } from '@/components/ui/button'

function queryAllData(db: string, table: string) {
  return extApi.table
    .query({
      db: db,
      table: table,
      params: {
        limit: 999999,
      },
    })
    .then(function (res) {
      return res.data?.list || []
    })
}

export default function ExportFilter(props:{exportBy: 'web'|'extension'}) {
  const [downloading, setDownloading] = useState(false)
  const [whoAmI] = useWhoAmi()

  async function exportData(type=props.exportBy) {
    setDownloading(true)
    const localDownload = type === 'web';
    if (localDownload) {
      const [lights, notes, snapshots, pages, htmlList] = await Promise.all([
        queryAllData('lightpage', 'light'),
        queryAllData('lightpage', 'note'),
        queryAllData('lightpage', 'snapshot'),
        queryAllData('lightpage', 'webpage'),
        queryAllData('resource', 'html'),
      ])

      const backup: BackupData = {
        backup_at: Date.now(),
        extension_version: whoAmI?.version,
        version: BackupVersion.version7,
        items: [
          {
            db: 'lightpage',
            table: 'light',
            list: lights,
          },
          {
            db: 'lightpage',
            table: 'note',
            //@ts-ignore
            list: notes,
          },
          {
            db: 'lightpage',
            table: 'snapshot',
            //@ts-ignore
            list: snapshots,
          },
          {
            db: 'lightpage',
            table: 'webpage',
            //@ts-ignore
            list: pages,
          },
          {
            db: 'resource',
            table: 'html',
            //@ts-ignore
            list: htmlList,
          },
        ],
      }
      const blob = new Blob([JSON.stringify(backup)], {
        type: ContentType.json,
      })
      const url = URL.createObjectURL(blob)
      const filename = `${dayjs().format('YYYY-MM-DD')}.v${
        BackupVersion.version8
      }.pagenote.bak`
      extApi.developer
        .chrome({
          namespace: 'downloads',
          type: 'download',
          method: "download",
          arguments: [
            {
              saveAs: true,
              url: url,
              filename: filename,
            },
          ],
          args: [
            {
              saveAs: true,
              url: url,
              filename: filename,
            },
          ],
        })
        .then(function () {
          URL.revokeObjectURL(url)
          setDownloading(false)
        })
    } else {
      extApi.lightpage.exportBackup([],{
        timeout: 1000 * 60
      }).then(function(){
        setDownloading(false)
      })
    }
  }

  return (
    <div>
      <Button
        disabled={downloading}
        loading={downloading}
        className={'btn btn-sm w-full'}
        onClick={()=>{exportData('extension')}}
      >
        下载备份文件
      </Button>
    </div>
  )
}
