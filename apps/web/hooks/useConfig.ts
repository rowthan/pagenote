import  {setting} from "@pagenote/shared";
import extApi from "@pagenote/shared/pagenote-api";
import useSWR from "swr";
import ISearchEngine = setting.ISearchEngine;


type IConfig = {
    searchEngines?: ISearchEngine[]
} | undefined
export default function useConfig(): IConfig{
    const {data} = useSWR<IConfig>('/config',fetchLocalAndServerSetting)

    function fetchLocalAndServerSetting (): Promise<IConfig>{
        return extApi.setting.getSearchEngines().then((result)=>{
            return {
                ...data,
                searchEngines: result.data
            };
        })
    }

    return data as IConfig
}
