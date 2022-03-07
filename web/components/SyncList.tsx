import {TaskDetail} from "@pagenote/shared/lib/@types/webdav";

interface Props {
    tasks: Record<string, TaskDetail>,
    taskName: string,
}
export default function SyncList({taskName='未知任务类型',tasks={}}:Props) {
    return(
        <div>
            <h2>
                {taskName} 待同步任务有 {Object.keys(tasks).length}
            </h2>
            <div>
                {
                    Object.keys(tasks).map(function (item) {
                        const task = tasks[item];
                        return(
                            <div key={task.cloudEtag+task.localEtag}>
                                {task.basename} - {task.state} - {task.actionType}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}