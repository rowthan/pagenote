import axios, {AxiosError, AxiosRequestConfig} from 'axios'

// 响应 code 列举
enum ResponseCode {
    NOT_AUTHED= 401,
    NOT_ALLOWED=403,
    SUCCESS=200
}

// API 请求基础设置
interface API_OPTION {
    token:string,
    did:string,
    server?:string,
    extensionVersion:string,
    listeners: Record<ResponseCode,Listener>,
}

interface Listener {
    (state:ResponseCode):void
}

const API = {
    rest:{
        setting:{

        }
    },
    graphql:{
        user: '/api/user'
    },

}

class PagenoteAxios{
    public option: API_OPTION;
    public state: ResponseCode;

    constructor(option:API_OPTION) {
        this.option = {
            server:'https://api.pagenote.cn',
            ...option
        };
    }

    get(path:string,config:AxiosRequestConfig){
        const { server } = this.option
        return this.fetch({
            method:'GET',
            url: server + path,
            ...config,
        })
    }

    post(path:string,data:any,config:AxiosRequestConfig){
        const { server } = this.option
        return this.fetch({
            method:'POST',
            url: server + path,
            data: data,
            ...config
        })
    }

    fetch(config:AxiosRequestConfig){
        const method = config.method || 'GET'
        const {token,did,extensionVersion} = this.option
        const listener = this.option.listeners;
        return axios({
            method: method,
            url: config.url,
            headers: {
                ...config.headers || {},
                Authorization: `Bearer ${token}`,
                extensionVersion: extensionVersion,
                did: did,
            },
            params: method==='GET' ? config.params : undefined,
            data: method==='POST' ? config.data : undefined,
        }).then((result)=>{
            const {data} = result;
            const code:ResponseCode = data.code;
            if(listener && listener[code]){
                listener[code](code)
            }
            return result
        }).catch(function (e:AxiosError) {
            const code:ResponseCode = Number(e?.response?.status);
            if(listener && listener[code]){
                listener[code](code)
            }
            throw e
        })
    }
}

export default PagenoteAxios
export {
    API
}