<template>
  <v-app id="inspire" :dark="$vuetify.theme.dark"
         :light="!$vuetify.theme.dark">
    <v-navigation-drawer
      v-model="drawer"
      app
      class="pt-4"
      mini-variant
    >
      <div v-for="n in pages" :key="n.name">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <nuxt-link :to="n.url">
              <v-btn
                elevation="2"
                icon
                plain
                v-on="on"
                v-bind="attrs"
                class="d-block text-center mx-auto mb-9"
              >
                <v-icon name="mdi-file-find" :color="path===n.url?'primary':''">
                  {{n.icon}}
                </v-icon>
              </v-btn>
            </nuxt-link>
          </template>
          {{n.name}}
        </v-tooltip>
      </div>
    </v-navigation-drawer>
    <div class="fixed bottom-4 left-0 z-50 w-9 mx-2.5">
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-app-bar-nav-icon
            v-bind="attrs"
            v-on="on"
            @click="drawer = !drawer">
          </v-app-bar-nav-icon>
        </template>
        <span>收齐</span>
      </v-tooltip>
    </div>
    <nuxt></nuxt>
  </v-app>
</template>

<script>

const DRAW_STATE_KEY = '_draw_state_'
export default {
  data () {
    return {
      drawer: null,
      pages:[
        // {
        //   name: 'webpages',
        //   url: '/webpages',
        //   icon: 'mdi-web'
        // },
        {
          name: 'setting',
          url: '/setting',
          icon: 'mdi-tune'
        }
      ]
    }
  },
  mounted() {
    // this.$vuetify.theme.dark = false
    // this.drawer = localStorage.getItem(DRAW_STATE_KEY) === '1' ? true : null
  },
  watch: {
    drawer(newValue, oldValue) {
      // localStorage.setItem(DRAW_STATE_KEY,newValue ? '1' : '0')
    }
  },
  computed: {
    path() {
      return this.$route.path
    }
  },
}
</script>
