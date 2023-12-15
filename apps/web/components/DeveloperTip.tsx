import {ReactElement, useState} from "react";
import {DeveloperTask} from "../const/developerTask";
import {GIT_BASE_URL} from "../const/git";

export default function DeveloperTip(props:{children?: ReactElement, taskInfo: DeveloperTask}) {
    const {taskInfo} = props;
    const [visible,setVisible] = useState(false);
    return(
        <>
            <span onClick={()=>{setVisible(true)}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </span>

            {
                visible &&
                <div className="modal modal-bottom sm:modal-middle modal-open">
                    <div className="mockup-code px-4">
                        <pre data-prefix="任务"><code>{taskInfo.title}</code></pre>
                        <pre data-prefix="详情" className="text-warning"><code>{taskInfo.message}</code></pre>
                        <pre data-prefix=">" className="text-success"><code>Done!</code></pre>

                        <div className="modal-action">
                            <span className="kbd-sm kbd text-gray-800" onClick={()=>{setVisible(false)}}>
                                <a href={taskInfo.git || GIT_BASE_URL} target='_blank'>参与开发此任务</a>
                            </span>

                            <span className="kbd-sm kbd text-gray-800" onClick={()=>{setVisible(false)}}>
                                关闭
                            </span>
                        </div>
                    </div>
                    {/*<div className="modal-box">*/}
                    {/*    <h3 className="font-bold text-lg">【开发者任务】：{taskInfo.title}</h3>*/}
                    {/*    <div className="py-4">*/}
                    {/*        <div>*/}
                    {/*            【任务说明】{taskInfo.message}*/}
                    {/*        </div>*/}
                    {/*        <div>*/}
                    {/*            */}
                    {/*        </div>*/}
                    {/*        <div className="divider"></div>*/}
                    {/*        <span></span>*/}
                    {/*        {props.children}*/}
                    {/*    </div>*/}
                    {/*    <div className="modal-action">*/}
                    {/*        <span className="btn" onClick={()=>{setVisible(false)}}>*/}
                    {/*            <a href={taskInfo.git || GIT_BASE_URL} target='_blank'>参与开发此任务</a>*/}
                    {/*        </span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            }

        </>
    )
}
