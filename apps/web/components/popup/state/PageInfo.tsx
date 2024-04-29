import extApi from '@pagenote/shared/lib/pagenote-api'
import { ReactNode } from 'react'
import useCurrentTab from 'hooks/useCurrentTab'
import { toast } from 'utils/toast'
import { basePath } from 'const/env'
import { html } from '@pagenote/shared/lib/extApi'
import { CameraIcon, CardStackPlusIcon } from '@radix-ui/react-icons'
import useTableQuery from 'hooks/table/useTableQuery'
import { SnapshotResource, Step } from '@pagenote/shared/lib/@types/data'
import DisableButton from './DisableButton'
import KeyboardTip from '../../KeyboardTip'
import IconButton from '../../button/IconButton'
import { Collection } from '../../../const/collection'
import OfflineHTML = html.OfflineHTML
import { BiHighlight } from 'react-icons/bi'
import useTabPagenoteState from "../../../hooks/useTabPagenoteState";

function Item(props: {
  left: ReactNode
  leftClick?: () => void
  rightClick?: () => void
  right: ReactNode
}) {
  return (
    <div
      className={
        'inline-flex items-center gap-[2px] text-muted-foreground min-w-[40px]'
      }
    >
      <IconButton onClick={props.leftClick}>{props.left}</IconButton>
      <IconButton onClick={props.rightClick} className={'text-xs'}>
        {props.right}
      </IconButton>
    </div>
  )
}

export function PageInfo(props:{pageUrl: string}) {
  const { data: resourceList } = useTableQuery<OfflineHTML>(Collection.html, {
    limit: 9,
    query: {
      relatedPageUrl: props.pageUrl,
    },
    projection: {
      resourceId: 1,
      relatedPageUrl: 1,
    },
  })

  function offlineHtml() {
    if (resourceList.length > 4) {
      alert('请删除历史存档版本后，再创建新版本')
      return
    }
    extApi.developer
      .requestFront({
        params: {
          cssToInline: true,
          imageToLocal: true,
          removeScript: true,
        },
        type: 'offlineHTML',
      })
      .then(function (res) {
        toast(res?.error || '存档成功。')
        setTimeout(function () {
          window.close()
        }, 1000)
      })
  }

  function gotoOffline(resourceList: Partial<OfflineHTML>) {
    window.open(
        `${basePath}/ext/offline.html?id=${resourceList.resourceId}&url=${resourceList.relatedPageUrl}`
    )
  }

  const cnt = resourceList.length
  return (
    <Item
      leftClick={offlineHtml}
      left={
        <KeyboardTip tip={'存档网页'}>
          <span>
            <CardStackPlusIcon />
          </span>
        </KeyboardTip>
      }
      rightClick={() => {
        gotoOffline(resourceList[0])
      }}
      right={<span>{cnt}</span>}
    />
  )
}

export function LightInfo(props:{pageUrl: string}) {
  const { data: lights } = useTableQuery<Step>(Collection.light, {
    limit: 999,
    query: {
      pageKey: props.pageUrl,
    },
    projection: {
      lightId: 1,
    },
  })

  const cnt = lights.length
  return <Item left={<BiHighlight />} right={<span>{cnt}</span>} />
}

interface Props {
  children?: ReactNode
  pageKey: string
  pageUrl: string
}

export function CaptureButton(props: Props) {
  const { pageKey,pageUrl } = props
  const { tab } = useCurrentTab()
  const { data: snapshots = [], mutate: refresh } =
    useTableQuery<SnapshotResource>(Collection.snapshot, {
      limit: 100,
      query: {
        $or: [
          {
            pageKey: pageKey,
          },
          {
            pageUrl: pageUrl,
          },
        ],
      },
      sort: {
        createAt: -1,
      },
      projection: {
        key: 1,
        url: 1,
      },
    })

  function capture() {
    // if (!tabState?.active) {
    //   toast('请在当前标签页启动后再截图')
    //   return
    // }
    if (snapshots.length > 4) {
      alert('请删除历史截图，再创建新截图')
      return
    }

    extApi.developer
      .requestFront({
        header: {
          targetTabId: tab?.id,
        },
        params: {
          fullPage: false,
        },
        type: 'runCaptureTab',
      })
      .then(function (res) {
        refresh()
        console.log('更新结果', res)
      })
  }

  function gotoImg() {
    window.open(
      `${basePath}/ext/gallery.html?pageKey=${encodeURIComponent(pageKey || '')}`
    )
  }

  return (
    <Item
      leftClick={capture}
      left={
        <KeyboardTip command={'capture'} tip={'截图网页'}>
          <span>
            <CameraIcon />
          </span>
        </KeyboardTip>
      }
      rightClick={gotoImg}
      right={
        <KeyboardTip tip={'查看截图'}>
          <span>{snapshots.length}</span>
        </KeyboardTip>
      }
    />
  )
}

CaptureButton.defaultProps = {}
