const md5 = require('md5')
import {AllowUpdateKeys, WebPage} from "@pagenote/shared/lib/@types/Types";

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
    data: WebPage = {
        createAt: 0,
        deleted: false,
        description: "",
        icon: "",
        key: "",
        plainData: {
            url: '',
            images: [],
            categories: [],
            snapshots: [],
            setting: {},
            steps: [],
        },
        title: "",
        updateAt: 0,
        url: "",
        urls: [],
        version: ""
    };
    lastHash: string = EMPTY_HASH;

    constructor(webPage?: WebPage) {
        if(webPage){
            this.setData(webPage);
        }
    }

    setData(webPage: WebPage): boolean {
        for (let i in webPage) {
            // @ts-ignore
            if (webPage[i] !== undefined) {
                // @ts-ignore
                this.data[i] = webPage[i]
            }
            this.data.updateAt = Date.now();
        }
        const currentHash = this.createDataHash();
        const changed = currentHash !== this.lastHash
        this.lastHash = currentHash;
        return changed
    }

    isValid() {
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
        return true;
    }

    isEmpty() {
        const {plainData} = this.data;
        return !this.isValid() || plainData?.steps.length > 0 || plainData?.snapshots.length > 0
    }

    createDataHash() {
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
        return md5(string)
    }
}

export {WebPageItem};
