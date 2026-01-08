<template>
  <div class="3d-preview-page">
    <header class="page-header">
      <h1>3D搭配预览</h1>
      <div class="header-actions">
        <button @click="goBack" class="btn btn-primary">返回</button>
        <button @click="savePreview" class="btn btn-secondary">保存预览</button>
        <button @click="exportImage" class="btn btn-secondary">导出图片</button>
      </div>
    </header>
    
    <main class="page-content">
      <div class="preview-section">
        <ThreePreview 
          :bodyModelPath="bodyModelPath"
          :outfitId="outfitId"
        />
      </div>
      
      <div class="outfit-info">
        <h2>搭配信息</h2>
        <div v-if="outfit" class="outfit-details">
          <div class="detail-item">
            <label>搭配名称：</label>
            <span>{{ outfit.title }}</span>
          </div>
          <div class="detail-item">
            <label>创建时间：</label>
            <span>{{ formatDate(outfit.createdAt) }}</span>
          </div>
          <div class="detail-item">
            <label>元素数量：</label>
            <span>{{ outfit.items.length }}</span>
          </div>
        </div>
        
        <h3>搭配元素</h3>
        <div class="clothing-list">
          <div 
            v-for="item in outfit?.items" 
            :key="item.id"
            class="clothing-item"
          >
            <div class="clothing-details">
              <img 
                :src="item.imageUrl" 
                :alt="item.name"
                class="clothing-image"
              >
              <div class="clothing-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.category }}</p>
              </div>
              <button @click="focusOnClothing(item.id)" class="btn btn-sm">聚焦</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ThreePreview from '../components/ThreePreview.vue';
import { useOutfitStore } from '../stores/modules/outfitStore';
import { useClothingStore } from '../stores/modules/clothingStore';

export default {
  name: 'ThreePreviewPage',
  components: {
    ThreePreview
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const outfitStore = useOutfitStore();
    const clothingStore = useClothingStore();
    
    const outfitId = ref(route.params.id || '');
    const bodyModelPath = ref('/models/body.glb'); // 默认身体模型路径
    
    const outfit = computed(() => {
      return outfitStore.getOutfitById(outfitId.value);
    });
    

    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString();
    };
    
    const goBack = () => {
      router.back();
    };
    
    const savePreview = () => {
      // 保存预览状态
      console.log('Saving preview...');
      // 实际项目中可以保存当前的相机位置、光照设置等
    };
    
    const exportImage = () => {
      // 导出预览图片
      console.log('Exporting image...');
      // 实际项目中可以使用Three.js的toDataURL方法
    };
    
    const focusOnClothing = (itemId) => {
      // 聚焦到指定服装
      console.log(`Focusing on clothing: ${itemId}`);
      // 实际项目中需要与ThreePreview组件通信
    };
    
    onMounted(() => {
      if (!outfitId.value) {
        // 如果没有指定搭配ID，显示默认搭配
        const outfits = outfitStore.outfits;
        if (outfits.length > 0) {
          outfitId.value = outfits[0].id;
        }
      }
    });
    
    return {
      outfitId,
      bodyModelPath,
      outfit,
      formatDate,
      goBack,
      savePreview,
      exportImage,
      focusOnClothing
    };
  }
};
</script>

<style scoped>
.3d-preview-page {
  width: 100%;
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  background: white;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.page-content {
  display: flex;
  height: calc(100vh - 80px);
}

.preview-section {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.outfit-info {
  width: 300px;
  background: white;
  padding: 20px;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.outfit-info h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
}

.outfit-info h3 {
  margin-top: 30px;
  margin-bottom: 15px;
  font-size: 16px;
  color: #555;
}

.outfit-details {
  margin-bottom: 20px;
}

.detail-item {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.detail-item label {
  font-weight: 500;
  color: #666;
}

.detail-item span {
  color: #333;
}

.clothing-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.clothing-item {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.clothing-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.clothing-info {
  flex: 1;
}

.clothing-info h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #333;
}

.clothing-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

@media (max-width: 768px) {
  .page-content {
    flex-direction: column;
  }
  
  .outfit-info {
    width: 100%;
    height: 300px;
  }
}
</style>