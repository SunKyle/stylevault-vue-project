<template>
  <section class="py-10">
    <div class="container mx-auto px-4">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          我的时尚灵感
        </h1>
        <p class="text-neutral-500 max-w-2xl mx-auto">
          探索和创建完美的服装搭配，展现你的个人风格。从已有的衣物中寻找灵感，打造独特造型。
        </p>
      </div>

      <!-- 已保存搭配区域 -->
      <div class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold flex items-center">
            <font-awesome-icon :icon="['fas', 'heart']" class="text-primary mr-2" />
            我的搭配
          </h2>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {{ savedOutfits.length }}套方案
          </span>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-md relative overflow-hidden">
          <!-- 装饰元素 -->
          <div class="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 rounded-full"></div>
          <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/5 rounded-full"></div>
          
          <!-- 已保存搭配列表 -->
          <div v-if="savedOutfits.length > 0" class="relative z-10">
            <!-- 搭配卡片网格布局 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="(outfit, index) in currentPageOutfits" :key="outfit.id" 
                   class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-neutral-100 flex flex-col h-full transform hover:-translate-y-1">
                <!-- 搭配预览 - 优化后的卡片顶部 -->
                <div class="relative overflow-hidden">
                  <!-- 卡片顶部渐变背景 -->
                  <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 transform transition-transform duration-700 group-hover:scale-110"></div>
                  
                  <!-- 装饰元素 - 增强卡片深度感 -->
                  <div class="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
                  <div class="absolute -bottom-10 -left-10 w-24 h-24 bg-secondary/20 rounded-full blur-xl"></div>
                  
                  <!-- 卡片内容 -->
                  <div class="p-5 h-56 flex flex-col relative z-10">
                    <!-- 评分和操作按钮组 -->
                    <div class="flex justify-between items-start mb-3">
                      <div class="flex items-center bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
                        <font-awesome-icon :icon="['fas', 'tshirt']" class="text-yellow-400 text-xs mr-1" />
                        <span class="text-xs font-medium text-neutral-800">
                          {{ getOutfitRating(outfit) }}分
                        </span>
                      </div>
                      <div class="relative group/menu">
                        <button class="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-neutral-600 transition-colors hover:bg-primary hover:text-white">
                          <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" class="text-xs" />
                        </button>
                        <!-- 下拉菜单 -->
                        <div class="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg overflow-hidden z-50 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 transform origin-top-right scale-95 group-hover/menu:scale-100">
                          <button @click="loadOutfit(outfit)" class="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 flex items-center">
                            <font-awesome-icon :icon="['fas', 'redo']" class="text-primary text-xs mr-2" />
                            加载搭配
                          </button>
                          <button @click="shareOutfit(outfit)" class="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 flex items-center">
                            <font-awesome-icon :icon="['fas', 'share-nodes']" class="text-blue-500 text-xs mr-2" />
                            分享搭配
                          </button>
                          <button @click="deleteOutfit(index)" class="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-500 flex items-center">
                            <font-awesome-icon :icon="['fas', 'trash']" class="text-xs mr-2" />
                            删除搭配
                          </button>
                        </div>
                      </div>
                    </div>

                  
                  <!-- 标题区域 -->
                  <div class="mb-3">
                    <h4 class="font-bold text-neutral-800 text-lg truncate pr-2 group-hover:text-primary transition-colors">
                      {{ outfit.name }}
                    </h4>
                    <div v-if="outfit?.scene" class="flex items-center mt-1">
                      <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="text-primary text-xs mr-1" />
                      <span class="text-xs text-primary font-medium">{{ outfit?.scene || '' }}</span>
                    </div>
                  </div>
                
                  <!-- 衣物预览区 - 增强的3D堆叠效果 -->
                  <div class="flex-1 flex items-center justify-center relative">
                    <div v-for="(item, idx) in (outfit?.items || []).slice(0, 6)" :key="idx" 
                         class="absolute group/item transition-all duration-500 ease-out" 
                         :style="{ 
                           transform: `translate(${(idx - 2.5) * 18}px, ${Math.abs(idx - 2.5) * -6}px) rotate(${(idx - 2.5) * 5}deg) scale(${0.85 - Math.abs(idx - 2.5) * 0.08})`,
                           zIndex: 5 - Math.abs(idx - 2.5)
                         }">
                      <img :src="item.img" :alt="item.name" 
                           class="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shadow-md border-2 border-white transition-all duration-500 group-hover/item:scale-115 group-hover/item:z-30 group-hover/item:rotate-0" 
                           loading="lazy" />
                      <div class="absolute inset-x-0 -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none text-center whitespace-nowrap z-10">
                        {{ item.name }}
                      </div>
                    </div>
                    
                    <!-- 更多衣物指示器 - 改进样式 -->
                    <div v-if="outfit?.items?.length > 6" class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md animate-pulse">
                      +{{ (outfit?.items?.length || 0) - 6 }}
                    </div>
                    
                    <!-- 空状态 - 增强设计 -->
                    <div v-if="(outfit?.items?.length || 0) === 0" class="text-center text-neutral-400 p-4">
                      <div class="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-2">
                        <font-awesome-icon :icon="['fas', 'tshirt']" class="text-xl" />
                      </div>
                      <p class="text-sm">暂无衣物</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 搭配信息 -->
              <div class="p-5 flex-1 flex flex-col bg-white">
                <!-- 日期和操作按钮（移动端） -->
                <div class="flex justify-between items-center mb-3 md:hidden">
                  <span class="text-xs text-neutral-500">{{ outfit?.createdAt ? formatDate(outfit.createdAt) : '-' }}</span>
                  <div class="flex gap-1">
                    <button @click="loadOutfit(outfit)" 
                            class="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors" 
                            title="加载搭配">
                      <font-awesome-icon :icon="['fas', 'redo']" class="text-xs" />
                    </button>
                    <button @click="deleteOutfit(index)" 
                            class="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors" 
                            title="删除搭配">
                      <font-awesome-icon :icon="['fas', 'trash']" class="text-xs" />
                    </button>
                  </div>
                </div>
                
                <!-- 衣物类型统计 - 优化样式和交互 -->
                <div class="mb-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-3 transform transition-all duration-300 group-hover:shadow-md">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-medium text-neutral-700 flex items-center">
                      <font-awesome-icon :icon="['fas', 'layer-group']" class="mr-1 text-primary" />
                      衣物组成
                    </span>
                    <span class="text-xs bg-white text-primary px-2 py-0.5 rounded-full font-medium shadow-sm">
                      {{ outfit?.items?.length || 0 }}件
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="(count, type) in getOutfitStats(outfit?.items || [])" :key="type" 
                          class="text-xs bg-white text-neutral-700 px-3 py-1.5 rounded-md border border-neutral-100 shadow-sm flex items-center transform transition-all duration-300 hover:scale-105 hover:bg-primary/5 hover:border-primary/20">
                      <span class="w-2 h-2 rounded-full bg-primary mr-1.5"></span>
                      {{ type }}: {{ count }}
                    </span>
                  </div>
                </div>
                
                <!-- 场景和标签 - 增强视觉层次 -->
                <div class="mb-4 space-y-3">
                  <!-- 场景信息 - 增强视觉吸引力 -->
                  <div v-if="outfit?.scene" class="transform transition-all duration-300 group-hover:translate-x-1">
                    <div class="text-xs font-medium text-neutral-700 mb-2 flex items-center">
                      <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="text-primary mr-1" />
                      适用场景
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <span class="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md border border-blue-100 text-xs font-medium shadow-sm hover:shadow-md transition-all duration-300">
                        <span class="w-2 h-2 rounded-full bg-blue-400 mr-1.5"></span>
                        {{ outfit?.scene || '' }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- 风格标签 - 增强交互体验 -->
                  <div v-if="getOutfitTags(outfit?.items || []).length > 0" class="transform transition-all duration-300 group-hover:translate-x-1">
                    <div class="text-xs font-medium text-neutral-700 mb-2">风格标签</div>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="tag in getOutfitTags(outfit?.items || []).slice(0, 4)" :key="tag" 
                            class="inline-flex items-center bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-3 py-1.5 rounded-md text-xs font-medium border border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                        <span class="w-2 h-2 rounded-full bg-primary mr-1.5"></span>
                        {{ tag }}
                      </span>
                      <span v-if="getOutfitTags(outfit?.items || []).length > 4" 
                            class="inline-flex items-center bg-neutral-50 text-neutral-600 px-3 py-1.5 rounded-md text-xs font-medium border border-neutral-200 hover:border-neutral-300 transition-all duration-300">
                        <span class="w-2 h-2 rounded-full bg-neutral-300 mr-1.5"></span>
                        +{{ getOutfitTags(outfit?.items || []).length - 4 }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- 底部信息 - 增强交互体验和视觉层次 -->
                <div class="mt-auto pt-4 border-t border-neutral-100">
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-xs text-neutral-500 hidden md:block flex items-center">
                      <font-awesome-icon :icon="['fas', 'calendar']" class="mr-1" />
                      {{ outfit?.createdAt ? formatDate(outfit.createdAt) : '-' }}
                    </span>
                    <!-- 互动数据 - 增强视觉反馈 -->
                    <div class="hidden md:flex items-center gap-3 text-xs text-neutral-500">
                      <button class="flex items-center hover:text-primary transition-colors group/like">
                        <font-awesome-icon :icon="['far', 'heart']" class="mr-1 group-hover/like:text-red-500 transition-colors duration-300" />
                        <span>{{ getRandomLikes() }}</span>
                      </button>
                      <button class="flex items-center hover:text-primary transition-colors group/comment">
                        <font-awesome-icon :icon="['far', 'comment']" class="mr-1 group-hover/comment:text-blue-500 transition-colors duration-300" />
                        <span>{{ getRandomComments() }}</span>
                      </button>
                    </div>
                  </div>
                  
                  <!-- 主要操作按钮 - 增强视觉反馈 -->
                  <button @click="loadOutfit(outfit)" 
                          class="w-full bg-white border border-primary text-primary hover:bg-primary hover:text-white font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md transform hover:-translate-y-1 active:translate-y-0">
                    <font-awesome-icon :icon="['fas', 'eye']" class="mr-2" />
                    <span>查看详情</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
            
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页控件 -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8 space-x-2">
        <button 
          v-for="page in totalPages" 
          :key="page"
          class="w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110"
          :class="{
            'bg-primary text-white shadow-md': currentPage === page,
            'bg-neutral-100 text-neutral-600 hover:bg-neutral-200': currentPage !== page
          }"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </div>
      
      <!-- 空状态 - 增强视觉吸引力 -->
      <div v-else class="text-center py-20 border border-dashed border-neutral-200 rounded-xl relative z-10 bg-gradient-to-b from-white to-neutral-50">
        <!-- 装饰元素 -->
        <div class="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
        <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary/5 rounded-full blur-xl"></div>
        
        <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6 transform transition-all duration-500 hover:scale-110">
          <font-awesome-icon :icon="['fas', 'heart']" class="text-primary text-3xl" />
        </div>
        <p class="text-neutral-600 text-lg mb-3 font-medium">暂无保存的搭配方案</p>
        <p class="text-neutral-400 text-sm mb-8 max-w-sm mx-auto">创建您的第一套搭配方案，开始记录和探索您的时尚灵感</p>
        <button @click="scrollToCreateSection" 
                class="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95">
          开始创建
        </button>
      </div>
      
      <!-- 创建搭配区域 -->
      <div id="create-section" class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- 左侧：穿搭预览 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl p-5 shadow-md h-full flex flex-col border border-neutral-100">
            <div class="flex justify-between items-center mb-5">
              <h3 class="font-bold text-lg flex items-center">
                <font-awesome-icon :icon="['fas', 'lightbulb']" class="text-secondary mr-2" />
                搭配灵感
              </h3>
              <div class="flex items-center gap-2">
                <span class="bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full font-medium text-sm">
                  {{ selectedClothes.length }}件
                </span>
              </div>
            </div>

            <!-- 搭配预览区 -->
            <div class="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 md:p-6 h-64 md:h-80 flex flex-col items-center justify-center mb-6 border-2 border-dashed border-neutral-200 relative overflow-hidden">
              <!-- 装饰元素 -->
              <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full"></div>
              <div class="absolute -top-8 -left-8 w-32 h-32 bg-secondary/5 rounded-full"></div>
              
              <!-- 空状态 -->
              <div v-if="selectedClothes.length === 0" class="text-center relative z-10">
                <div class="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <font-awesome-icon :icon="['fas', 'tshirt']" class="text-primary text-2xl" />
                </div>
                <p class="text-neutral-600 text-sm md:text-base font-medium">从右侧添加衣物进行搭配</p>
              </div>

              <!-- 有衣物时的预览 -->
              <div v-else class="w-full h-full flex flex-wrap justify-center items-center gap-3 md:gap-4 relative z-10">
                <div v-for="(item, idx) in selectedClothes.slice(0, 8)" :key="idx" 
                     class="relative group" 
                     :class="idx >= 6 ? 'opacity-70 scale-95' : ''" 
                     :style="{ transform: `translateY(${(idx % 3 - 1) * 10}px)` }">
                  <img :src="item.img" :alt="item.name" 
                       class="w-14 h-14 md:w-18 md:h-18 rounded-lg object-cover shadow-md border-2 border-white transition-transform duration-300 group-hover:scale-110" 
                       loading="lazy" />
                  <div v-if="idx === 7 && selectedClothes.length > 8" 
                       class="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    +{{ selectedClothes.length - 8 }}
                  </div>
                  <div class="absolute inset-x-0 -bottom-6 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center truncate z-10 whitespace-nowrap">
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 衣物列表 -->
            <div class="flex-1 flex flex-col">
              <div class="mb-3 flex justify-between items-center">
                <span class="text-sm font-medium text-neutral-700">衣物清单 ({{ selectedClothes.length }})</span>
                <button v-if="selectedClothes.length > 0" class="text-xs text-primary hover:text-primary/80 transition-colors" @click="resetClothes">
                  清空全部
                </button>
              </div>

              <div class="h-48 md:h-56 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent space-y-2">
                <div v-if="selectedClothes.length === 0" class="text-center text-neutral-400 py-8 border border-dashed border-neutral-200 rounded-xl">
                  <p class="text-sm">尚未选择衣物</p>
                </div>
                <div v-else v-for="(item, idx) in selectedClothes" :key="idx" 
                     class="flex items-center gap-3 bg-neutral-50 rounded-lg px-3 py-2.5 group hover:bg-white transition-all duration-300 transform hover:translate-x-1 border border-transparent hover:border-primary/20">
                  <div class="relative">
                    <img :src="item.img" :alt="item.name" class="w-10 h-10 rounded-lg object-cover shadow-sm" loading="lazy" />
                    <div class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                      <span class="text-white text-xs font-bold">{{ idx + 1 }}</span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-neutral-800 truncate">{{ item.name }}</p>
                    <p class="text-xs text-neutral-500 truncate">{{ item.type }}</p>
                  </div>
                  <button class="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" 
                          @click="removeCloth(idx)">
                    <span class="text-lg">×</span>
                  </button>
                </div>
              </div>

              <!-- 操作按钮 - 增强视觉反馈和交互体验 -->
              <div class="mt-4 space-y-3">
                <button class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group/button" 
                        @click="saveOutfit"
                        :disabled="selectedClothes.length === 0">
                  <!-- 按钮装饰效果 -->
                  <div class="absolute inset-0 bg-white/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
                  <div class="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 transform -translate-x-full group-hover/button:translate-x-full transition-transform duration-700"></div>
                  
                  <font-awesome-icon :icon="['fas', 'heart']" class="mr-2 transition-transform duration-300 group-hover/button:scale-110" />
                  <span class="transition-transform duration-300 group-hover/button:scale-105">保存穿搭方案</span>
                </button>
                <button class="w-full bg-white border border-neutral-200 text-neutral-700 font-medium py-2.5 rounded-xl hover:bg-neutral-50 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-sm hover:shadow-md flex items-center justify-center" 
                        @click="resetClothes">
                  <font-awesome-icon :icon="['fas', 'undo']" class="mr-2 transition-transform duration-300 hover:rotate-180" />
                  重置搭配
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧：衣物选择 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl p-6 shadow-md border border-neutral-100">
            <h3 class="font-bold text-lg mb-5 flex items-center">
              <font-awesome-icon :icon="['fas', 'hanger']" class="text-primary mr-2" />
              选择衣物
            </h3>
            
            <!-- 过滤工具栏 -->
            <div class="bg-neutral-50 rounded-xl p-4 mb-6">
              <!-- 分类选项卡 -->
              <div class="flex border-b border-neutral-200 mb-4 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent -mx-1 px-1">
                <button v-for="cat in categories" :key="cat" class="px-4 py-2 font-medium whitespace-nowrap text-sm" 
                        :class="activeCategory === cat ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary'" 
                        @click="activeCategory = cat">
                  {{ cat }}
                </button>
              </div>
              
              <!-- 标签过滤 -->
              <div class="flex flex-wrap gap-2 -mx-1 px-1">
                <button v-for="tag in tags" :key="tag" 
                        class="text-xs px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all duration-300" 
                        :class="activeTag === tag ? 'bg-primary text-white shadow-sm' : 'bg-white text-neutral-700 border border-neutral-200'" 
                        @click="activeTag = tag">
                  {{ tag }}
                </button>
              </div>
            </div>
            
            <!-- 衣物列表 -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
              <transition-group name="fade" tag="div" class="contents">
                <div v-for="item in filteredClothes" :key="item.name" class="group relative">
                  <div class="aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-2 cursor-pointer relative transform hover:-translate-y-1" 
                       :class="selectedClothes.some(i => i.name === item.name) ? 'border-primary ring-1 ring-primary/30' : 'border-neutral-100 hover:border-primary/30'" 
                       @click="toggleCloth(item)">
                    <div class="w-full h-full overflow-hidden">
                      <img :src="item.img" :alt="item.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    </div>
                    <!-- 选中状态遮罩 -->
                    <div v-if="selectedClothes.some(i => i.name === item.name)" class="absolute inset-0 bg-primary/20"></div>
                    <!-- 悬停效果遮罩 -->
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    <!-- 选中状态指示器 -->
                    <div v-if="selectedClothes.some(i => i.name === item.name)" class="absolute top-3 right-3 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white shadow-lg transform transition-transform duration-300">
                      <span class="text-white font-bold text-lg">✓</span>
                    </div>
                    <!-- 未选中状态指示器 -->
                    <div v-else class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transform transition-transform duration-300 group-hover:scale-110">
                      <span class="text-primary font-bold text-lg">+</span>
                    </div>
                    <!-- 衣物信息 -->
                    <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                      <p class="text-white text-sm font-medium truncate">{{ item.name }}</p>
                      <p class="text-white/80 text-xs truncate">{{ item.type }}</p>
                    </div>
                  </div>
                  <div class="mt-2 px-1">
                    <p class="text-sm font-medium truncate group-hover:text-primary transition-colors">{{ item.name }}</p>
                    <p class="text-xs text-neutral-500 truncate">{{ item.type }}</p>
                  </div>
                </div>
              </transition-group>
              
              <!-- 空状态提示 -->
              <div v-if="filteredClothes.length === 0" class="col-span-full text-center py-12">
                <div class="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center mx-auto mb-4">
                  <font-awesome-icon :icon="['fas', 'search']" class="text-neutral-400 text-2xl" />
                </div>
                <p class="text-neutral-600 font-medium mb-3">没有找到符合条件的衣物</p>
                <button class="text-primary text-sm hover:text-primary/80 underline transition-colors" @click="activeCategory = '全部'; activeTag = ''">
                  查看全部衣物
                </button>
              </div>
            </div>
          </div>
          </div>         
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useWardrobeStore } from '../../../stores/wardrobeStore'
import { scenesMockData, getClothesWithTags } from '../../../mock/wardrobe'

