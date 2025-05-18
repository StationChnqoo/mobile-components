<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ApexCharts from 'apexcharts'
import { useRoute } from 'vue-router'
import { NextService } from '@/service'
import moment from 'moment'

const chartRef = ref<HTMLElement | null>(null)
const chart = ref<ApexCharts | null>(null)
const options = ref({
  chart: {
    type: 'line',
    zoom: {
      enabled: false, // 禁用缩放
    },
  },
  stroke: {
    curve: 'straight',
    width: 1,
  },
  series: [
    {
      name: '总资产',
      data: [],
    },
  ],
  xaxis: {
    categories: [],
  },
})

const route = useRoute()
const token = (route.query.token as string) || ''

const loadProperty = async () => {
  const service = new NextService(token)
  const result = await service.selectProperties({
    currentPage: 1,
    pageSize: 52,
  })
  const records = result.data.records.reverse()
  const newData = records.map((item: any) => (item.total / 10).toFixed(2))
  const newCategories = records.map((item: any) => moment(item.settleDate).format('YY年ww周'))

  options.value.series[0].data = newData
  options.value.xaxis.categories = newCategories

  chart.value?.updateOptions({
    series: [
      {
        name: '总资产',
        data: newData,
      },
    ],
    xaxis: {
      categories: newCategories,
    },
  })
}

onMounted(() => {
  if (chartRef.value) {
    chart.value = new ApexCharts(chartRef.value, options.value)
    chart.value.render()
  }
  loadProperty()
})
</script>

<template>
  <div class="wallet">
    <h1>Wallet</h1>
    <p>Welcome to the wallet page!</p>
    <van-button type="primary" @click="loadProperty">刷新图表</van-button>
    <div ref="chartRef" style="width: 100%; height: 300px"></div>
  </div>
</template>

<style scoped>
.wallet {
  padding: 16px;
}
</style>
