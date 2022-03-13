<template>
  <v-main class="grey lighten-3">
    <v-container>
      <v-row>
        <v-col cols="2">
          <v-sheet rounded="lg">
            <v-list color="transparent">
              <v-list-item v-for="n in links" :key="n.name" link nuxt :to="n.path">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ n.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

<!--              <v-divider class="my-2"></v-divider>-->

<!--              <reset-setting>-->
<!--                <v-list-item-->
<!--                  link-->
<!--                  color="grey lighten-4"-->
<!--                >-->
<!--                  <v-list-item-content>-->
<!--                    <v-list-item-title>-->
<!--                      重置所有-->
<!--                    </v-list-item-title>-->
<!--                  </v-list-item-content>-->
<!--                </v-list-item>-->
<!--              </reset-setting>-->
            </v-list>
          </v-sheet>
        </v-col>

        <v-col cols="10" class="max-w-full">
          <v-sheet
            rounded="lg"
          >
            <NuxtChild :key="$route.params.id || 'exports'" />
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {requestExtension} from "~/utils/extensionApi";
import {setting} from "@pagenote/shared/lib/extApi";
import SDK_SETTING = setting.SDK_SETTING;

type PropA = {}

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
  sdkVersion: ''
}

export default Vue.extend({
  name: "Setting",
  props: {
    propA: {
      type: Object as PropType<SDK_SETTING>
    }
  },
  data() {
    return {
      setting: defaultSetting,
      links: [
        // {
        //   path: '/setting/webdav',
        //   name: '云盘'
        // },
        {
          path: '/setting/exports',
          name: '数据导出'
        }
      ],
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
  methods: {
    requestSetting(){
      requestExtension('request_pagenote_setting').then( (result)=> {
        this.setting = result;
      })
    },

  },
  computed: {

  },
  mounted() {
    this.requestSetting()
  },
})
</script>

<style lang="scss">

</style>