const wardrobeStore = useWardrobeStore()
const categories = computed(() => ['全部', ...wardrobeStore.categories.map(c => c.name)])

// 分页相关数据
const currentPage = ref(1)
const itemsPerPage = ref(4) // 每页显示的卡片数量

// 从wardrobeStore获取转换后的数据
const clothes = ref([])

// 监听clothingItems变化，自动转换数据
watch(
  () => wardrobeStore.clothingItems,
  (newItems) => {
    if (newItems.length > 0) {
      clothes.value = getClothesWithTags(newItems)
    }
  },
  { immediate: true }
)

// 获取所有唯一的标签
const allTags = computed(() => {
  const tagSet = new Set()
  if (Array.isArray(clothes.value)) {
    clothes.value.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => tagSet.add(tag))
      }
    })
  }
  return Array.from(tagSet)
})

// 添加"最近穿着"标签
const tags = computed(() => {
  return ['最近穿着', ...allTags.value]
})
const activeCategory = ref('全部')
const activeTag = ref('')
const selectedClothes = ref([])
const savedOutfits = ref([])

// 计算当前页要显示的搭配
const currentPageOutfits = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  // 过滤掉无效的搭配对象
  return savedOutfits.value.slice(start, end).filter(outfit => outfit && outfit.id && outfit.name)
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(savedOutfits.value.length / itemsPerPage.value)
})

