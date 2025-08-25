<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="close">
    <div class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">
      <div class="p-6 border-b border-neutral-100 flex justify-between items-center">
        <h3 class="text-xl font-bold">添加新衣物</h3>
        <button @click="close" class="text-neutral-500 hover:text-neutral-800 transition-colors">
          <font-awesome-icon :icon="['fas', 'times']" class="text-xl" />
        </button>
      </div>
      <div class="p-6">
        <div class="border-2 border-dashed border-neutral-200 rounded-2xl p-6 text-center mb-6 hover:border-primary/50 transition-colors">
          <div class="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" class="text-2xl text-neutral-400" />
          </div>
          <p class="font-medium mb-2">上传衣物照片</p>
          <p class="text-sm text-neutral-500 mb-4">支持JPG、PNG格式，不超过5MB</p>
          <button class="bg-primary/10 text-primary font-medium py-2.5 px-6 rounded-xl hover:bg-primary/20 transition-colors">
            选择照片
          </button>
        </div>
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1.5">衣物名称</label>
            <input type="text" placeholder="例如：白色T恤" class="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1.5">衣物分类</label>
            <select class="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
              <option value="">请选择分类</option>
              <option value="top">上衣</option>
              <option value="pants">裤子</option>
              <option value="outer">外套</option>
              <option value="dress">裙装</option>
              <option value="shoes">鞋子</option>
              <option value="accessory">配饰</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1.5">风格</label>
            <div class="flex flex-wrap gap-2.5">
              <button v-for="style in ['休闲','正式','运动','复古','潮流']" :key="style" class="bg-neutral-50 text-neutral-800 text-sm px-4 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors">
                {{ style }}
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1.5">季节</label>
            <div class="flex gap-2.5">
              <button v-for="season in ['春季','夏季','秋季','冬季']" :key="season" class="flex-1 bg-neutral-50 text-neutral-800 text-sm py-2.5 rounded-xl hover:bg-primary hover:text-white transition-colors">
                {{ season }}
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1.5">备注（可选）</label>
            <textarea rows="3" placeholder="添加关于这件衣物的备注信息..." class="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"></textarea>
          </div>
        </div>
      </div>
      <div class="p-6 border-t border-neutral-100 flex gap-3">
        <button @click="close" class="flex-1 bg-white border border-neutral-200 text-neutral-700 font-medium py-3 rounded-xl hover:bg-neutral-50 transition-colors">
          取消
        </button>
        <button class="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-colors shadow-soft">
          保存衣物
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
const emit = defineEmits(['close'])
function close() {
  emit('close')
}
</script>
