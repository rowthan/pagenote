import { useState } from 'react'
import { WebPage } from '@pagenote/shared/lib/@types/data'
import { useLazyEffect } from '../../hooks/userLazyEffect'
import { batchExportByPageKeys, searchInExt } from 'service/ext'
import WebPageItem from '../webpage/WebPageItem'
import Modal from '../Modal'

export default function Search(props: { keyword: string }) {
  const { keyword = '' } = props
  const [list, setList] = useState<Partial<WebPage>[]>([])
  const [limit, setLimit] = useState(20)
  const [selected, setSelected] = useState<string[]>([])
  const [batchModal, setBatchModal] = useState(false)
  const [cost, setCost] = useState(0)
  const search = function () {
    // TODO 搜索所有tab 标签页 多关键词搜索🔍
    if (keyword.trim()) {
      setCost(0)
      const start = Date.now()
      searchInExt(keyword, (result) => {
        setList(result)
        setSelected([])
        setLimit(20)
        setCost(Date.now() - start)
      })
    } else {
      setSelected([])
      setList([])
    }
  }

  function toggleAll() {
    if (selected.length === 0) {
      setSelected(list.map((item) => item.key || ''))
    } else {
      setSelected([])
    }
  }

  function toggleSelected(id: string) {
    const index = selected.indexOf(id)
    if (index !== -1) {
      selected.splice(index, 1)
    } else {
      selected.push(id)
    }
    setSelected([...selected])
  }

  function batchExport() {
    batchExportByPageKeys(selected)
  }

  useLazyEffect(search, [keyword], 400)

  const keywords = keyword.split(/\s+/)
  const selectedCnt = selected.length

  return (
    <div className={'p-2 w-full h-full overflow-ellipsis'}>
      <div className={'text-gray-400 text-xs '}>
        {keyword ? (
          <div>
            <span>
              PAGENOTE 为你找到{' '}
              {keywords.map((item) => (
                <mark key={item} className="mx-1">
                  {item}
                </mark>
              ))}
              相关搜索标记约 {list.length} 个。
            </span>
            {cost > 0 && (
              <span className="text-xs text-center">
                <span className="text-gray-400">
                  搜索耗时：<b>{cost / 1000}</b>s
                </span>
              </span>
            )}
          </div>
        ) : (
          <span>请输入搜索词，在 PAGENOTE 中搜索</span>
        )}

        <div className="my-4 flex items-center">
          <input
            type="checkbox"
            onChange={toggleAll}
            checked={selectedCnt > 0}
            className="checkbox mx-1"
          />
          <button
            onClick={() => {
              setBatchModal(true)
            }}
            disabled={selectedCnt === 0}
            className="btn btn-xs btn-primary mx-2"
          >
            批量操作{selectedCnt > 0 ? selectedCnt : ''}
          </button>
        </div>
      </div>
      {/*分组 折叠，搜 pagenote笔记\搜标签页、搜扩展API*/}
      <ul className={'relative'}>
        {list.slice(0, limit).map((item, index) => (
          <li className={'relative mb-2 border-b border-gray-400'} key={index}>
            <WebPageItem keyword={keyword} webpage={item} />
            <input
              type="checkbox"
              onChange={() => {
                toggleSelected(item.key || '')
              }}
              checked={selected.includes(item.key || '')}
              className="checkbox checkbox-info absolute left-1 top-2 bg-white bg-opacity-50"
            />
          </li>
        ))}
      </ul>

      {/*<div className={''}>*/}
      {/*    分页*/}
      {/*</div>*/}
      {limit < list.length && (
        <div className="divider mb-2 pb-2">
          <button
            onClick={() => {
              setLimit(list.length)
            }}
            className={'link link-primary text-xs'}
          >
            展开所有
          </button>
        </div>
      )}

      <Modal open={batchModal} keepNode={false} toggleOpen={setBatchModal}>
        <>
          <h2>
            批量操作 {selectedCnt} 个网页
            <br />
            及关联的标记、截图、存档HTML等相关信息
          </h2>
          <div className="my-2 text-right">
            {/*<button onClick={batchUpdate} className={'btn btn-sm btn-error'}>删除</button>*/}
            <button
              onClick={batchExport}
              className={'btn btn-sm btn-primary ml-2'}
            >
              备份
            </button>
          </div>
        </>
      </Modal>
    </div>
  )
}
