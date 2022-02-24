import {getBridge} from "@/utils/api";


const ACTIONS = {
    deleteFile: 'delete',
}


const CreatePage = function () {

    const [cloudFiles,setCloudFiles] = useState([]);
    const [tasks,setTasks] = useState([]);
    const [flag,setFlag] = useState(false);

    const scheduleRef = useRef(new Schedule());
    const schedule = scheduleRef.current;


    const addTask = useCallback(function (taskId,fun) {
        schedule.addFun(fun,{
            taskId: taskId
        });
        const callback =()=> {
            const tasks = scheduleRef.current.taskQuen.slice(0)
            setTasks(tasks);
        }
        schedule.addRunListener(callback,taskId)
    },[tasks])

    function listPage() {
        // client.getDirectoryContents('/pagenote/pages').then(function (result) {
        //     console.log('result ===',result)
        // })
        getBridge().sendMessage('WEBDAV',{
            method:'getDirectoryContents',
            data: '/pagenote/pages/',
            ...accountInfo,
        },function ({data}) {
            // basename: "ZmlsZTovLy9Vc2Vycy9yYW5yb25naHVhL0Rlc2t0b3AvZWFzeXNoYXJlL2V4dGVuc3Rpb24vZGlzdC9vcHRpb24uaHRtbA==.pagenote"
            // etag: "TU8FJW-sYVfI2YwWGR8rvg"
            // filename: "/pagenote/pages/ZmlsZTovLy9Vc2Vycy9yYW5yb25naHVhL0Rlc2t0b3AvZWFzeXNoYXJlL2V4dGVuc3Rpb24vZGlzdC9vcHRpb24uaHRtbA==.pagenote"
            // lastmod: "Tue, 24 Aug 2021 00:46:15 GMT"
            // mime: "application/octet-stream"
            // size: 44
            // type: "file"
            if(data.success){
                const list = data.data.filter(function (item) {
                    return item.type === 'file'
                }).map((file)=>{
                    const encodeCode = file.basename.replace('.pagenote','')
                    const url = baseCode.decode(encodeCode);
                    return {
                        id: file.basename,
                        url: url,
                        time: new Date(file.lastmod),
                        showTime: dayjs(file.lastmod).format('YYYY/MM/DD HH:mm'),
                        ...file
                    }
                }).sort(function (pre,next) {
                    return next.time > pre.time ? 1 : -1
                })
                setCloudFiles(list);
            }
            console.log(data,'webdav')
        })
    }

    const deletePages = function (pages=[]) {
        pages.forEach(function (filename) {
            const taskId = 'delete_'+filename;
            addTask(taskId,function () {
                getBridge().sendMessage('WEBDAV',{
                    method:'deleteFile',
                    data: filename,
                    ...accountInfo,
                },function ({data}) {
                    console.log('删除结果',data)
                })
            })
            const tasks = scheduleRef.current.taskQuen.slice(0)
            setTasks(tasks);
        })
    }

    useEffect(function () {
        // init();
        listPage()
    },[]);

    const emptyPages = cloudFiles.filter(function (file) {
        return file.size <= 45;
    }).map(function (file) {
        return file.filename;
    });
    return (
        <div>
            <div>
                {/*<DataTable rows={cloudFiles} />*/}
                <div>
                    云盘中共有 {cloudFiles.length} 个文件
                    <Button onClick={()=>deletePages(emptyPages)}>一键删除无效文件{emptyPages.length}个</Button>
                </div>
                <div>
                    当前任务共有 {tasks.length} 在执行
                </div>
                <div className="content-body">
                    <table className='file-table'>
                        <thead>
                        <tr>
                            <th><Checkbox size="small" />选择</th>
                            <th>文件名称</th>
                            <th>对应网址</th>
                            <th>修改时间</th>
                            <th>文件大小</th>
                            <th>与插件数据比较</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            cloudFiles.map((file)=>(
                                <tr key={file.basename}>
                                    <td>
                                        <Checkbox />
                                    </td>
                                    <td title={file.basename} className='filename'>{file.basename}</td>
                                    <td>
                                        <a href={file.url} target='_blank'>{file.url}</a>
                                    </td>
                                    <td>
                                        {file.showTime}
                                    </td>
                                    <td>
                                        {file.size}
                                    </td>
                                    <td>
                                        本地数据
                                    </td>
                                    <td>
                                        <Button onClick={()=>{deletePages([file.filename])}}>删除</Button>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
