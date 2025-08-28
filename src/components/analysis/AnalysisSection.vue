<template>
  <section>
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h2 class="text-2xl md:text-3xl font-bold">穿搭分析</h2>
        <div class="mt-4 md:mt-0 flex items-center space-x-3">
          <select
            class="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option>本月</option>
            <option>上月</option>
            <option>近3个月</option>
            <option>近半年</option>
            <option>本年</option>
          </select>
          <button
            class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            <font-awesome-icon :icon="['fas', 'download']" class="mr-2" />
            导出报告
          </button>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <transition-group name="fade" tag="div" class="contents">
          <div
            v-for="(card, index) in statsCards"
            :key="card.title"
            :class="card.bg"
            class="rounded-2xl p-6 text-white shadow-xl relative overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
          >
            <!-- 装饰背景 -->
            <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full"></div>
            <div class="absolute -right-12 -top-12 w-32 h-32 bg-white/5 rounded-full"></div>

            <div class="flex justify-between items-start mb-5 relative z-10">
              <div>
                <p class="text-white/80 text-sm">{{ card.title }}</p>
                <h3 class="text-3xl font-bold mt-1">{{ card.value }}</h3>
              </div>
              <div
                class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
              >
                <font-awesome-icon :icon="card.icon" class="text-xl" />
              </div>
            </div>

            <div class="flex items-center text-sm text-white/80 relative z-10">
              <font-awesome-icon :icon="['fas', 'arrow-up']" class="mr-1" />
              <span>{{ card.tip }}</span>
            </div>

            <!-- 趋势图 -->
            <div class="absolute bottom-0 left-0 right-0 h-16 opacity-20">
              <svg viewBox="0 0 200 60" preserveAspectRatio="none" class="w-full h-full">
                <path
                  v-if="index === 0"
                  d="M0,40 C30,20 50,30 80,25 C110,20 130,35 160,30 C190,25 200,40 200,40 L200,60 L0,60 Z"
                  fill="white"
                />
                <path
                  v-if="index === 1"
                  d="M0,30 C30,40 50,20 80,35 C110,50 130,30 160,40 C190,50 200,30 200,30 L200,60 L0,60 Z"
                  fill="white"
                />
                <path
                  v-if="index === 2"
                  d="M0,35 C30,25 50,40 80,30 C110,20 130,45 160,35 C190,25 200,35 200,35 L200,60 L0,60 Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- 衣物分类统计和穿着频率 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <!-- 衣物分类占比 -->
        <div class="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-lg">衣物分类占比</h3>
            <button class="text-primary text-sm font-medium flex items-center">
              <span>详情</span>
              <font-awesome-icon :icon="['fas', 'arrow-right']" class="ml-1 text-xs" />
            </button>
          </div>

          <div class="flex flex-col md:flex-row items-center">
            <!-- 饼图 -->
            <div class="relative w-64 h-64 mb-8 md:mb-0">
              <div
                class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              ></div>
              <div class="relative w-full h-full flex items-center justify-center p-6">
                <svg class="w-48 h-48 drop-shadow-md" viewBox="0 0 100 100">
                  <!-- 背景圆 -->
                  <circle cx="50" cy="50" r="45" fill="#F9FAFB" stroke="#E5E7EB" stroke-width="2" />

                  <!-- 动态饼图部分 -->
                  <g>
                    <circle
                      v-for="(legend, index) in legends"
                      :key="legend.label"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      :stroke="getStrokeColor(legend.color)"
                      stroke-width="12"
                      :stroke-dasharray="getStrokeDasharray(legend.percent)"
                      :stroke-dashoffset="getStrokeDashoffset(index)"
                      transform="rotate(-90 50 50)"
                      class="transition-all duration-700 ease-in-out hover:opacity-90"
                      style="filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1))"
                    />
                  </g>

                  <!-- 中心白色圆圈 -->
                  <circle cx="50" cy="50" r="30" fill="white" stroke="#F3F4F6" stroke-width="1" />
                </svg>

                <!-- 中心统计信息 -->
                <div class="absolute inset-0 flex items-center justify-center flex-col">
                  <p class="font-bold text-2xl text-gray-800">{{ getTotalItems() }}</p>
                  <p class="text-sm text-gray-500 mt-1">总衣物</p>
                </div>

                <!-- 装饰元素 -->
                <div
                  class="absolute top-4 right-4 w-3 h-3 rounded-full bg-indigo-500 opacity-70"
                ></div>
                <div
                  class="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-pink-500 opacity-70"
                ></div>
              </div>
            </div>

            <!-- 图例 -->
            <div class="md:ml-10 w-full">
              <div
                v-for="(legend, index) in legends"
                :key="legend.label"
                class="mb-5 last:mb-0 group cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                @mouseenter="highlightCategory(index)"
                @mouseleave="resetHighlight"
                @click="showCategoryDetail(legend)"
              >
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center">
                    <div
                      :class="legend.color"
                      class="w-4 h-4 rounded-full mr-3 shadow-sm transition-all duration-300 group-hover:scale-110"
                    ></div>
                    <div class="flex flex-col">
                      <span class="text-base font-medium text-gray-800">
                        {{ legend.label.split(' (')[0] }}
                      </span>
                      <span class="text-xs text-gray-500 mt-0.5">{{ legend.percent }}% 占比</span>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <span class="text-base font-semibold text-gray-800 mr-2">
                      {{ legend.label.match(/\(([^)]+)\)/)[1] }}
                    </span>
                    <font-awesome-icon
                      :icon="['fas', 'chevron-right']"
                      class="text-xs text-gray-400 transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    :class="legend.color.replace('bg-', 'bg-')"
                    class="h-2.5 rounded-full transition-all duration-1000 ease-out"
                    :style="{ width: legend.percent + '%' }"
                  ></div>
                </div>
              </div>

              <!-- 底部提示 -->
              <div class="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <p class="text-xs text-indigo-700 flex items-center">
                  <font-awesome-icon :icon="['fas', 'lightbulb']" class="mr-2" />
                  点击分类查看更多详细分析
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 穿着频率TOP5 -->
        <div class="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-lg">穿着频率TOP5</h3>
            <button class="text-primary text-sm font-medium flex items-center">
              <span>详情</span>
              <font-awesome-icon :icon="['fas', 'arrow-right']" class="ml-1 text-xs" />
            </button>
          </div>

          <div class="space-y-5">
            <div v-for="(item, idx) in top5" :key="item.name" class="flex items-center group">
              <div
                :class="
                  idx === 0
                    ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white'
                    : idx === 1
                    ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                    : idx === 2
                    ? 'bg-gradient-to-br from-amber-700 to-amber-800 text-white'
                    : 'bg-gray-100 text-gray-700'
                "
                class="w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110"
              >
                {{ idx + 1 }}
              </div>
              <div
                class="w-14 h-14 rounded-xl overflow-hidden mr-4 flex-shrink-0 shadow-soft border border-gray-100"
              >
                <img :src="item.img" :alt="item.name" class="w-full h-full object-cover" />
              </div>
              <div class="flex-grow">
                <p class="font-medium">{{ item.name }}</p>
                <div class="flex items-center mt-1.5">
                  <div class="flex-grow bg-gray-100 rounded-full h-2.5">
                    <div
                      :class="
                        idx === 0
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                          : idx === 1
                          ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                          : idx === 2
                          ? 'bg-gradient-to-r from-amber-700 to-amber-800'
                          : 'bg-gradient-to-r from-primary to-secondary'
                      "
                      class="h-2.5 rounded-full"
                      :style="{ width: item.percent + '%' }"
                    ></div>
                  </div>
                  <span class="ml-3 text-sm font-medium w-12 text-right">{{ item.count }}次</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 久未穿着提醒 -->
      <div class="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-lg">久未穿着提醒</h3>
          <div class="flex items-center space-x-3">
            <button class="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center">
              <font-awesome-icon :icon="['fas', 'filter']" class="mr-1" />
              筛选
            </button>
            <a href="#" class="text-primary font-medium flex items-center group">
              <span>查看全部</span>
              <font-awesome-icon
                :icon="['fas', 'arrow-right']"
                class="ml-1 text-sm group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          <div v-for="item in reminders" :key="item.name" class="group relative">
            <div
              class="aspect-square bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 border border-amber-100 relative"
            >
              <!-- 时间标签 -->
              <div
                :class="item.days > 60 ? 'bg-red-500' : 'bg-amber-500'"
                class="absolute top-3 right-3 text-white text-xs font-medium px-2.5 py-1 rounded-lg z-10 flex items-center"
              >
                <font-awesome-icon :icon="['fas', 'clock']" class="mr-1 text-xs" />
                {{ item.days }}天
              </div>

              <!-- 图片 -->
              <img
                :src="item.img"
                :alt="item.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <!-- 悬停操作 -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4"
              >
                <button
                  class="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-neutral-800 hover:bg-white transition-colors shadow-lg"
                >
                  <font-awesome-icon :icon="['fas', 'plus']" />
                </button>
              </div>
            </div>

            <!-- 衣物信息 -->
            <div class="mt-3">
              <p class="text-sm font-medium">{{ item.name }}</p>
              <div class="flex items-center text-xs text-gray-500 mt-1">
                <span>{{ item.type.split(' · ')[0] }}</span>
                <span class="mx-1.5">•</span>
                <span>{{ item.type.split(' · ')[1] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  const statsCards = [
    {
      title: '总衣物数量',
      value: '38件',
      tip: '较上月增加 4 件',
      icon: ['fas', 'shirt'],
      bg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    },
    {
      title: '已创建穿搭',
      value: '12套',
      tip: '本周新增 2 套',
      icon: ['fas', 'layer-group'],
      bg: 'bg-gradient-to-br from-pink-500 to-rose-500',
    },
    {
      title: '本月穿着率',
      value: '68%',
      tip: '较上月提升 12%',
      icon: ['fas', 'chart-pie'],
      bg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    },
  ];

  const legends = [
    { color: 'bg-indigo-500', label: '上衣 (12件)', icon: ['fas', 'shirt'], percent: 32 },
    { color: 'bg-pink-500', label: '裤子 (8件)', icon: ['fas', 'person-dress'], percent: 21 },
    { color: 'bg-green-500', label: '外套 (5件)', icon: ['fas', 'vest'], percent: 13 },
    { color: 'bg-red-500', label: '配饰 (13件)', icon: ['fas', 'glasses'], percent: 34 },
  ];

  // 获取总衣物数量
  const getTotalItems = () => {
    return legends.reduce((total, legend) => {
      return total + parseInt(legend.label.match(/\(([^)]+)\)/)[1]);
    }, 0);
  };

  // 获取饼图描边颜色
  const getStrokeColor = colorClass => {
    const colorMap = {
      'bg-indigo-500': '#7C3AED',
      'bg-pink-500': '#EC4899',
      'bg-green-500': '#10B981',
      'bg-red-500': '#EF4444',
    };
    return colorMap[colorClass] || '#7C3AED';
  };

  // 获取描边虚线数组长度
  const getStrokeDasharray = percent => {
    const circumference = 2 * Math.PI * 45; // 圆周长
    return (percent / 100) * circumference;
  };

  // 获取描边偏移量
  const getStrokeDashoffset = index => {
    const circumference = 2 * Math.PI * 45; // 圆周长
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getStrokeDasharray(legends[i].percent);
    }
    return -offset;
  };

  // 高亮显示特定分类
  const highlightCategory = index => {
    // 这里可以添加高亮逻辑，例如改变饼图的透明度
    const circles = document.querySelectorAll('svg circle:not(:first-child)');
    circles.forEach((circle, i) => {
      if (i !== index) {
        circle.style.opacity = '0.3';
      } else {
        circle.style.opacity = '1';
      }
    });
  };

  // 重置高亮
  const resetHighlight = () => {
    const circles = document.querySelectorAll('svg circle:not(:first-child)');
    circles.forEach(circle => {
      circle.style.opacity = '1';
    });
  };

  // 显示分类详情
  const showCategoryDetail = legend => {
    // 这里可以添加显示分类详情的逻辑
    console.log('查看分类详情:', legend.label.split(' (')[0]);
    // 实际应用中，这里可以打开一个模态框或导航到详情页
  };

  const top5 = [
    {
      name: '灰色连帽卫衣',
      img: 'https://picsum.photos/seed/top1/100/100',
      percent: 85,
      count: 17,
    },
    {
      name: '深蓝色牛仔裤',
      img: 'https://picsum.photos/seed/top2/100/100',
      percent: 75,
      count: 15,
    },
    { name: '白色T恤', img: 'https://picsum.photos/seed/top3/100/100', percent: 68, count: 13 },
    { name: '黑色运动鞋', img: 'https://picsum.photos/seed/top4/100/100', percent: 62, count: 12 },
    { name: '黑色夹克', img: 'https://picsum.photos/seed/top5/100/100', percent: 55, count: 11 },
  ];

  const reminders = [
    {
      name: '条纹衬衫',
      type: '上衣 · 正式',
      img: 'https://picsum.photos/seed/old1/200/200',
      days: 32,
    },
    {
      name: '棕色皮鞋',
      type: '鞋子 · 正式',
      img: 'https://picsum.photos/seed/old2/200/200',
      days: 45,
    },
    {
      name: '灰色西装裤',
      type: '裤子 · 正式',
      img: 'https://picsum.photos/seed/old3/200/200',
      days: 56,
    },
    {
      name: '红色毛衣',
      type: '上衣 · 休闲',
      img: 'https://picsum.photos/seed/old4/200/200',
      days: 62,
    },
    {
      name: '黑色风衣',
      type: '外套 · 正式',
      img: 'https://picsum.photos/seed/old5/200/200',
      days: 78,
    },
  ];
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
