const exceptObject = {
    "name": "memo to obsidian",
    "on": {
        "change": {
            "tables": [
                "memo"
            ]
        },
        "schedule": "1*"
    },
    "env": [
        {
            "id": "obsidianToken",
            "key": "obsidian.token",
            "name": "obsidian token 密钥"
        },
        {
            "id": "obsidianHost",
            "key": "obsidian.host",
            "name": "obsidian host API 地址"
        },
        {
            "default": "{{xxx}}",
            "id": "obsidianTemplate",
            "name": "导出为 markdown 文档的模板"
        }
    ],
    "jobs": [
        {
            "id": "get_change_list",
            "name": "读取变更内容",
            "steps": [
                // {
                //   "id": "getObsidianId",
                //   "name": "请求 obsidian 服务器ID标识",
                //   "uses": "pagenote/fetch@v1",
                //   "with": {
                //     "headers": {
                //       "token": "${{env.obsidianToken}}"
                //     },
                //     "url": "${{env.obsidianHost}}/vault/.pagenote/id.md"
                //   }
                // },
                {
                    "id": "getCurrentDataList",
                    "name": "或许当前插件内数据",
                    "uses": "pagenote/table@v1",
                    "with": {
                        "db": "lightpage",
                        "method": "keys",
                        "table": "memo"
                    }
                }
            ]
        },
        {
            "name": "将本地变更的数据同步至远端",
            "steps": [
                {
                    "id": "getLocalData",
                    "name": "获取本地数据",
                    "uses": "pagenote/table@v1",
                    "with": {
                        "db": "lightpage",
                        "method": "get",
                        "params": "${{matrix.item}}",
                        "table": "memo"
                    }
                },
                {
                    "id": "getRemoteData",
                    "name": "获取远程数据",
                    "uses": "pagenote/fetch@v1",
                    "with": {
                        "headers": {
                            "Authorization": "Bearer ${{env.obsidianToken}}"
                        },
                        "method": "get",
                        "url": "${{env.obsidianHost}}/vault/${{matrix.item}}.md"
                    }
                },
                {
                    "id": "pkData",
                    "name": "比较数据",
                    "uses": "pagenote/pick@v1",
                    "with": {
                        "list": [
                            "${{steps.getLocalData.outputs}}",
                            "${{steps.getRemoteData.outputs}}"
                        ],
                        "pkBy": [
                            "updateAt",
                            "__mtime",
                            "createAt",
                            "__ctime"
                        ]
                    }
                },
                {
                    "id": "convertToMarkdown",
                    "if": "${{steps.pkData.outputs.index}} == 1",
                    "name": "将数据转为markdown格式",
                    "uses": "pagenote/convert@v1",
                    "with": {
                        "template": "## {{title}} \n {{markdown}}",
                        "variables": "${{steps.pkData.outputs.data}}"
                    }
                },
                {
                    "id": "uploadToObsidian",
                    "if": "${{steps.pkData.outputs}} == 1",
                    "name": "更新至 obsidian",
                    "uses": "pagenote/fetch@v1",
                    "with": {
                        "body": "${{steps.convertToMarkdown.outputs}}",
                        "headers": {
                            "token": "${{env.obsidianToken}}"
                        },
                        "url": "${{env.obsidianHost}}/vault/${{matrix.item}}.md"
                    }
                }
            ],
            "strategy": {
                "matrix": {
                    "item": "${{jobs.get_change_list.outputs}}"
                }
            }
        }
    ],
}

export default exceptObject
