<template>
  <div class="max-w-full">
    <v-card>
      <v-toolbar
        flat
        color="primary"
      >
        <v-toolbar-title>User Profile</v-toolbar-title>
      </v-toolbar>
      <v-tabs vertical>
        <v-tab>
          <v-icon left>
            mdi-account
          </v-icon>
          Option 1
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-lock
          </v-icon>
          Option 2
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-access-point
          </v-icon>
          Option 3
        </v-tab>

        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <p>
                Sed aliquam ultrices mauris. Donec posuere vulputate arcu. Morbi ac felis. Etiam feugiat lorem non metus. Sed a libero.
              </p>

              <p>
                Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Aliquam lobortis. Aliquam lobortis. Suspendisse non nisl sit amet velit hendrerit rutrum.
              </p>

              <p class="mb-0">
                Phasellus dolor. Fusce neque. Fusce fermentum odio nec arcu. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Phasellus blandit leo ut odio.
              </p>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <p>
                Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Nunc sed turpis.
              </p>

              <p>
                Suspendisse feugiat. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In hac habitasse platea dictumst. Fusce ac felis sit amet ligula pharetra condimentum.
              </p>

              <p>
                Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Nam commodo suscipit quam. In consectetuer turpis ut velit. Sed cursus turpis vitae tortor. Aliquam eu nunc.
              </p>

              <p>
                Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero. Aenean viverra rhoncus pede. Duis leo. Fusce fermentum odio nec arcu.
              </p>

              <p class="mb-0">
                Donec venenatis vulputate lorem. Aenean viverra rhoncus pede. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. Fusce commodo aliquam arcu. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi.
              </p>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <p>
                Fusce a quam. Phasellus nec sem in justo pellentesque facilisis. Nam eget dui. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In dui magna, posuere eget, vestibulum et, tempor auctor, justo.
              </p>

              <p class="mb-0">
                Cras sagittis. Phasellus nec sem in justo pellentesque facilisis. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nam at tortor in tellus interdum sagittis.
              </p>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import mustache from 'mustache';

import mixsetting from '~/mixin/setting'
import {setting} from "@pagenote/shared/lib/extApi";
import ExportMethod = setting.ExportMethod;
import SchemaType = setting.SchemaType;
import {DataVersion, PlainData, WebPage} from "@pagenote/shared/lib/@types/data";

const defaultExportMethod:ExportMethod = {
  api: "",
  name:'新建转换方式',
  schemaType: SchemaType.markdown,
  method: 'COPY',
  schema: `## [{{title}}]({{{url}}})
{{#steps}}> * {{text}}

{{#tip}}{{{tip}}}

{{/tip}}{{/steps}}
open in [pagenote.cn](https://pagenote.cn/webpage#/{{encodeUrl}})
    `
};

const defaultPlain: PlainData = {
  setting: undefined,
  url: "https://pagenote.cn/demo",
  categories: ['标签1','标签1'],
  images: [],
  lastModified: 0,
  snapshots: [],
  steps: [{
    "lightStatus": 2,
    "annotationStatus": 1,
    "lightId": "129fb3747eb54c2d1064fa2cd70af331",
    "x": 925,
    "y": 88,
    "id": "strong",
    "text": "PAGENOTE 小而美的笔记工具",
    "tip": "最新版本情况：\nChrome： 0.20.10\nFirefox： 0.20.10\nEdge: 0.20.5\n离线版本： 0.20.10<div><br></div><div><br></div><div>备份数据不推荐使用「文件夹功能」了。推荐使用导入导出。</div><div><br></div><div><img src=\"data:image/png;base64,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\" alt=\"\"><br></div><div><br></div>",
    "bg": "#ffbea9",
    "time": 1642514085357,
    "isActive": false,
    "offsetX": 0.5,
    "offsetY": 0.9,
    "parentW": 0,
    "pre": "",
    "suffix": "",
    "images": [],
    "level": 1
  },]
}
const defaultWebpage: WebPage ={
  createAt: Date.now(),
  deleted: false,
  description: "网页描述",
  etag: "",
  expiredAt: 0,
  hash: "",
  icon: "https://pagenote.cn/favicon.ico",
  key: "https://pagenote.cn/demo",
  lastSyncTime: 0,
  lastmod: "",
  mtimeMs: 0,
  plainData: defaultPlain,
  title: "网页标题",
  updateAt: 0,
  url: "https://pagenote.cn/demo",
  urls: [],
  version: DataVersion.version3
}


export default Vue.extend({
  name: "exports",
  components: {},

  mixins:[mixsetting],
  data() {
    return {
      tab: 0,
      items:[{
        text: '复制至剪切板',
        value: 'COPY'
      },{
        text: '下载为文件',
        value: 'DOWNLOAD'
      }],
      formData:{
        api: "",
        name:'',
        schemaType: SchemaType.markdown,
        method: 'COPY',
        schema:''
      },

    }
  },
  computed:{
    exportMethods(){
      return this.setting.exportMethods || []
    },
    currentMethod(){
      return this.exportMethods[this.tab]
    },

    renderResult(){
      const schema = this.formData.schema;
      if(!schema){
        return ''
      }
      return mustache.render(schema,defaultWebpage)
    }
  },
  methods: {
    addExportMethod() {
      const currentMethods = this.setting.exportMethods || [];
      currentMethods?.push(defaultExportMethod)
      this.setting.exportMethods = currentMethods
    },
    removeExportMethod(index:number){
      const currentMethods = this.setting.exportMethods || [];
      currentMethods.splice(index,1)
      this.setting.exportMethods = currentMethods
    }
  },
  watch: {
    tab(newValue, oldValue) {
      this.formData = this.setting.exportMethods[newValue]
    }
  },
})
</script>

<style scoped>

</style>
