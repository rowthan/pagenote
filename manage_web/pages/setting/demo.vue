<template>
<div>
  <textarea v-model="form" name="" id="" cols="30" rows="10"></textarea>
  <div v-html="result">
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import mustache from 'mustache';

export default Vue.extend({
  name: "demo",
  data() {
    return {
      form: `{{type}}
                {
                  {{#actions}}
                    {{action}}
                    {{#params}}({{{convertParams}}}){{/params}}
                    {
                      {{#projection}}{{{projection}}}{{/projection}}
                    }
                  {{/actions}}
                }
            `,
      request:{
        type: 'mutation',
        actions: [
          {
            action: 'addTodo',
            params: true,
            convertParams(){
              return JSON.stringify({
                a:"1",
                b:2,
                c:"3",
                d: [1,2,3]
              }).replace(/"(\w*)?":/g,"$1:")
            },
            projection(input){
              const projection = {
                a: 1,
                user:{
                  name:1,
                  gender:1,
                },
                books:[{
                  bookname: 1,
                  total: 1
                }]
              }
              return JSON.stringify(projection).replace(/[":1\[\]]/g,'')
            }
          },
          {
            action: 'test',
          }
        ]

      }
    }
  },
  computed: {
    result() {
      return mustache.render(this.form,this.request)
    }
  },
})
</script>

<style scoped>

</style>
