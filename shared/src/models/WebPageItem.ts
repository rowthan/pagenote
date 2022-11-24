const md5 = require('md5')
import {AllowUpdateKeys, DataVersion, PAGE_TYPES, WebPage} from "../@types/data";

type UpdateProps<T,Key extends keyof T> = {[key in Key]?: T[key]}

interface IWebPage{
    data: WebPage,
    lastHash: string
    isValid():boolean, // 数据有效性校验，判断该数据是否有效
    isEmpty():boolean,
    setData(webPage:UpdateProps<WebPage, AllowUpdateKeys>):boolean,
    createDataHash():string,
}

const EMPTY_HASH = 'empty'

class WebPageItem implements IWebPage {
    data: WebPage = getDetailWebPage();
    lastHash: string = EMPTY_HASH;

    constructor(webPage?: WebPage) {
        if(webPage){
            this.setData(webPage);
        }
    }

    setData(webPage: Partial<WebPage>): boolean {
        for (let i in webPage) {
            // @ts-ignore
            if (webPage[i] !== undefined) {
                // @ts-ignore
                this.data[i] = webPage[i]
            }
        }
        // 数据兼容处理，将二级数据，迁移至一级
        if(webPage.version !== DataVersion.version4){
            this.data.version = DataVersion.version4;
            this.data.key = this.data.key || webPage.key || webPage.url;
            this.data.url = this.data.url || webPage.url;
            this.data.customTitle = this.data.customTitle || webPage.customTitle || webPage.title;
            this.data.description = this.data.description || webPage.description;
            this.data.sdkSetting = this.data.sdkSetting || webPage.sdkSetting || webPage.plainData.setting;
        }

        this.data.createAt = this.data.createAt || Date.now();
        const currentHash = this.createDataHash();
        const changed = currentHash !== this.lastHash
        this.lastHash = currentHash;
        return changed
    }

    isValid() {
        // 已删除已过期
        if(this.data.deleted){
            if(this.data.expiredAt && this.data.expiredAt < Date.now()){
                return false
            }
        }
        // const validate = validator()
        // const result =  validate(this.data);
        const schema = {
            required: true,
            type: 'object',
            properties: {
                key: {
                    required: true,
                    type: 'string'
                },
                url: {
                    required: true,
                    type: 'string'
                },
                plainData: {
                    required: true,
                    type: 'object',
                    properties: {
                        steps: {
                            required: true,
                            type: 'object', // TODO
                            properties: {
                                id: {
                                    required: true,
                                    type: 'string'
                                },
                                text: {
                                    required: true,
                                    type: 'string'
                                },
                                bg: {
                                    required: true,
                                    type: 'string'
                                }
                            }
                        }
                    }
                }
            }
        }


        try{
            const idKey = this.data.key || this.data.url;
            if(!idKey){
                return false;
            }
            const {plainData} = this.data;
            if(!plainData.steps){
                return false;
            }
            if(plainData.steps && plainData.steps[0]){
                const {bg} = plainData.steps[0];
                if(!bg){
                    return false
                }
            }
        }catch (e) {
            return false
        }

        return true;
    }

    isEmpty() {
        const {plainData} = this.data;
        return !this.isValid() || (plainData?.steps.length === 0 && plainData?.snapshots.length === 0)
    }

    createDataHash():string {
        if (!this.isValid()) {
            return EMPTY_HASH
        }
        const data = this.data;
        const string = JSON.stringify({
            version: data.version,
            deleted: data.deleted,
            plainData: data.plainData,
            description: data.description,
            icon: data.icon,
            urls: data.urls,
        })
        return md5(string).toString()
    }
}

const getDetailWebPage = function () {
    const webpage: Required<WebPage> = {
        domain: "",
        path: "",
        achieved: false,
        customTitle: "",
        directory: "",
        etag: "",
        expiredAt: 0,
        filename: "",
        hash: "",
        lastSyncTime: 0,
        lastmod: "",
        mtimeMs: 0,
        sdkSetting: undefined,
        sessionId: "",
        visitedAt: 0,
        pageType: PAGE_TYPES.http,
        createAt: 0,
        deleted: false,
        description: "",
        icon: "",
        cover: '',
        key: "",
        plainData: {
            categories: [],
            snapshots: [],
            setting: {},
            steps: [],
        },
        thumb: "",
        title: "",
        updateAt: 0,
        url: "",
        urls: [],
        version: DataVersion.version4,
        extVersion: "",
        categories: [],
        did: ""
    }
    return webpage
}

export {WebPageItem};
