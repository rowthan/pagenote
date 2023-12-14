import React, {type ReactNode, useCallback, useEffect, useRef} from 'react';
import useTableQuery from "../../hooks/table/useTableQuery";
import {Note} from "@pagenote/shared/lib/@types/data";
import {Collection, dbTableMap} from "../../const/collection";
import Tiptap, {EditorChangeContent} from "./TipTap";
import extApi from "@pagenote/shared/lib/pagenote-api";
import {Editor} from "@tiptap/react/src/Editor";
import TipEditor from "./TipTap";
import {debounce} from 'lodash'

interface Props {
    children?: ReactNode;
    id: string
    className?: string
    afterUpdate?: (change: EditorChangeContent,origin: Partial<Note>) => void
}


export default function Memo(props: Props) {
    const { id,className,children,afterUpdate } = props
    const { data, isLoading, mutate } = useTableQuery<Note>(Collection.note, {
        query: {
            key: id,
        },
        limit: 1,
    })
    const ref = useRef<{editor: Editor}>(null);
    const lock = useRef(0);
    function removeMemo(key: string = '') {
        return extApi.table
            .remove({
                ...dbTableMap[Collection.note],
                params: [key],
            })
    }


    const onUpdate = useCallback(debounce(function (change: EditorChangeContent) {
        const timeStamp = Date.now();
        lock.current = timeStamp;
        const updateData = {
            //@ts-ignore todo
            html: change.htmlContent || '',
            tiptap: change.jsonContent,
            updateAt: timeStamp
        }
        extApi.table
            .update({
                ...dbTableMap[Collection.note],
                params: {
                    keys: [id],
                    data: updateData,
                    upsert: true
                },
            })
            .then(function (res) {
                afterUpdate && afterUpdate(change,data[0])
                mutate()
            })
    },200),[id])



    useEffect(function () {
        const memo = data[0];
        if(memo?.updateAt !== lock.current){
            ref.current?.editor?.commands.setContent(memo?.tiptap || memo?.html || '')
        }
    },[data])


    const memo = data[0];
    if(isLoading || !id){
        return <div>loading...</div>
    }
    return (
        <TipEditor
            ref={ref}
            className={className}
            htmlContent={memo?.html || ''}
            onUpdate={(data) => {
                onUpdate(data)
            }}
        >{children}</TipEditor>
    );
}
