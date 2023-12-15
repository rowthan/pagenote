import {useRouter} from "next/router";
import MemoComponent from 'components/editor/Memo'
import useTableQuery from "../../hooks/table/useTableQuery";
import {Note} from "@pagenote/shared/lib/@types/data";
import {Collection} from "../../const/collection";
export default function Memo() {
    const {query} = useRouter();
    const key = (query.key || '').toString()
    const { data, isLoading, mutate } = useTableQuery<Note>(Collection.note, {
        query: {
            key: key,
        },
        limit: 1,
    })

    const memo = data?.[0];
    return (
      <div className="max-w-5xl m-auto my-1">
        <MemoComponent id={key} className={'single-memo'}></MemoComponent>
        <hr />
        {memo && (
          <div className={'text-xs text-muted-foreground mt-2'}>
            from{' '}
            <a
              className={'link link-info'}
              href={memo.url || memo.path || memo.domain}
            >
              {memo.url || memo.path || memo.domain}
            </a>
          </div>
        )}
      </div>
    )
}
