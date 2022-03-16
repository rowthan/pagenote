<template>
  <div>
    仅支持 0.21.0 以上版本
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {Pagination} from "@pagenote/shared/lib/@types/database";
import {WebPage} from "@pagenote/shared/lib/@types/data";
import bridgeApi from "../service/requestExt";

type PropA = {}

export default Vue.extend({
  name: 'Search',
  props: {
    propA: {
      type: Object as PropType<PropA>
    }
  },
  data() {
    const defaultData: {
      pagination: Pagination,
      pages: WebPage[],
    } = {
      pagination: {
        total: 0,
        limit: 0,
        pages: 0
      },
      pages:[]
    }
    return {
      ...defaultData,
      keywords: 'pagenote',
      currentPage: 0,
    }
  },
  methods: {
    searchByKeyword() {
      const keywords = this.keywords;
      const query = {
        deleted: false,
        $or:[
          {
            text:{
              $like: keywords
            }
          },
          {
            domain:{
              $like: keywords
            }
          },
          {
            tip:{
              $like: keywords
            }
          },
          {
            context:{
              $like: keywords
            }
          },
          {
            categories:{
              $like: keywords
            }
          },
        ]
      }
      const pagination = this.pagination;
      bridgeApi.lightpage.getLightPages({
        limit: pagination.limit,
        skip: this.currentPage * pagination.limit,
        query: query
      }).then( (result)=> {
        console.log('拉取结果',result)
        if(result.success){
          this.pages = result.data.pages
          this.pagination = result.data.pagination
        }
      });
    },
  },
  computed: {},
  mounted() {
    this.searchByKeyword()
  },
})
</script>

<style lang="scss">

</style>
