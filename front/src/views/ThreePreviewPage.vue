<template>
    <main class="page-content">
      <div class="preview-section">
        <ThreePreview :bodyModelPath="bodyModelPath" :outfitId="outfitId" class="three-preview" />
        <div class="preview-controls">
          <button @click="goBack" class="btn btn-primary">
            <span class="btn-text">返回</span>
          </button>
          <button @click="savePreview" class="btn btn-secondary">
            <span class="btn-text">保存</span>
          </button>
          <button @click="exportImage" class="btn btn-secondary">
            <span class="btn-text">导出</span>
          </button>
        </div>
        
        <!-- 搭配信息 -->
        <aside class="outfit-info" :class="{ collapsed: !isSidebarOpen }">
          <div class="outfit-info-header">
            <h2 class="outfit-info-title">搭配信息</h2>
            <button @click="toggleSidebar" class="btn btn-sm btn-toggle-sidebar">
              <span class="btn-icon">{{ isSidebarOpen ? '▶' : '◀' }}</span>
            </button>
          </div>
          <div class="outfit-info-content">
            <div class="info-card">
              <div v-if="outfit" class="outfit-details">
                <div class="detail-item">
                  <label class="detail-label">名称：</label>
                  <span class="detail-value">{{ outfit.title }}</span>
                </div>
                <div class="detail-item">
                  <label class="detail-label">创建时间：</label>
                  <span class="detail-value">{{ formatDate(outfit.createdAt) }}</span>
                </div>
                <div class="detail-item">
                  <label class="detail-label">元素数量：</label>
                  <span class="detail-value">{{ outfit.items.length }}</span>
                </div>
              </div>
            </div>

            <div class="info-card">
              <h3 class="card-subtitle">搭配元素</h3>
              <div class="clothing-list">
                <div v-for="item in outfit?.items" :key="item.id" class="clothing-item">
                  <img :src="item.imageUrl" :alt="item.name" class="clothing-image" />
                  <div class="clothing-info">
                    <h4 class="clothing-name">{{ item.name }}</h4>
                    <p class="clothing-category">{{ item.category }}</p>
                  </div>
                  <button @click="focusOnClothing(item.id)" class="btn btn-sm btn-focus">
                    <span class="btn-icon">🔍</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
</template>

<script>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import ThreePreview from '../components/ThreePreview.vue';
  import { useOutfitStore } from '../stores/modules/outfitStore';

  export default {
    name: 'ThreePreviewPage',
    components: {
      ThreePreview,
    },
    setup() {
      const route = useRoute();
      const router = useRouter();
      const outfitStore = useOutfitStore();

      const outfitId = ref(route.params.id || '');
      const bodyModelPath = ref('/models/body.glb'); // 默认身体模型路径
      const isSidebarOpen = ref(true);
      
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
      };

      const outfit = computed(() => {
        return outfitStore.getOutfitById(outfitId.value);
      });

      const formatDate = dateString => {
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

      const focusOnClothing = itemId => {
        // 聚焦到指定服装
        console.log(`Focusing on clothing: ${itemId}`);
        // 实际项目中可以通过ref或事件与ThreePreview组件通信
        // 例如：threePreviewRef.value.focusOnItem(itemId);
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
        focusOnClothing,
        isSidebarOpen,
        toggleSidebar,
      };
    },
  };
</script>

<style scoped>


  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 100px;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  .btn:hover::before {
    left: 100%;
  }

  .btn-icon {
    font-size: 17px;
    position: relative;
    z-index: 1;
  }

  .btn-text {
    font-weight: 600;
    position: relative;
    z-index: 1;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  }

  .btn:active {
    transform: translateY(0);
  }

  .btn-primary {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 0 8px 28px rgba(59, 130, 246, 0.45);
  }

  .btn-primary:active {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  }

  .btn-secondary {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    color: white;
    box-shadow: 0 6px 20px rgba(107, 114, 128, 0.35);
  }

  .btn-secondary:hover {
    background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
    box-shadow: 0 8px 28px rgba(107, 114, 128, 0.45);
  }

  .btn-secondary:active {
    background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  }

  .btn-sm {
    padding: 8px 16px;
    font-size: 13px;
    border-radius: 8px;
  }

  .btn-sm:hover {
    transform: translateY(-1px);
  }

  .btn-sm:active {
    transform: translateY(0);
  }

  .btn-focus {
    background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
  }

  .btn-focus:hover {
    background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
  }

  .page-content {
    display: flex;
    height: calc(100vh - 120px);
    gap: 0;
    margin: 24px;
    margin-bottom: 120px;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .preview-section {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  }

  .preview-controls {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    display: flex;
    gap: 16px;
    padding: 16px 24px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
  }



  .three-preview {
    width: 100%;
    height: 100%;
  }

  /* 搭配信息固定右侧样式 */
  .outfit-info {
    position: absolute;
    top: 0;
    right: 0;
    width: 380px;
    height: 100%;
    background: white;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    z-index: 50;
    transition: transform 0.3s ease;
    transform: translateX(0);
  }
  
  .outfit-info.collapsed {
    transform: translateX(100%);
  }
  
  .btn-toggle-sidebar {
    background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    color: white;
    padding: 6px 10px;
    font-size: 16px;
    box-shadow: none;
  }
  
  .btn-toggle-sidebar:hover {
    background: linear-gradient(135deg, #64748b 0%, #475569 100%);
    transform: none;
    box-shadow: none;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .outfit-info {
      width: 320px;
    }
    
    .preview-controls {
      gap: 12px;
      padding: 12px 18px;
      bottom: 20px;
    }
    
    .btn {
      padding: 10px 20px;
      font-size: 14px;
      min-width: 80px;
    }
  }
  
  @media (max-width: 480px) {
    .outfit-info {
      width: 280px;
    }
    
    .preview-controls {
      gap: 8px;
      padding: 10px 14px;
    }
    
    .btn {
      padding: 8px 16px;
      font-size: 13px;
      min-width: 70px;
    }
  }

  .outfit-info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #f1f5f9;
    background: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .outfit-info-title {
    margin: 0;
    font-size: 20px;
    color: #0f172a;
    font-weight: 600;
  }

  .outfit-info-content {
    padding: 20px;
    flex: 1;
  }

  .info-card {
    padding: 20px;
    border-bottom: 1px solid #f1f5f9;
  }

  .info-card:last-child {
    border-bottom: none;
  }



  .outfit-details {
    margin-bottom: 0;
    background: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .detail-item {
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detail-item:last-child {
    margin-bottom: 0;
  }

  .detail-label {
    font-weight: 500;
    color: #64748b;
    font-size: 13px;
  }

  .detail-value {
    color: #0f172a;
    font-size: 14px;
    font-weight: 500;
  }

  .clothing-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .clothing-item {
    background: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .clothing-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: #cbd5e1;
  }

  .clothing-image {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 8px;
    border: 2px solid #e2e8f0;
    transition: all 0.2s ease;
  }

  .clothing-item:hover .clothing-image {
    border-color: #3b82f6;
  }

  .clothing-info {
    flex: 1;
  }

  .clothing-name {
    margin: 0 0 4px 0;
    font-size: 14px;
    color: #0f172a;
    font-weight: 500;
    line-height: 1.3;
  }

  .clothing-category {
    margin: 0;
    font-size: 12px;
    color: #64748b;
    line-height: 1.3;
  }


</style>
