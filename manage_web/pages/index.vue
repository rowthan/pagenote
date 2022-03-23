<template>
  <Tutorial/>
</template>

<script lang="ts">
import Vue,{PropType} from 'vue'

type PropA = {

}

export default Vue.extend({
  name: 'IndexPage',
  props:{
    propA:{
      type: Object as PropType<PropA>
    }
  },
  data(){
    return{

    }
  },
  methods: {

  },
  computed: {

  },
  mounted() {
  },
})
</script>

<style lang="scss">

</style>
