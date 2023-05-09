<!--
 * @Description: 
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2023-04-26 16:15:37
 * @LastEditors: 曹双双
 * @LastEditTime: 2023-05-09 14:28:24
-->
<script lang="ts" setup>
import FixedHeight from './FixedHeight.vue';
import UnFixedHeight from './UnFixedHeight.vue'

interface Props {
  listData: Array<any>,
  itemHeight?: number,
  topOffsetSize?: number,
  bottomOffsetSize?: number,
  fixed?:boolean
}

const props =withDefaults(defineProps<Props>(),{
  fixed:true
}) 
</script>
<template>
  <div style="height:100%">
    <FixedHeight v-if="fixed" v-bind="props">
      <template v-slot="{item}">
        <slot :item="item"></slot>
      </template>
    </FixedHeight>
    <UnFixedHeight v-else  v-bind="props">
      <template v-slot="{item}">
        <slot :item="item"></slot>
      </template>
    </UnFixedHeight>
  </div>
</template>