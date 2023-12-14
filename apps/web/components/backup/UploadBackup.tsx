import * as React from "react";
import { useRef, useState} from "react";
import {resolveImportString} from "@pagenote/shared/lib/utils/data";
import {addBackup} from "./db";
import dayjs from "dayjs";


export default function UploadBackup(props:{onUpload:()=>void}) {
    const [loading,setLoading] = useState(false);
    const input = useRef(null);


    function onImportData (e:any){
        setLoading(true)
        const selectedFile = e.target.files[0];
        const reader = new FileReader();//这是核心,读取操作就是由它完成.
        reader.readAsText(selectedFile);//读取文件的内容,也可以读取文件的URL
        reader.onload = function () {
            if (typeof this.result === "string") {
                const backupData = resolveImportString(this.result);
                if(backupData){
                    const {backupId,remark, pages=[], lights=[], version=0} = backupData
                    backupData.backupId = backupId || dayjs().format('YYYY-MM-DD_HH_mm_ss')
                    backupData.remark = remark || `${pages?.length} 个网页；${lights?.length || 0} 个标记；${version<=3 ? '低版本备份数据，请使用新版插件备份': ''} 。`
                    addBackup(backupData).then(function () {
                        props.onUpload()
                    })
                }
                setLoading(false)
            }
        }
    }

    return(
        <div>

                {/*<div className="form-control w-full max-w-xs">*/}
                {/*    <label className="label">*/}
                {/*        <span className="label-text">上传备份文件</span>*/}
                {/*    </label>*/}
                {/*    <input type="file"  onChange={onImportData}  className="file-input file-input-bordered w-full max-w-xs" />*/}
                {/*</div>*/}

                <input id="import-data" ref={input} type="file" style={{display: "none"}} onChange={onImportData} />
                <label htmlFor="import-data">
                    <span
                        className="btn btn-outline btn-success">
                        上传备份文件
                    </span>
                </label>
        </div>
    )
}
