<template>
  <div>
    <div class="text-xl">
      账号信息: {{accountName || '未绑定云盘信息'}}
    </div>
    <div>
      当前 webdav 状态： {{ webdavStatus }}
    </div>
    <div>
      当前任务 :{{currentTask}}
    </div>
  </div>
</template>
<script>
import { requestExtension } from '../utils/extensionApi'
import Vue,{PropType} from 'vue'
export default {
  layout:"default",
  data() {
      return {
          account: null,
          webdavStatus: {
            state: 0,
          },
          currentTask: {}
      }
  },
  methods: {
    getWebdavInfo() {
        requestExtension('getWebdavAccount').then((result)=> {
            if(result?.success){
              this.account = result.data;
            }
        })
    },
    getWebdavStatus() {
      requestExtension('getWebdavStatus').then((result)=> {
        if(result?.success){
          this.webdavStatus = result.data;
        }
      })
    },
    getCurrentSyncTask(){
      requestExtension('getCurrentSyncTask').then((result)=> {
        if(result?.success){
          this.currentTask = result.data;
        }
      })
    }
  },
  computed:{
    accountName(){
      return this.account?.accountName
    }
  },
  mounted() {
      this.getWebdavInfo();
      this.getWebdavStatus();
      this.getCurrentSyncTask();
  },
}
</script>
