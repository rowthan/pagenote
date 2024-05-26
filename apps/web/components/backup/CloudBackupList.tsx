import {type ReactNode, useState} from 'react';
import extApi from '@pagenote/shared/lib/pagenote-api'
import BasicSettingLine, {
    BasicSettingDescription,
    BasicSettingTitle,
    SettingSection
} from "../setting/BasicSettingLine";
import useWhoAmi from "../../hooks/useWhoAmi";
import {MdDownloading} from "react-icons/md";
import Status from "../Status";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "../../@/components/ui/dialog";
import {Button} from "../../@/components/ui/button";
import useBackupList from "../../hooks/useBackupList";
import {toast} from "../../@/components/ui/use-toast";
import {ToastAction} from "../../@/components/ui/toast";
import {getMb} from "../../utils/size";
import useTableQuery from "../../hooks/table/useTableQuery";
import {Collection} from "../../const/collection";
import classNames from "classnames";
import dayjs from "dayjs";
import ImportAndExport from "./extension/ImportAndExport";

interface Props {
    children?: ReactNode;
}

function shortName(filePath: string) {
    const pathArray = filePath.split('/');
    return pathArray.slice(pathArray.length - 1, pathArray.length).join('')
}

const today = dayjs().format('YYYY-MM-DD')
function getDateFromStr(input: string) {
    const matched = input.match(/202\d-\d\d-\d\d/g);
    if (matched) {
        if(today===matched[0]){
            return matched[0]+'（今日）'
        }
        return matched[0]
    }
    return '';
}

function getDid(input: string) {
    const matched = input.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g);
    if (matched) {
        return matched[0]
    }
    return ''
}


export default function CloudBackupList(props: Props) {
    const {children} = props;
    const [whoAmi] = useWhoAmi()
    // const [list] = useBackupList('webdav');
    const [ossList,loadingOss] = useBackupList('oss');
    const [webdavList,loadingWebdav] = useBackupList('webdav');

    const [backLink,setBackLink] = useState('');
    const [importing,setImporting] = useState(false);
    const {data,mutate : refreshList} = useTableQuery<{key: string,filePath: string,protocol: string}>(Collection.file, {
        query: {
            protocol: 'oss:',
        },
        projection:{
            key: 1,
            filePath: 1
        }
    })

    console.log(data,'temps')

    function doImportBackFile(url: string) {
        setImporting(true)
        extApi.lightpage.importBackup({
            filePath: url,
        },{
            timeout: 20 * 1000
        }).then(function (res) {
            console.log('导入结果',res)
            toast({
                variant: res.error ? "destructive" : 'default',
                title: res.error || '导入成功',
                action: (res.statusText && res.statusText.startsWith('http')) ? <ToastAction altText={'修复'} onClick={function () {
                    window.open(res.statusText)
                }}>
                    修复
                </ToastAction> : <div></div>,
            })
            if(res.success){
                setBackLink('')
            }
        }).finally(function(){
            setImporting(false)
            refreshList();
        })
    }

    return (
        <div className="">
            <ImportAndExport />
            <BasicSettingTitle>
                备份列表
            </BasicSettingTitle>
            <SettingSection loading={(ossList.length+webdavList.length===0) && (loadingOss || loadingWebdav)}>
                {
                    [...ossList,...webdavList].map((item, index) => {
                        const did = getDid(item.filename);
                        let subLabel = '';
                        if (did === whoAmi?.did) {
                            subLabel = '由本设备上传'
                        } else if(did){
                            subLabel = `由其他设备(${did})上传`
                        } else{
                            subLabel = shortName(item.filename)
                        }
                        // const filePath = item.filename.startsWith('http') ? item.filename :    `webdav:${item.filename}`
                        const icon = item.url ? "https://pagenote.cn/favicon.ico" : "https://pagenote-public.oss-cn-beijing.aliyuncs.com/0000/webdav.jpeg"
                        const loaded = data.some(function(temp){
                            return temp.filePath === item.filename
                        })
                        return (
                            <BasicSettingLine key={index}
                                              badge={
                                                  <Status>
                                                      <img src={icon} alt=""/>
                                                  </Status>
                                              }
                                              label={
                                                    <span>
                                                        {getDateFromStr(item.filename)}
                                                        <span className={'ml-2 text-xs'}>
                                                            {getMb(item.size)}
                                                        </span>
                                                    </span>
                                                }
                                              right={
                                                  <div>
                                                      {
                                                          item.importUrl &&
                                                          <button onClick={() => {
                                                              setBackLink(item.importUrl)
                                                          }}><MdDownloading className={classNames({
                                                              'text-green-500': loaded,
                                                              'text-gray-500': !loaded,
                                                          })} size={20}/>
                                                         </button>
                                                      }
                                                  </div>
                                              }
                                              subLabel={subLabel}>
                            </BasicSettingLine>
                        )

                    })
                }
            </SettingSection>
            <BasicSettingDescription>
                PAGENOTE 将为你保留近1月内，最多 30 个备份文件。
            </BasicSettingDescription>
            <Dialog open={!!backLink} onOpenChange={(show)=>{!show && setBackLink('')}}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>确定导入该备份文件?</DialogTitle>
                        <DialogDescription>
                            导入数据将与当前插件内数据比较，取最新的数据。
                        </DialogDescription>
                    </DialogHeader>
                    <Button loading={importing} disabled={importing} onClick={()=>{doImportBackFile(backLink)}}>继续</Button>

                    {/*<DialogFooter>*/}
                    {/*    /!*<AlertDialogCancel>Cancel</AlertDialogCancel>*!/*/}

                    {/*</DialogFooter>*/}
                </DialogContent>
            </Dialog>
            {children}
        </div>
    );
}

