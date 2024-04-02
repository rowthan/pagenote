import Workflows,{getAction} from "@pagenote/actions";
import extApi from "@pagenote/shared/lib/pagenote-api";
import {configArrayToObject} from "@pagenote/shared/lib/pagenote-config/utils";

const workflow = new Workflows({
    registerAction: getAction,
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
            const configList = res.data.list;
            // @ts-ignore
            return configArrayToObject(configList)
        })
    }
});


export default workflow;
