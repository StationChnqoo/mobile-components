<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import ApexCharts from 'apexcharts'
import { useRoute } from 'vue-router'
import { NextService } from '@/service'
import moment from 'moment'

const chartRef = ref<HTMLElement | null>(null)
const chart = ref<ApexCharts | null>(null)
const datas = ref<any[]>([])

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
  datas.value = [...result.data.records]
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

const maps = {
  wechat: '微信',
  alipay: '支付宝',
  unionpay: '银联',
  cash: '现金',
  carpooling: '顺风车',
  eastmoney: '股票',
  housefund: '公积金',
  usd: '美元',
}
</script>

<template>
  <div class="wallet">
    <div ref="chartRef" style="width: 100vw" />
    <div v-for="(item, index) in datas" :key="index" class="wallet-item">
      <div class="wallet-top">
        <span class="wallet-date">{{ moment(item.settleDate).format('YYYY年ww周') }}</span>
        <span class="wallet-total" :style="{ color: '#333' }">
          {{ parseFloat(item.total).toFixed(2) }}K
        </span>
      </div>
      <div style="height: 6px" />
      <div class="wallet-details">
        <div class="wallet-detail" v-for="(label, key) in maps" :key="key">
          <span class="label">{{ label }}: </span>
          <span class="value">
            {{
              Array.isArray(item[key])
                ? `[${item[key].map((t) => (key === 'usd' ? '$' : '') + t + 'K').join(' & ')}]`
                : item[key] + 'K'
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wallet {
  .wallet-item {
    padding: 6px 16px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }
  .wallet-top {
    display: flex;
    justify-content: space-between;
  }
  .wallet-date {
    font-size: 16px;
    color: #333;
  }
  .wallet-total {
    font-size: 16px;
  }
  .wallet-details {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .wallet-detail {
    display: flex;
  }
  .label {
    font-size: 14px;
    color: #333;
    margin-right: 4px;
  }
  .value {
    font-size: 14px;
    color: #999;
  }
}
</style>
