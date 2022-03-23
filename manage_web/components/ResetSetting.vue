<template>
  <div>
    <div @click="dialog = true">
      <slot>重置设置</slot>
    </div>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          确定重置所有设置？
        </v-card-title>

        <v-card-text>
          将还原至初始状态，无法还原。
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            放弃
          </v-btn>

          <v-btn
            color="red darken-1"
            text
            @click="resetAll"
          >
            确定重置
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: "ResetSetting",
  data() {
    return {
      dialog: false
    }
  },
  methods: {
    resetAll() {
      this.dialog = false;
      window.location.reload()
    }
  },
})
</script>

<style scoped>

</style>
