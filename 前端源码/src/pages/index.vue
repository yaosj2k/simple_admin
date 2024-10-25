<template>
    <div>
      <el-row :gutter="20">
        <!-- 骨架屏，数据加载前的占位 -->
        <template v-if="panels.length === 0">
          <el-col :span="6" v-for="i in 4" :key="i">
            <el-skeleton style="width: 100%;" animated loading>
              <template #template>
                <el-card shadow="hover" class="border-0">
                  <template #header>
                    <div class="flex justify-between">
                      <el-skeleton-item variant="text" style="width: 50%" />
                      <el-skeleton-item variant="text" style="width: 10%" />
                    </div>
                  </template>
                  <el-skeleton-item variant="h3" style="width: 80%" />
                  <el-divider />
                  <div class="flex justify-between text-sm text-gray-500">
                    <el-skeleton-item variant="text" style="width: 50%" />
                    <el-skeleton-item variant="text" style="width: 10%" />
                  </div>
                </el-card>
              </template>
            </el-skeleton>
          </el-col>
        </template>
  
        <!-- 数据展示部分 -->
        <el-col :span="6" v-for="(item, index) in panels" :key="index">
          <el-card shadow="hover" class="border-0">
            <template #header>
              <div class="flex justify-between">
                <span class="text-sm">{{ item.title }}</span>
                <el-tag :type="item.unitColor" effect="plain">
                  {{ item.unit }}
                </el-tag>
              </div>
            </template>
            <span class="text-3xl font-bold text-gray-500">
              <CountTo :value="item.value" />
            </span>
            <el-divider />
            <div class="flex justify-between text-sm text-gray-500">
              <span>{{ item.subTitle }}</span>
              <span>{{ item.subValue }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
  
      <!-- 其他组件 -->
      <IndexNavs />
  
      <el-row :gutter="20" class="mt-5">
        <el-col :span="12">
          <IndexChart />
        </el-col>
        <el-col :span="12">
          <IndexCard title="店铺及商品提示" tip="店铺及商品提示" :btns="goods" class="mb-3" />
          <IndexCard title="交易提示" tip="需要立即处理的交易订单" :btns="order" />
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import CountTo from '~/components/CountTo.vue';
  import IndexNavs from '~/components/IndexNavs.vue';
  import IndexChart from '~/components/IndexChart.vue';
  import IndexCard from '~/components/IndexCard.vue';
  import { getStatistics1, getStatistics2 } from '~/api/index.js';
  
  const panels = ref([]);
  const goods = ref([]);
  const order = ref([]);
  
  // 定义有效的 ElTag 类型
  const validTagTypes = ['primary', 'success', 'info', 'warning', 'danger'];
  
  // 获取统计数据并预处理
  getStatistics1().then((res) => {
    panels.value = res.panels.map((panel) => {
      // 确保 unitColor 有效
      if (!validTagTypes.includes(panel.unitColor)) {
        panel.unitColor = 'info'; // 设置默认值
      }
      return panel;
    });
  });
  
  // 获取商品和订单提示数据
  getStatistics2().then((res) => {
    goods.value = res.goods;
    order.value = res.order;
  });
  </script>
  
  <style scoped>
  /* 添加必要的样式 */
  </style>
  