import * as React from "react";
import {ReactElement, useEffect, useRef, useState} from "react";
import {Pagination} from "@pagenote/shared/lib/@types/database";
import get from 'lodash/get';

interface Props<T> {
    list: T[],
    headLabels: string[]
    renderTDS: (item: T, index: number) => ReactElement,
    footerTR?: ReactElement,
    footerTD?: ReactElement,
    pagination: Pagination
    onPaginationChange: (page: number, pageSize: number) => void
    selectedIds: Set<string>,
    onSelectIds: (newSelected: Set<string>) => void,
    primaryKey: string
    disableSelect?: boolean
    pageSteps?: number[]
}

/**
 * 通用型table组件，支持分页、批量选择
 * */
export default function Table<T>(props: Props<any>) {
    const {
        selectedIds = new Set(),
        onSelectIds,
        primaryKey,
        list,
        renderTDS,
        footerTR,
        footerTD,
        headLabels = [],
        pagination = {total: 0, pageSize: 10, page: 0},
        onPaginationChange,
        disableSelect = false,
        pageSteps = [10,100,1000]
    } = props;
    const {total = 0, pageSize = 10, page = 0} = pagination;
    const pages = Math.fround(total / pageSize)

    const [allChecked, setAllChecked] = useState(false)
    const allCheckRef = useRef<HTMLInputElement>(null);

    useEffect(function () {
        let allCheckedTemp: boolean;
        if (selectedIds.size === 0) {
            allCheckedTemp = false;
        } else {
            allCheckedTemp = list.every(function (item) {
                return selectedIds.has(get(item, primaryKey))
            })
        }
        setAllChecked(allCheckedTemp)

        if (allCheckRef.current) {
            if (selectedIds.size === 0) {
                // @ts-ignore
                allCheckRef.current.indeterminate = undefined;
            } else {
                allCheckRef.current.indeterminate = !allCheckedTemp;
            }
        }
    }, [selectedIds, list])

    function toggleSelect(id: string) {
        if (selectedIds.has(id)) {
            selectedIds.delete(id)
        } else {
            selectedIds.add(id)
        }

        onSelectIds(new Set(selectedIds))
    }

    function toggleAll() {
        if (allChecked) {
            onSelectIds(new Set())
        } else {
            const ids = list.map(function (item) {
                return get(item, primaryKey)
            })
            onSelectIds(new Set(ids))
        }
    }

    const colspan = headLabels.length - 1 + (disableSelect ? 0 : 1)
    return (
        <table className="table table-compact w-full min-h-100 mx-auto">
            <thead>
            <tr>
                {
                    disableSelect ? null :
                        <th className='w-4'>
                            <label>
                                <input
                                    ref={allCheckRef}
                                    onChange={toggleAll}
                                    checked={allChecked}
                                    type="checkbox" className="checkbox"/>
                            </label>
                        </th>
                }

                {
                    headLabels.map(function (item) {
                        return <th key={item}>{item}</th>
                    })
                }
            </tr>
            </thead>
            <tbody>
            {
                list.map(function (item, index) {
                    return (
                        <tr key={index}>
                            {
                                disableSelect ? null :
                                    <td className=''>
                                        <label>
                                            <input onChange={() => {
                                                toggleSelect(get(item, primaryKey))
                                            }}
                                                   checked={selectedIds.has(get(item, primaryKey))}
                                                   type="checkbox" className="checkbox"/>
                                        </label>
                                    </td>
                            }

                            {renderTDS(item, index)}
                        </tr>

                    )
                })
            }
            </tbody>
            <tfoot className='sticky bottom-0'>
            <tr>
                <th colSpan={colspan}>
                    <div className=' btn-group flex  items-center'>
                        <div className="btn-group">
                            <button className="btn btn-sm" disabled={page === 0} onClick={() => {
                                onPaginationChange(page - 1, pageSize)
                            }}>«
                            </button>
                            {/* TODO 这里改为跳页 */}
                            <button className="btn btn-sm">{page + 1}</button>
                            <button className="btn btn-sm" disabled={page >= pages - 1} onClick={() => {
                                onPaginationChange(page + 1, pageSize)
                            }}>»
                            </button>
                        </div>
                        <select value={pageSize} onChange={(e) => {
                            onPaginationChange(page, Number(e.target.value))
                        }} className="ml-2 select select-bordered select-sm">
                            {
                                pageSteps.map(function (value) {
                                    return (
                                        <option key={value} value={value}>
                                            {value}条/每页
                                        </option>
                                    )
                                })
                            }
                        </select>
                        <span className='text-xs text-gray-400 ml-2'>
                            共计 {total} 条
                        </span>
                    </div>
                </th>
                <th>
                    {footerTD}
                </th>
            </tr>
            {footerTR}
            </tfoot>
        </table>
    )
}
