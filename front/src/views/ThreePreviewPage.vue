<template>
  <div class="three-preview-page">
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

export default {
  name: 'ThreePreviewPage',
  components: {
    ThreePreview
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const outfitStore = useOutfitStore();
    
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
.three-preview-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
}

.page-header {
  background: white;
  padding: 20px 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  border-radius: 0 0 16px 16px;
  margin-bottom: 2px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #1f2937;
  font-weight: 600;
  line-height: 1.3;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  user-select: none;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: #3b82f6;
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  background: #2563eb;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
}

.btn-primary:active {
  background: #1d4ed8;
}

.btn-secondary {
  background: #6b7280;
  color: white;
  box-shadow: 0 2px 4px rgba(107, 114, 128, 0.3);
}

.btn-secondary:hover {
  background: #4b5563;
  box-shadow: 0 4px 8px rgba(107, 114, 128, 0.4);
}

.btn-secondary:active {
  background: #374151;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 6px;
}

.btn-sm:hover {
  transform: translateY(-1px);
}

.btn-sm:active {
  transform: translateY(0);
}

.page-content {
  display: flex;
  height: calc(100vh - 140px);
  gap: 0;
  margin: 0;
}

.preview-section {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-right: 1px solid #e5e7eb;
  border-radius: 12px 0 0 12px;
  margin: 20px 0 20px 20px;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.03);
}

.outfit-info {
  width: 350px;
  background: white;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
  border-left: 1px solid #e5e7eb;
  border-radius: 0 12px 12px 0;
  margin: 20px 20px 20px 0;
  position: relative;
  z-index: 1;
}

.outfit-info h2 {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 20px;
  color: #1f2937;
  font-weight: 600;
  position: relative;
  padding-bottom: 12px;
}

.outfit-info h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #ec4899);
  border-radius: 3px;
}

.outfit-info h3 {
  margin-top: 36px;
  margin-bottom: 18px;
  font-size: 16px;
  color: #4b5563;
  font-weight: 500;
}

.outfit-details {
  margin-bottom: 24px;
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.detail-item {
  margin-bottom: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item label {
  font-weight: 500;
  color: #6b7280;
  font-size: 14px;
}

.detail-item span {
  color: #1f2937;
  font-size: 14px;
  font-weight: 400;
}

.clothing-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.clothing-item {
  background: #f9fafb;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.clothing-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.6s ease;
}

.clothing-item:hover::before {
  left: 100%;
}

.clothing-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: #d1d5db;
}

.clothing-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.clothing-item:hover .clothing-image {
  border-color: #3b82f6;
  transform: scale(1.02);
}

.clothing-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.clothing-info h4 {
  margin: 0 0 6px 0;
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.clothing-item:hover .clothing-info h4 {
  color: #3b82f6;
}

.clothing-info p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.clothing-item:hover .clothing-info p {
  color: #4b5563;
}

@media (max-width: 1024px) {
  .outfit-info {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 16px 20px;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
    border-radius: 0 0 12px 12px;
    margin-bottom: 1px;
  }

  .header-actions {
    justify-content: center;
    gap: 8px;
  }

  .page-content {
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 180px);
    margin: 0;
  }
  
  .preview-section {
    height: 50vh;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 12px 12px 0 0;
    margin: 10px 10px 0 10px;
  }
  
  .outfit-info {
    width: 100%;
    height: 50vh;
    border-left: none;
    border-top: 1px solid #e5e7eb;
    border-radius: 0 0 12px 12px;
    margin: 0 10px 10px 10px;
  }
}

@media (max-width: 480px) {
  .btn {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .outfit-info {
    padding: 16px;
  }
  
  .clothing-item {
    padding: 12px;
    gap: 10px;
  }
  
  .clothing-image {
    width: 60px;
    height: 60px;
  }
  
  .preview-section {
    height: 45vh;
    margin: 8px;
    border-radius: 8px 8px 0 0;
  }
  
  .outfit-info {
    height: 45vh;
    margin: 0 8px 8px 8px;
    border-radius: 0 0 8px 8px;
  }
}
</style>