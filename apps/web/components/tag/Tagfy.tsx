import * as React from 'react'
import { type ReactNode, useState } from 'react'
import ButtonIcon from 'components/button/IconButton'
import { PiHashStraightDuotone as TagIcon } from 'react-icons/pi'
import Tag from './Tag'
import { TagsInput } from 'react-tag-input-component'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import useWebpage from 'hooks/useWebpage'
import useTabPagenoteState from 'hooks/useTabPagenoteState'
import useKeys from 'hooks/table/useKeys'
import { Collection } from 'const/collection'
import { Button } from '@/components/ui/button'
import Keywords from '../Keywords'

interface Props {
  children?: ReactNode
  pageKey: string
}

interface TagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string
}

function TagItem(props: TagProps) {
  const { color, ...left } = props
  return (
    <ButtonIcon className={'text-xs'} {...left}>
      <TagIcon />
    </ButtonIcon>
  )
}

export default function Tagfy(props: Props) {
  const { pageKey } = props
  const { data, updateServer } = useWebpage(pageKey)
  const [open, setOpen] = useState(false)
  const tags: string[] = data?.categories || [] // ['red','green','yellow'];
  const [content] = useTabPagenoteState()
  const [categories] = useKeys<string[]>(Collection.webpage, 'categories')
  const keywords: string[] = content?.keywords || []
  const set = new Set(tags)
  const [filterKey, setFilterKey] = useState<string>('')

  function updateTags(tags: string[]) {
    // setSelected(tags);
    updateServer({
      categories: tags,
    })
  }

  function addTag(tag: string | string[]) {
    if (set.size > 10) {
      alert('最多添加10个标签')
      return
    }
    const newList = typeof tag === 'string' ? [tag] : tag
    newList.forEach(function (item) {
      set.add(item)
    })
    updateTags(Array.from(set))
  }

  function search(value: string) {
    setFilterKey((value || '').trim().toLowerCase())
  }

  return (
    <>
      <div
        onClick={() => {
          setOpen(true)
        }}
        className={
          ' py-2 relative w-full min-h-4 flex flex-wrap gap-1 items-center group hover:bg-card'
        }
      >
        {tags.length === 0 && <TagItem />}
        {tags.map((color, index) => (
          <Tag key={color}>#{color}</Tag>
        ))}
        <span
          className={' text-xs text-muted-foreground hidden group-hover:flex'}
        >
          点击管理标签
        </span>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger></SheetTrigger>
        <SheetContent side={'top'}>
          <SheetHeader>
            <SheetTitle>添加标签</SheetTitle>
            <SheetDescription>
              添加标签，有利于你更好分类、管理网页、快速检索。
            </SheetDescription>
          </SheetHeader>
          <div className={'py-6'}>
            <TagsInput
              value={tags}
              onChange={updateTags}
              name="categories"
              placeHolder="请添加标签"
              classNames={{
                tag: 'text-blue-400 text-sm',
              }}
              // @ts-ignore
              onKeyUp={(e) => search(e.target?.value)}
            />
            <div className={'mt-2'}>
              <h3>
                推荐标签
                {keywords.length > 0 && (
                  <Button
                    onClick={() => {
                      addTag(keywords)
                    }}
                    variant={'link'}
                    size={'sm'}
                  >
                    一键采纳
                  </Button>
                )}
              </h3>
              {keywords.map((word, index) =>
                set.has(word) ? null : (
                  <Keywords
                    onClick={() => {
                      addTag(word)
                    }}
                    key={word}
                  >
                    {word}
                  </Keywords>
                )
              )}
              <div>
                <div>历史标签</div>
                {categories
                  .filter(function (value) {
                    if (!filterKey) {
                      return true
                    } else {
                      return value?.toLowerCase().indexOf(filterKey) !== -1
                    }
                  })
                  .map((word) =>
                    set.has(word) ? null : (
                      <Keywords
                        className={'text-blue-300'}
                        onClick={() => {
                          addTag(word)
                        }}
                        key={word}
                      >
                        {word}
                      </Keywords>
                    )
                  )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

Tagfy.defaultProps = {}
