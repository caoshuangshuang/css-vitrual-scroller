<!--
 * @Description: 
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2023-04-10 15:06:04
 * @LastEditors: 曹双双
 * @LastEditTime: 2023-05-09 18:18:55
-->
<script setup lang="ts">
import { ref, toRefs, computed, onMounted, onUnmounted, nextTick } from 'vue'

export interface Props {
  listData: Array<any>,
  itemHeight?: number,
  topOffsetSize?: number,
  bottomOffsetSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemHeight: 44,
  topOffsetSize: 3,
  bottomOffsetSize: 3
})
const { listData, itemHeight, topOffsetSize, bottomOffsetSize } = toRefs(props)

// 列表视口高度
const screenHeight = ref<number>(0)
const visibleFirstIndex = ref<number>(0)
const infiniteListRef = ref<Element>(null)

//渲染数据开始索引
const startIndex = computed(() => {
  return visibleFirstIndex.value > topOffsetSize.value ? visibleFirstIndex.value - topOffsetSize.value : 0
})
//渲染数据结束索引
const endIndex = computed(() => {
  const end = visibleFirstIndex.value + visibleCount.value + bottomOffsetSize.value
  return end < listData.value.length - 1 ? end : listData.value.length - 1
})
//渲染数据
const visibleData = computed(() => {
  return listData.value && listData.value.length ? listData.value.slice(startIndex.value, endIndex.value + 1) : []
})
//渲染数量
const visibleCount = computed(() => {
  return Math.ceil(screenHeight.value / itemHeight.value)
})
// 顶部、底部撑起列表总高
//渲染数据距离顶部的偏移
const paddingTop = computed(() => {
  return startIndex.value * itemHeight.value
})
//渲染数据距离底部的偏移
const paddingBottom = computed(() => {
  return (listData.value.length - endIndex.value - 1) * itemHeight.value
})

onMounted(() => {
  window.addEventListener('resize', changeHeight)
  nextTick(() => {
    screenHeight.value = infiniteListRef.value.clientHeight
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', changeHeight)
})

// 屏幕尺寸改变回调
const changeHeight = () => {
  requestAnimationFrame(() => {
    screenHeight.value = infiniteListRef.value.clientHeight
  })
}
// 滚动事件回调
const handleScroll = () => {
  requestAnimationFrame(() => {
    const scroolTop = infiniteListRef.value.scrollTop
    visibleFirstIndex.value = Math.floor(scroolTop / itemHeight.value)
  })

}
</script>

<template>
  <div class="vitrual-scroller" ref="infiniteListRef" @scroll="handleScroll">
    <div :style="{ 'padding-top': paddingTop + 'px', 'padding-bottom': paddingBottom + 'px' }">
      <div v-for="(item, index) in visibleData" :key="index" :style="{ height: itemHeight + 'px' }">
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vitrual-scroller{
  position: relative;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
