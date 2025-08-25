<template>
  <div class="relative overflow-hidden mb-8">
    <div class="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 transform skew-y-3"></div>
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGciPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTMwIDM1Yy01IDAtOS00LTktOXMtNC05IDktOSA5IDQgOSA5LTQgOSA5IDkgOSA0IDkgOS00IDktOXptMCAxNWMtMTIuMSAwLTIyLTEwLTEyLjEtMjJzMTAtMjIgMjItMTAgMjIgMTAgMTAgMjItMjIgMTJ6bTAtMzRjLTExIDAtMjAgOS0yMCAyMHM5IDIwIDIwIDIwIDIwLTkgMjAtMjAtOS0yMC0yMC0yMHptLTMwIDIwYzAtMTYuNiAxMy40LTMwIDMwLTMwczMwIDEzLjQgMzAgMzAtMTMuNCAzMC0zMCAzMCIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
    <div class="container mx-auto px-4 py-12 md:py-20 relative z-10">
      <div class="max-w-2xl">
        <h2 class="text-[clamp(1.8rem,4vw,3rem)] font-bold text-white leading-tight mb-3">打造你的专属衣橱</h2>
        <p class="text-white/90 text-balance text-[clamp(1rem,1.5vw,1.1rem)] mb-8 max-w-xl">智能管理衣物，轻松搭配，展现独特风格，让每一天都充满时尚感</p>
        <SearchBar @search="handleSearch" />
        <div class="flex flex-wrap gap-4">
          <button class="bg-white text-primary hover:bg-neutral-100 font-medium py-3 px-8 rounded-2xl shadow-medium transition-all flex items-center space-x-2 group" @click="$emit('showUpload')">
            <font-awesome-icon :icon="['fas', 'plus-circle']" class="group-hover:scale-110 transition-transform" />
            <span>添加新衣物</span>
          </button>
          <button class="bg-white text-primary hover:bg-neutral-100 font-medium py-3 px-8 rounded-2xl shadow-medium transition-all flex items-center space-x-2 group" @click="$emit('viewAll')">
            <font-awesome-icon :icon="['fas', 'th-list']" class="group-hover:scale-110 transition-transform" />
            <span>查看全部</span>
          </button>
          <button class="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-medium py-3 px-8 rounded-2xl shadow-medium transition-all flex items-center space-x-2">
            <font-awesome-icon :icon="['fas', 'magic']" />
            <span>智能搭配</span>
          </button>
        </div>
      </div>
    </div>
    <div class="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full"></div>
    <div class="absolute top-1/3 right-1/4 w-32 h-32 bg-white/5 rounded-full"></div>
  </div>
</template>

<script>
import SearchBar from '../../common/ui/SearchBar.vue'

export default {
  name: 'WardrobeHeader',
  components: {
    SearchBar
  },
  props: {
    handleSearch: {
      type: Function,
      required: true
    }
  },
  emits: ['showUpload', 'viewAll']
}
</script>