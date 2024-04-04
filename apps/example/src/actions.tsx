import Workflows from "@pagenote/actions";
import extApi from "@pagenote/shared/lib/pagenote-api";
import {configArrayToObject} from "@pagenote/shared/lib/pagenote-config/utils";
import {createRoot} from "react-dom/client";
import * as React from "react";
import {useEffect, useRef} from 'react'

function getActionRunner(uses) {
    if(uses==='pagenote/table@v1'){
        return Promise.resolve(function (args) {
            const fun = extApi.table[args.method];
            return fun(args)
        })
    }
}


const workflow = new Workflows({
    registerAction: getActionRunner,
    prepareEnv: function (keys) {
        return extApi.table.query({
            db: 'setting',
            table:"config",
            params:{
                query:{
                    key: {
                        $in: keys
                    }
                }
            }
        }).then(function (res) {
            console.log(res,'config setting')
            const configList = res.data.list;
            // @ts-ignore
            return configArrayToObject(configList)
        })
    }
});

function App() {
    const textRef = useRef<HTMLTextAreaElement>()

    useEffect(() => {
        workflow._updateYml(localStorage.getItem('yaml'))
        textRef.current.value = localStorage.getItem('yaml')
    }, []);

    function run() {
        workflow.run().then(function () {
            console.log(workflow,'result')
        })
    }

    function save() {
        const yaml = textRef.current.value;
        localStorage.setItem('yaml',yaml);
       workflow._updateYml(yaml)
       console.log(workflow);
    }
    return(
        <div>
            <textarea rows={20} cols={40} ref={textRef}></textarea>
            <button onClick={save}>保存</button>
            <button onClick={run}>运行</button>
        </div>
    )
}


const root = createRoot(document.getElementById('root'))
root.render(<App />);
