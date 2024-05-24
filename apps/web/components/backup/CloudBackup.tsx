import React, {type ReactNode, useState} from 'react';
import {Switch} from "../../@/components/ui/switch";
import BasicSettingLine, {BasicSettingDescription, BasicSettingTitle, StatBadge} from "../setting/BasicSettingLine";
import CloudSupporters from "./CloudSupporters";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import useSettingConfig from "../../hooks/table/useSettingConfig";
import classNames from "classnames";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../@/components/ui/dialog";
import {Button} from "../../@/components/ui/button";
import ExportFilter from "./extension/ExportFilter";
import ImportAndExport from "./extension/ImportAndExport";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "../../@/components/ui/alert-dialog";
import {basePath} from "../../const/env";
import CloudBackupList from "./CloudBackupList";
import Link from "next/link";
import {NavLink} from "react-router-dom";
import CloudStat from "../stat/CloudStat";

interface Props {
    children?: ReactNode;
}

export default function CloudBackup(props: Props) {
    const {children} = props;
    const [config,update] = useSettingConfig<{
        switch: boolean,
        pagenote: boolean
    }>('_cloud');
    const [showImport,setShowImport] = useState(false)
    const [showSupporters,setShowSupporters] = useState(false)

    return (
        <div className="flex flex-col gap-6">
            <div className={'bg-card rounded-lg'}>
                <div className={'p-2'}>
                    <MdOutlineSettingsBackupRestore className={classNames('text-[40px] text-blue-400 m-auto',{
                        'grayscale': !config?.switch
                    })} />
                    <h2 className={'text-lg text-accent-foreground font-bold text-center'}>备份</h2>
                    <div className={'p-2  text-sm text-muted-foreground'}>
                        备份全量数据。当你重装插件、数据意外丢失数据、或重新在其他浏览器安装新的插件时，备份数据便于你快速地恢复数据。
                        {/*<div className={'p-2 text-center'}>*/}
                        {/*    <Dialog>*/}
                        {/*        <DialogTrigger asChild>*/}
                        {/*            <span className={'a'}>*/}
                        {/*                本地备份*/}
                        {/*            </span>*/}
                        {/*        </DialogTrigger>*/}
                        {/*        <DialogContent className="">*/}
                        {/*            <DialogHeader>*/}
                        {/*                <DialogTitle>导出数据</DialogTitle>*/}
                        {/*                <DialogDescription>保存为单个备份文件或压缩包，你可以将该文件导入到其他设备中以实现数据交换*/}
                        {/*                </DialogDescription>*/}
                        {/*            </DialogHeader>*/}
                        {/*            <ExportFilter exportBy={'extension'}/>*/}
                        {/*        </DialogContent>*/}
                        {/*    </Dialog>*/}
                        {/*    /*/}
                        {/*    /!*<span className={'a'} onClick={() => {*!/*/}
                        {/*    /!*    setShowImport(true)*!/*/}
                        {/*    /!*}}>*!/*/}
                        {/*    /!*    导入备份*!/*/}
                        {/*    /!*</span>*!/*/}
                        {/*    <a className={'more'}*/}
                        {/*       href={`${basePath}/ext/setting.html#/data/backup`}>导入备份</a>*/}
                        {/*</div>*/}


                        <AlertDialog open={showImport} onOpenChange={setShowImport}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>导入备份文件</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <p>
                                            滞后的数据不会写入插件内。如果导入文件和当前插件内同时存在同一条标记数据，则会保留最后修改的一条
                                        </p>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <ImportAndExport/>
                                <AlertDialogFooter>
                                    {/*<AlertDialogCancel>Cancel</AlertDialogCancel>*/}
                                    <AlertDialogAction>完成</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                <hr className={'w-[90%] mx-auto'}/>
                <BasicSettingLine label={'云备份此设备'}
                                  subLabel={config?.switch ? <span>
                                      将在系统闲置时备份今日数据至
                                       <NavLink className={'a'} to={'/data/cloud-supporters'}>云端</NavLink>
                                  </span>:''}
                                  right={
                                      <>
                                          {
                                              config?.switch && <CloudStat types={['oss','webdav']}/>
                                          }
                                          <Switch checked={config?.switch} onCheckedChange={(checked)=>{
                                              update({
                                                  switch: checked,
                                                  pagenote: checked,
                                              })
                                              if(checked){
                                                  setShowSupporters(true)
                                              }
                                          }} />
                                      </>
                }>

                </BasicSettingLine>
                {
                    config?.switch &&
                    <BasicSettingLine label={'云备份历史'} path={'/data/cloud-backup/history'} />
                }
            </div>

            <div>
                <div>
                    <Dialog>
                        <DialogTrigger className={'block w-full'}>
                            <BasicSettingLine className={'w-full text-blue-400'} label={'立即备份'}></BasicSettingLine>
                        </DialogTrigger>
                        <DialogContent className="">
                            <DialogHeader>
                                <DialogTitle>备份文件</DialogTitle>
                                <DialogDescription>
                                    选择备份到本地或云端
                                </DialogDescription>
                            </DialogHeader>
                            <ExportFilter exportBy={'extension'}/>
                        </DialogContent>
                    </Dialog>
                </div>
                <BasicSettingDescription>
                    <a className={'more'}
                       href={`${basePath}/ext/setting.html#/data/backup`}>导入备份</a>可用于数据还原、交换。备份文件未经过加密处理，请妥善保管文件。
                </BasicSettingDescription>
            </div>

            {/*<div>*/}
            {/*    <Dialog>*/}
            {/*        <DialogTrigger asChild>*/}
            {/*            <Button className={'w-full a block text-left'} variant={'outline'}>*/}
            {/*                立即备份*/}
            {/*            </Button>*/}
            {/*        </DialogTrigger>*/}
            {/*        <DialogContent className="">*/}
            {/*            <DialogHeader>*/}
            {/*                <DialogTitle>导出数据</DialogTitle>*/}
            {/*                <DialogDescription>保存为单个备份文件或压缩包，你可以将该文件导入到其他设备中以实现数据交换*/}
            {/*                </DialogDescription>*/}
            {/*            </DialogHeader>*/}
            {/*            <ExportFilter exportBy={'extension'}/>*/}
            {/*        </DialogContent>*/}
            {/*    </Dialog>*/}
            {/*    <a className={'more text-sm pl-4'}*/}
            {/*       href={`${basePath}/ext/setting.html#/data/backup`}>导入备份</a>*/}
            {/*</div>*/}

            <Dialog open={showSupporters} onOpenChange={setShowSupporters}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>选择将数据存储至何处?</DialogTitle>
                        <DialogDescription>
                            <CloudSupporters />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/*{*/}
            {/*    config?.switch &&*/}
            {/*    <CloudSupporters />*/}
            {/*}*/}
        </div>
    );
}

