import { type ReactNode } from 'react'
import Tiptap, { EditorChangeContent } from '../editor/TipTap'
import { Note } from '@pagenote/shared/lib/@types/data'
import extApi from '@pagenote/shared/lib/pagenote-api'
import md5 from 'md5'
import useTableQuery from '../../hooks/table/useTableQuery'
import { Collection, dbTableMap } from '../../const/collection'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { getDomain } from '@pagenote/shared/lib/utils/filter'
import { CiLink, CiShoppingTag } from 'react-icons/ci'
import { GiFamilyTree } from 'react-icons/gi'
import { toast } from '../../@/components/ui/use-toast'
import { SizeIcon } from '@radix-ui/react-icons'
import { basePath } from '../../const/env'
import useWhoAmi from '../../hooks/useWhoAmi'
import Memo from '../editor/Memo'

const ICONS = {
  ['path']: <CiLink />,
  ['url']: <CiLink />,
  ['light']: <CiLink />,
  ['page']: <CiLink />,
  ['tags']: <CiShoppingTag />,
  ['domain']: <GiFamilyTree />,
}

interface Props {
  children?: ReactNode
  url: string
}

function createNewNote(url: string, relatedType: 'path' | 'domain') {
  return {
    title: '',
    createAt: Date.now(),
    updateAt: Date.now(),

    deleted: false,
    hash: '',
    key: md5(url + Date.now()),
    relatedType: relatedType,
    path: getPath(url),
    domain: getDomain(url, false),
    url: url,

    plainType: 'html',
    tiptap: {},
    html: '',
  } as Note
}
function getPath(url: string) {
  if (!url) {
    return ''
  }
  const urlObject = new URL(url)
  return urlObject.origin + urlObject.pathname
}

const RELATED_TYPES = ['path', 'tag', 'domain']
export default function PageMemo(props: Props) {
  const { url } = props
  const path = getPath(url || '')
  const { data, isLoading, mutate } = useTableQuery<Note>(Collection.note, {
    query: {
      $or: [
        {
          path: path,
          relatedType: 'path',
        },
        {
          domain: getDomain(url, false),
          relatedType: 'domain',
        },
        // {
        //   tags: {
        //     $in: categories,
        //   },
        // },
      ],
    },
    limit: 9,
    sort: {
      updateAt: -1,
    },
  })

  function removeMemo(key: string = '') {
    return extApi.table.remove({
      ...dbTableMap[Collection.note],
      params: [key],
    })
  }

  function afterUpdate(change: EditorChangeContent, origin: Partial<Note>) {
    if (!change.textContent && origin && origin?.key) {
      removeMemo(origin.key).then(function () {
        mutate()
      })
    }
  }

  function updateRelatedType(id: string = '', data: Partial<Note>) {
    const updateData = {
      ...data,
      updateAt: Date.now(),
    }
    extApi.table
      .update({
        ...dbTableMap[Collection.note],
        params: {
          keys: [id],
          data: updateData,
        },
      })
      .then(function () {
        mutate()
      })
  }

  function createNewMemo(relatedType: 'path' | 'domain') {
    const memo = createNewNote(url, relatedType)
    extApi.table
      .put({
        ...dbTableMap[Collection.note],
        params: [memo],
      })
      .then(function (res) {
        if (res.error) {
          toast({
            title: '创建失败',
            description: res.error,
          })
        }
        mutate()
      })
  }

  function newTabMemo(key?: string) {
    extApi.commonAction.openTab({
      reUse: true,
      tab: {},
      url: `${window.location?.origin}${basePath}/ext/memo.html?key=${key}`,
    })
  }

  const domain = getDomain(url, false)
  const memos = data.length ? data : [createNewNote(url, 'path')]
  return (
    <div className="mt-3  min-h-10 ">
      {!isLoading && (
        <div>
          {memos.map((item, index) => {
            return (
              <Memo
                afterUpdate={(data) => afterUpdate(data, { key: item.key })}
                key={item.key || ''}
                id={item.key || ''}
                className={
                  'relative rounded border border-accent text-sm bg-[#fbf4edc7] dark:bg-[#4c3d2fc7] mb-4'
                }
              >
                <button
                  onClick={() => {
                    newTabMemo(item.key)
                  }}
                  className={'absolute right-1 top-1 z-10'}
                >
                  <SizeIcon />
                </button>
                <Menubar
                  className={
                    'absolute right-1 bottom-1 shadow-none  border-none h-auto p-0 z-10'
                  }
                >
                  <MenubarMenu>
                    <MenubarTrigger className={'px-1'}>
                      {ICONS[item.relatedType || 'path']}
                    </MenubarTrigger>
                    <MenubarContent>
                      <MenubarCheckboxItem disabled>
                        此备忘录共享规则
                      </MenubarCheckboxItem>
                      <MenubarCheckboxItem
                        onClick={() => {
                          updateRelatedType(item.key, {
                            relatedType: 'path',
                            path: getPath(url),
                          })
                        }}
                        checked={item.relatedType === 'path'}
                      >
                        <CiLink />
                        仅本网页可见
                      </MenubarCheckboxItem>
                      <MenubarCheckboxItem
                        onClick={() => {
                          updateRelatedType(item.key, {
                            relatedType: 'domain',
                            domain: domain,
                          })
                        }}
                        disabled={!item.html}
                        checked={item.relatedType === 'domain'}
                      >
                        <GiFamilyTree />与<b>同域名</b>（{domain}）共享
                      </MenubarCheckboxItem>
                      {/*<MenubarCheckboxItem checked={item.relatedType === 'tags'}>*/}
                      {/*  <CiShoppingTag />与<b>同标签</b>共享*/}
                      {/*</MenubarCheckboxItem>*/}
                      <MenubarSeparator />
                      <MenubarItem inset onClick={() => createNewMemo('path')}>
                        新增备忘录
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </Memo>
            )
          })}
        </div>
      )}
    </div>
  )
}

PageMemo.defaultProps = {}