// 组件挂载时加载已保存的搭配
onMounted(() => {
  loadSavedOutfits()
  // 确保从store获取数据
  if (wardrobeStore.categories.length === 0) {
    wardrobeStore.fetchCategories()
  }
  if (wardrobeStore.clothingItems.length === 0) {
    wardrobeStore.fetchClothingItems()
  }
})

const filteredClothes = computed(() => {
  return clothes.value.filter(item => {
    const catMatch = activeCategory.value === '全部' || item.category === activeCategory.value
    const tagMatch = !activeTag.value || item.tags.includes(activeTag.value)
    return catMatch && tagMatch
  })
})

function addCloth(item) {
  if (!selectedClothes.value.find(i => i.name === item.name)) {
    selectedClothes.value.push(item)
  }
}

function removeCloth(idx) {
  selectedClothes.value.splice(idx, 1)
}

function resetClothes() {
  selectedClothes.value = []
}

function toggleCloth(item) {
  const index = selectedClothes.value.findIndex(i => i.name === item.name)
  if (index === -1) {
    // 如果未选中，则添加
    selectedClothes.value.push(item)
  } else {
    // 如果已选中，则移除
    selectedClothes.value.splice(index, 1)
  }
}

// 滚动到创建搭配区域
function scrollToCreateSection() {
  const element = document.getElementById('create-section')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 加载已保存的搭配
function loadSavedOutfits() {
  const outfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]')
  savedOutfits.value = outfits
}

