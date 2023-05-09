<!--
 * @Description: 定高虚拟列表
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2023-04-10 15:06:04
 * @LastEditors: 曹双双
 * @LastEditTime: 2023-05-09 18:19:50
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import VitrualScroller from '@/components/vitrualScroller/Index.vue'

const listData = ref<any>([])

onMounted(() => {
  let count = 300
  for (let i = 0; i < count; i++) {
    if (i % 3 === 0) {
      listData.value.push({
        value: i,
        desc:'ddddddddddddddddddddd '
      })
    }
    else if (i % 3 === 1) {
      listData.value.push({
        value: i,
        desc:'dddddddd'
      })
    } else if (i % 3 === 2) {
      listData.value.push({
        value: i,
        desc:'ddddddddddddddddddd '
      })
    }
  }
})

</script>

<template>
  <div class="app">
    <VitrualScroller :fixed="false" :list-data="listData" :item-height="20">
      <template v-slot="{ item }">
        <div>
          <div>{{ item.value }}</div>
          <div v-if="item.desc">{{ item.desc }}</div>
        </div>
      </template>
    </VitrualScroller>
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  width: 100vw;
}
</style>
