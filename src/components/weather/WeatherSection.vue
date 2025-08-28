<template>
  <section>
    <div class="container mx-auto px-4">
      <h2 class="text-2xl md:text-3xl font-bold mb-8">天气穿搭推荐</h2>
      <!-- 天气信息卡片 -->
      <transition name="fade" mode="out-in">
        <div
          class="bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-3xl p-6 md:p-8 text-white mb-10 shadow-xl relative overflow-hidden backdrop-blur-sm"
          :key="weather.city"
        >
          <!-- 装饰背景元素 -->
          <div
            class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"
          ></div>
          <div
            class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"
          ></div>

          <!-- 天气卡片主要内容 -->
          <div class="relative z-10">
            <!-- 顶部信息 -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div class="mb-6 md:mb-0">
                <div class="flex items-center mb-2">
                  <font-awesome-icon :icon="['fas', 'location-dot']" class="mr-2 text-white/80" />
                  <h3 class="text-xl md:text-2xl font-semibold">{{ weather.city }}</h3>
                </div>
                <div class="flex items-center text-white/80">
                  <font-awesome-icon :icon="['far', 'calendar']" class="mr-2" />
                  <p>{{ weather.date }}</p>
                </div>
              </div>

              <!-- 温度和天气图标 -->
              <div class="flex items-center">
                <div class="text-center md:text-right">
                  <div class="flex items-center justify-center md:justify-end mb-1">
                    <p class="text-5xl md:text-6xl font-bold">{{ weather.temp }}°</p>
                    <span class="text-3xl md:text-4xl font-bold ml-1">C</span>
                  </div>
                  <p class="text-lg text-white/90">{{ weather.desc }}</p>
                  <div class="flex items-center justify-center md:justify-end mt-2">
                    <span class="text-sm bg-white/20 px-3 py-1 rounded-full">
                      体感 {{ weather.feelsLike }}°C
                    </span>
                  </div>
                </div>
                <div class="ml-6 text-yellow-200">
                  <font-awesome-icon :icon="['far', 'sun']" class="text-6xl md:text-7xl" />
                </div>
              </div>
            </div>

            <!-- 天气详情网格 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div class="flex justify-center mb-2">
                  <font-awesome-icon :icon="['fas', 'droplet']" class="text-blue-200" />
                </div>
                <p class="text-sm text-white/80 mb-1">湿度</p>
                <p class="font-semibold">{{ weather.humidity }}</p>
              </div>

              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div class="flex justify-center mb-2">
                  <font-awesome-icon :icon="['fas', 'wind']" class="text-blue-200" />
                </div>
                <p class="text-sm text-white/80 mb-1">风速</p>
                <p class="font-semibold">{{ weather.wind }}</p>
              </div>

              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div class="flex justify-center mb-2">
                  <font-awesome-icon :icon="['fas', 'sun']" class="text-yellow-200" />
                </div>
                <p class="text-sm text-white/80 mb-1">紫外线</p>
                <p class="font-semibold">{{ weather.uv }}</p>
              </div>

              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div class="flex justify-center mb-2">
                  <font-awesome-icon :icon="['fas', 'gauge']" class="text-blue-200" />
                </div>
                <p class="text-sm text-white/80 mb-1">气压</p>
                <p class="font-semibold">{{ weather.pressure }}</p>
              </div>
            </div>

            <!-- 日出日落和能见度 -->
            <div
              class="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/20"
            >
              <div class="flex items-center mb-4 md:mb-0">
                <div class="flex items-center mr-6">
                  <font-awesome-icon :icon="['fas', 'sun']" class="text-yellow-300 mr-2" />
                  <div>
                    <p class="text-xs text-white/70">日出</p>
                    <p class="font-medium">{{ weather.sunrise }}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <font-awesome-icon :icon="['fas', 'moon']" class="text-indigo-200 mr-2" />
                  <div>
                    <p class="text-xs text-white/70">日落</p>
                    <p class="font-medium">{{ weather.sunset }}</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center">
                <font-awesome-icon :icon="['fas', 'eye']" class="text-white/70 mr-2" />
                <div>
                  <p class="text-xs text-white/70">能见度</p>
                  <p class="font-medium">{{ weather.visibility }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- 穿搭推荐 -->
      <h3 class="text-xl md:text-2xl font-bold mb-6">为您推荐</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        <transition-group name="fade" tag="div" class="contents">
          <div
            v-for="rec in recommendations"
            :key="rec.title"
            class="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1"
          >
            <!-- 卡片头部 -->
            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-base md:text-lg text-gray-800 truncate">
                  {{ rec.title }}
                </h4>
                <span :class="rec.tagClass" class="inline-flex items-center flex-shrink-0">
                  <span class="w-2 h-2 rounded-full mr-1" :class="rec.tagDotClass"></span>
                  {{ rec.tag }}
                </span>
              </div>
            </div>

            <!-- 图片展示区 -->
            <div class="p-4">
              <div class="grid grid-cols-2 gap-2 mb-4">
                <div
                  v-for="(img, idx) in rec.images.slice(0, 4)"
                  :key="idx"
                  class="aspect-square rounded-lg overflow-hidden shadow-soft transition-transform duration-300 hover:scale-105"
                >
                  <img :src="img" class="w-full h-full object-cover" />
                </div>
              </div>

              <!-- 描述信息 -->
              <div class="mb-4">
                <p class="text-sm text-gray-600 line-clamp-2">{{ rec.desc }}</p>
                <div class="mt-2 flex flex-wrap gap-1">
                  <span
                    v-for="(item, index) in rec.items.slice(0, 3)"
                    :key="index"
                    class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                  >
                    {{ item }}
                  </span>
                  <span
                    v-if="rec.items.length > 3"
                    class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                  >
                    +{{ rec.items.length - 3 }}
                  </span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                <button class="text-indigo-600 font-medium group flex items-center text-sm">
                  <span>查看详情</span>
                  <font-awesome-icon
                    :icon="['fas', 'arrow-right']"
                    class="ml-1 text-xs group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <div class="flex gap-1">
                  <button
                    class="bg-indigo-50 text-indigo-600 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center"
                  >
                    <font-awesome-icon :icon="['far', 'heart']" class="mr-1 text-xs" />
                    收藏
                  </button>
                  <button
                    class="bg-indigo-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <font-awesome-icon :icon="['fas', 'share']" class="mr-1 text-xs" />
                    分享
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- 未来几天预报 -->
      <h3 class="text-xl md:text-2xl font-bold mb-6">未来几天穿搭预览</h3>
      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <transition-group name="fade" tag="div" class="contents">
          <div
            v-for="day in forecast"
            :key="day.week"
            class="bg-white rounded-2xl p-4 shadow-soft hover:shadow-medium transition-all duration-300 flex flex-col"
          >
            <div class="flex justify-between items-start mb-3">
              <p class="font-medium">{{ day.week }}</p>
              <div class="flex items-center">
                <font-awesome-icon :icon="day.icon" :class="day.iconClass" class="mr-2" />
                <span class="font-bold text-lg">{{ day.temp }}°C</span>
              </div>
            </div>

            <div class="mb-4 flex-grow">
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="(img, idx) in day.images"
                  :key="idx"
                  class="aspect-square rounded-lg overflow-hidden shadow-soft"
                >
                  <img :src="img" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <button
              class="w-full bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-medium py-2 rounded-lg transition-colors text-sm"
            >
              查看推荐
            </button>
          </div>
        </transition-group>
      </div>
    </div>
  </section>
</template>

<script setup>
  const weather = {
    city: '北京市',
    date: '星期三, 6月15日',
    temp: 28,
    feelsLike: 30,
    desc: '晴朗 · 微风',
    humidity: '45%',
    uv: '中等',
    wind: '2级',
    pressure: '1013hPa',
    visibility: '10km',
    sunrise: '05:12',
    sunset: '19:45',
  };
  const recommendations = [
    {
      title: '日常通勤',
      tag: '舒适',
      tagClass: 'bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full',
      tagDotClass: 'bg-green-500',
      items: ['棉质T恤', '休闲裤', '运动鞋', '帆布包'],
      images: [
        'https://picsum.photos/seed/rec1-1/200/200',
        'https://picsum.photos/seed/rec1-2/200/200',
        'https://picsum.photos/seed/rec1-3/200/200',
        'https://picsum.photos/seed/rec1-4/200/200',
      ],
      desc: '适合28°C的天气，透气舒适，搭配休闲鞋适合长时间步行。',
    },
    {
      title: '约会穿搭',
      tag: '时尚',
      tagClass: 'bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full',
      tagDotClass: 'bg-purple-500',
      items: ['衬衫', '修身裤', '皮鞋', '腕表'],
      images: [
        'https://picsum.photos/seed/rec2-1/200/200',
        'https://picsum.photos/seed/rec2-2/200/200',
        'https://picsum.photos/seed/rec2-3/200/200',
        'https://picsum.photos/seed/rec2-4/200/200',
      ],
      desc: '适合傍晚约会，轻松时尚，搭配小配饰提升整体造型感。',
    },
    {
      title: '户外运动',
      tag: '活力',
      tagClass: 'bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full',
      tagDotClass: 'bg-blue-500',
      items: ['运动背心', '短裤', '跑鞋', '运动手表'],
      images: [
        'https://picsum.photos/seed/rec3-1/200/200',
        'https://picsum.photos/seed/rec3-2/200/200',
        'https://picsum.photos/seed/rec3-3/200/200',
        'https://picsum.photos/seed/rec3-4/200/200',
      ],
      desc: '适合户外运动，透气排汗，保持运动过程中的舒适感。',
    },
  ];
  const forecast = [
    {
      week: '周四',
      icon: ['fas', 'cloud'],
      iconClass: 'text-xl text-neutral-500',
      temp: 25,
      images: [
        'https://picsum.photos/seed/fut1-1/100/100',
        'https://picsum.photos/seed/fut1-2/100/100',
      ],
    },
    {
      week: '周五',
      icon: ['fas', 'tint'],
      iconClass: 'text-xl text-blue-500',
      temp: 22,
      images: [
        'https://picsum.photos/seed/fut2-1/100/100',
        'https://picsum.photos/seed/fut2-2/100/100',
        'https://picsum.photos/seed/fut2-3/100/100',
      ],
    },
    {
      week: '周六',
      icon: ['far', 'sun'],
      iconClass: 'text-xl text-yellow-500',
      temp: 30,
      images: [
        'https://picsum.photos/seed/fut3-1/100/100',
        'https://picsum.photos/seed/fut3-2/100/100',
      ],
    },
    {
      week: '周日',
      icon: ['fas', 'cloud'],
      iconClass: 'text-xl text-neutral-500',
      temp: 26,
      images: [
        'https://picsum.photos/seed/fut4-1/100/100',
        'https://picsum.photos/seed/fut4-2/100/100',
      ],
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
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