// 保存穿搭方案
function saveOutfit() {
  if (selectedClothes.value.length === 0) {
    alert('请至少选择一件衣物')
    return
  }

  // 获取搭配名称
  const outfitName = prompt('请为您的搭配方案命名:', `搭配方案 ${new Date().toLocaleDateString()}`)
  if (!outfitName) return // 用户取消了输入

  // 获取适用场景
  const sceneOptions = scenesMockData.join(', ')
  const outfitScene = prompt(`请输入适用场景(如: ${sceneOptions}):`, '')

  // 创建一个新的穿搭方案
  const newOutfit = {
    id: Date.now(), // 使用时间戳作为ID
    name: outfitName,
    scene: outfitScene || undefined,
    items: [...selectedClothes.value],
    createdAt: new Date()
  }

  // 保存到本地存储
  const outfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]')
  outfits.push(newOutfit)
  localStorage.setItem('savedOutfits', JSON.stringify(outfits))
  
  // 更新已保存搭配列表
  loadSavedOutfits()

  // 显示成功消息
  alert('穿搭方案已保存！')

  // 重置当前搭配
  resetClothes()
}

// 加载搭配方案
function loadOutfit(outfit) {
  selectedClothes.value = Array.isArray(outfit.items) ? [...outfit.items] : []
  // 滚动到搭配预览区域
  nextTick(() => {
    const element = document.getElementById('create-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

// 删除搭配方案
function deleteOutfit(index) {
  if (confirm('确定要删除这个搭配方案吗？')) {
    const outfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]')
    outfits.splice(index, 1)
    localStorage.setItem('savedOutfits', JSON.stringify(outfits))
    
    // 更新已保存搭配列表
    loadSavedOutfits()
  }
}

// 格式化日期
function formatDate(date) {
  const d = new Date(date)
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`
}

// 获取搭配衣物类型统计
function getOutfitStats(items) {
  const stats = {}
  items.forEach(item => {
    // 提取类型（如"上衣"、"裤子"等）
    const type = item.type.split(' · ')[0]
    if (stats[type]) {
      stats[type]++
    } else {
      stats[type] = 1
    }
  })
  return stats
}

// 获取搭配标签
function getOutfitTags(items) {
  const tags = new Set()
  items.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags)
}

// 获取搭配评分（模拟）
function getOutfitRating(outfit) {
  // 基于衣物数量和搭配多样性计算评分
  if (!outfit.items || outfit.items.length === 0) return 0
  
  // 基础分 5 分
  let baseScore = 5
  
  // 衣物数量加分 (最多 3 分)
  const quantityBonus = Math.min(Math.floor(outfit.items.length / 2), 3)
  
  // 搭配多样性加分 (最多 2 分)
  const types = new Set(outfit.items.map(item => item.type.split(' · ')[0]))
  const diversityBonus = Math.min(types.size - 1, 2)
  
  return baseScore + quantityBonus + diversityBonus
}

// 获取随机点赞数（模拟）
function getRandomLikes() {
  return Math.floor(Math.random() * 100) + 1
}

// 获取随机评论数（模拟）
function getRandomComments() {
  return Math.floor(Math.random() * 20) + 1
}

// 分享搭配方案
function shareOutfit(outfit) {
  alert('分享功能已触发：' + outfit.name)
  // 实际实现时可以调用系统分享API或生成分享链接
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 自定义滚动条样式 */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

/* 悬停动画增强 */
.group:hover .text-primary {
  color: theme('colors.primary', #3b82f6);
}

/* 卡片悬停效果增强 */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
}
</style>
