import {requestExtension} from "~/utils/extensionApi";
import {setting} from "@pagenote/shared/lib/extApi";
import SDK_SETTING = setting.SDK_SETTING;

const defaultSetting: SDK_SETTING = {
  updateAt: 0,
  lastModified: 0,
  brushes: [],
  copyAllowList: [],
  commonSetting: {
    maxRecord: 0,
    showBarTimeout: 0,
    keyupTimeout: 0,
    removeAfterDays: 0
  },
  actions: [],
  disableList: [],
  controlC: false,
  debug: false,
  autoBackup: 0,
  enableMarkImg: false,
  sdkVersion: '',
  exportMethods:[]
}

const settingMixed = {
  data(){
    return {
      setting: defaultSetting
    }
  },
  mounted: function () {
    this.requestSetting()
  },
  methods: {
    requestSetting(){
      requestExtension('request_pagenote_setting').then( (result)=> {
        this.setting = result;
      })
    },
  }
}

export default settingMixed
