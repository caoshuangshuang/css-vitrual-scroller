<!--
 * @Description: 
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2023-04-10 15:06:04
 * @LastEditors: 曹双双
 * @LastEditTime: 2023-05-09 18:19:32
-->
<script setup lang="ts">
import { ref, toRefs, computed, onUpdated } from 'vue'

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
const vitrualListItemRefs = ref<Element[]>([])
const vitrualListRefs = ref<Element>()
const scrollTop = ref<number>(0)

//
const listDataWithPositions = computed(() => {
  let newList = []
  for (let i = 0, len = listData.value.length; i < len; i++) {
    const newItem = { ...listData.value[i] }
    newItem.itemIndex = i
    newItem.itemHeight = newItem.itemHeight || itemHeight.value
    newItem.itemTop = i === 0 ? 0 : newList[i - 1].itemBottom
    newItem.itemBottom = newItem.itemTop + newItem.itemHeight
    newList.push(newItem)
  }
  return newList
})
//渲染数据开始索引
const startIndex = computed(() => {
  const visibleFirstIndex = binarySearch(scrollTop.value, listDataWithPositions.value, 'itemBottom')
  return visibleFirstIndex > topOffsetSize.value ? visibleFirstIndex - topOffsetSize.value : 0
})
//渲染数据结束索引
const endIndex = computed(() => {
  const visibleLastIndex = binarySearch(scrollTop.value + vitrualListRefs.value.clientHeight, listDataWithPositions.value, 'itemBottom')
  const end = visibleLastIndex ? visibleLastIndex + bottomOffsetSize.value : listDataWithPositions.value.length - 1
  return end
})
//渲染数据
const visibleData = computed(() => {
  const visibleData = listDataWithPositions.value && listDataWithPositions.value.length ? listDataWithPositions.value.slice(startIndex.value, endIndex.value + 1) : []
  return visibleData
})
const paddingTop = computed(() => {
  return visibleData.value.length ? visibleData.value[0].itemTop : 0
})
const paddingBottom = computed(() => {
  if (listDataWithPositions.value.length && visibleData.value.length) {
    const listHeight = listDataWithPositions.value[listDataWithPositions.value.length - 1].itemBottom
    const visibleLastItemHeight = visibleData.value[visibleData.value.length - 1].itemBottom
    return listHeight - visibleLastItemHeight
  } else {
    return 0
  }

})

onUpdated(() => {
  if (!vitrualListItemRefs.value.length||!listDataWithPositions.value.length) {
    return
  }
  vitrualListItemRefs.value.forEach(el => {
    const rect = el.getBoundingClientRect()
    const index = +el.getAttribute('data-index')
    const diff = rect.height - listDataWithPositions.value[index].itemHeight
    if (diff) {
      listDataWithPositions.value[index].itemHeight = rect.height
      listDataWithPositions.value[index].itemTop =index===0?0: listDataWithPositions.value[index - 1].itemBottom
      listDataWithPositions.value[index].itemBottom += diff

      for(let i = index+1,len = listDataWithPositions.value.length;i<len;i++) {
        listDataWithPositions.value[i].itemTop=listDataWithPositions.value[i-1].itemBottom
        listDataWithPositions.value[i].itemBottom+=diff
      }
    }
  })
})

// 滚动事件回调
const handleScroll = () => {
  requestAnimationFrame(() => {
    scrollTop.value = vitrualListRefs.value.scrollTop
  })
}

const binarySearch = (value, arr, key) => {
  let start = 0
  let end = arr.length - 1
  let tempIndex = null
  while (start < end) {
    let midIndex = Math.floor((start + end) / 2)
    let midValue = key ? arr[midIndex][key] : arr[midIndex]
    if (value === midValue) {
      return midIndex + 1
    } else if (value > midValue) {
      start = midIndex + 1
    } else {
      if (tempIndex === null || tempIndex > midIndex) {
        tempIndex = midIndex
      }
      end -= 1
    }
  }
  return tempIndex
}
</script>

<template>
  <div ref="vitrualListRefs" class="vitrual-scroller" @scroll="handleScroll">
    <div :style="{ paddingTop: paddingTop + 'px', paddingBottom: paddingBottom + 'px' }">
      <div ref="vitrualListItemRefs" class="list-item" v-for="(item, index) in visibleData" :key="index"
        :data-index="item.itemIndex">
        <slot :item="item"></slot>
      </div>
    </div>

  </div>
</template>

<style scoped>
.vitrual-scroller {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
