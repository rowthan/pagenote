import BasicLayout from "layouts/BasicLayout";
import Background from "@pagenote/actions";
import {fetch, format, pickData, TableActionProps,} from '@pagenote/actions/actions'
import {IAction} from "@pagenote/actions/dist/typing/IAction";
import extApi from "@pagenote/shared/lib/pagenote-api";
import {Button} from "@/components/ui/button";
import fileContent from '!!raw-loader!./export.yml';

const tableAction = function (args: TableActionProps){
    const {method,table,db,params,} =args;
    //@ts-ignore
    const fun = extApi.table[method];
    return fun({
        db: db,
        table: table,
        params: params
    })
};

const runner = new Background({
    hooks: {
        beforeStep (step,request) {
            console.log('before:: ',step.name,request)
        },
        afterStep(step,response){
            console.log('after:: ',step.name,response)
        }
    },
    prepareEnv(keys: string[]): Promise<Object> {
        return extApi.table.query({
            db: "setting",
            table: "config",
            params:{
                query:{
                    rootKey:"actions",
                }
            }
        }).then(function (res) {
            console.log(res,'config')
            return res.data || {};
        })
    },
    registerAction(action: string) {
        const actionMap: Record<string, IAction> = {
            'pagenote/fetch@v1': fetch,
            'pagenote/format@v1': format,
            'pagenote/pick@v1': pickData,
            'pagenote/table@v1': tableAction,
        }

        const actionFun = actionMap[action];
        return Promise.resolve(actionFun);
    }
})

export default function DataFlow() {
    async function runWorkFlow() {
        runner._updateYml(fileContent)
        runner.run();
    }
    return(
        <BasicLayout>
            <Button onClick={runWorkFlow}>run</Button>
        </BasicLayout>
    )
}
