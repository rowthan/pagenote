<template>
<div>
  好像发生了一些错误
  {{error}}
</div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: "error",
  props: ['error'],
})
</script>

<style scoped>

</style>
