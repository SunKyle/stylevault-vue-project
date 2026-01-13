<template>
    <main class="page-content">
      <div class="preview-section">
        <ThreePreview :bodyModelPath="bodyModelPath" :outfitId="outfitId" class="three-preview" ref="threePreviewRef" />
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
      </div>

      <!-- 搭配信息 -->
      <aside class="outfit-info" :class="{ open: isInfoPanelOpen }">
        <div class="outfit-info-header">
          <h2 class="outfit-info-title">搭配信息</h2>
          <button @click="toggleInfoPanel" class="btn btn-sm btn-toggle">
            <span class="btn-icon">{{ isInfoPanelOpen ? '‹' : '›' }}</span>
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
                  <span class="btn-icon"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      <!-- 移动端信息面板切换按钮 -->
      <button v-if="isMobile" @click="toggleInfoPanel" class="btn btn-primary btn-mobile-toggle">
        <span class="btn-text">搭配信息</span>
      </button>
    </main>
</template>

<script>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
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
      const threePreviewRef = ref(null);

      const outfitId = ref(route.params.id || '');
      const bodyModelPath = ref('/models/body.glb'); // 默认身体模型路径
      const isInfoPanelOpen = ref(true);
      const isMobile = ref(window.innerWidth <= 768);

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
        if (threePreviewRef.value) {
          threePreviewRef.value.saveState();
        }
      };

      const exportImage = () => {
        // 导出预览图片
        console.log('Exporting image...');
        // 实际项目中可以使用Three.js的toDataURL方法
        if (threePreviewRef.value) {
          threePreviewRef.value.exportImage();
        }
      };

      const focusOnClothing = itemId => {
        // 聚焦到指定服装
        console.log(`Focusing on clothing: ${itemId}`);
        // 实际项目中需要与ThreePreview组件通信
        if (threePreviewRef.value) {
          threePreviewRef.value.focusOnClothing(itemId);
        }
      };

      const toggleInfoPanel = () => {
        isInfoPanelOpen.value = !isInfoPanelOpen.value;
      };

      const handleResize = () => {
        isMobile.value = window.innerWidth <= 768;
        if (!isMobile.value) {
          isInfoPanelOpen.value = true;
        }
      };

      onMounted(() => {
        if (!outfitId.value) {
          // 如果没有指定搭配ID，显示默认搭配
          const outfits = outfitStore.outfits;
          if (outfits.length > 0) {
            outfitId.value = outfits[0].id;
          }
        }
        window.addEventListener('resize', handleResize);
      });

      onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
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
        isInfoPanelOpen,
        isMobile,
        toggleInfoPanel,
        threePreviewRef,
      };
    },
  };
</script>

<style scoped>
  /* 根元素样式 */
  :root {
    --primary-color: #3b82f6;
    --primary-hover: #2563eb;
    --secondary-color: #6b7280;
    --secondary-hover: #4b5563;
    --accent-color: #ec4899;
    --accent-hover: #db2777;
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --bg-tertiary: #f1f5f9;
    --border-color: #e2e8f0;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.15);
    --border-radius-sm: 8px;
    --border-radius-md: 12px;
    --border-radius-lg: 16px;
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
  }

  /* 页面容器 */
  .page-content {
    display: grid;
    grid-template-columns: 1fr 380px;
    height: 100vh;
    margin: 0;
    padding: 24px;
    gap: 24px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    overflow: hidden;
  }

  /* 预览区域 */
  .preview-section {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
  }

  .three-preview {
    width: 100%;
    height: 100%;
  }

  /* 控制按钮组 */
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
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-lg);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all var(--transition-normal);
  }

  /* 按钮基础样式 */
  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    transition: all var(--transition-normal) cubic-bezier(0.4, 0, 0.2, 1);
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
    transition: left var(--transition-slow);
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
    box-shadow: var(--shadow-md);
  }

  .btn:active {
    transform: translateY(0);
  }

  /* 按钮变体 */
  .btn-primary {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
    color: white;
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, var(--primary-hover) 0%, #1d4ed8 100%);
    box-shadow: 0 8px 28px rgba(59, 130, 246, 0.45);
  }

  .btn-secondary {
    background: linear-gradient(135deg, var(--secondary-color) 0%, var(--secondary-hover) 100%);
    color: white;
    box-shadow: 0 6px 20px rgba(107, 114, 128, 0.35);
  }

  .btn-secondary:hover {
    background: linear-gradient(135deg, var(--secondary-hover) 0%, #374151 100%);
    box-shadow: 0 8px 28px rgba(107, 114, 128, 0.45);
  }

  .btn-sm {
    padding: 8px 16px;
    font-size: 13px;
    border-radius: var(--border-radius-sm);
    min-width: auto;
  }

  .btn-sm:hover {
    transform: translateY(-1px);
  }

  .btn-focus {
    background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-hover) 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
  }

  .btn-focus:hover {
    background: linear-gradient(135deg, var(--accent-hover) 0%, #be185d 100%);
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
  }

  .btn-toggle {
    background: transparent;
    color: var(--text-secondary);
    box-shadow: none;
    min-width: auto;
    padding: 8px;
  }

  .btn-toggle:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    box-shadow: none;
  }

  /* 搭配信息面板 */
  .outfit-info {
    width: 380px;
    height: 100%;
    background: var(--bg-primary);
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    border-radius: var(--border-radius-md);
    transition: all var(--transition-normal);
  }

  .outfit-info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-primary);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .outfit-info-title {
    margin: 0;
    font-size: 20px;
    color: var(--text-primary);
    font-weight: 600;
  }

  .outfit-info-content {
    padding: 20px;
    flex: 1;
  }

  .info-card {
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
  }

  .info-card:last-child {
    border-bottom: none;
  }

  .outfit-details {
    margin-bottom: 0;
    background: var(--bg-secondary);
    padding: 16px;
    border-radius: var(--border-radius-sm);
    border: 1px solid var(--border-color);
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
    color: var(--text-secondary);
    font-size: 13px;
  }

  .detail-value {
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 500;
  }

  /* 服装列表 */
  .clothing-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .clothing-item {
    background: var(--bg-secondary);
    padding: 16px;
    border-radius: var(--border-radius-sm);
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid var(--border-color);
    transition: all var(--transition-fast);
    cursor: pointer;
  }

  .clothing-item:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
    border-color: #cbd5e1;
  }

  .clothing-image {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: var(--border-radius-sm);
    border: 2px solid var(--border-color);
    transition: all var(--transition-fast);
  }

  .clothing-item:hover .clothing-image {
    border-color: var(--primary-color);
  }

  .clothing-info {
    flex: 1;
  }

  .clothing-name {
    margin: 0 0 4px 0;
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 500;
    line-height: 1.3;
  }

  .clothing-category {
    margin: 0;
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.3;
  }

  /* 移动端切换按钮 */
  .btn-mobile-toggle {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 100;
    box-shadow: var(--shadow-lg);
  }

  /* 响应式设计 */
  /* 大屏幕 */
  @media (max-width: 1200px) {
    .outfit-info {
      width: 320px;
    }
  }

  /* 中等屏幕 */
  @media (max-width: 1024px) {
    .page-content {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr auto;
      gap: 16px;
      padding: 16px;
    }
    
    .outfit-info {
      width: 100%;
      height: 300px;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    }
  }

  /* 小屏幕 */
  @media (max-width: 768px) {
    .page-content {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
      padding: 0;
      gap: 0;
    }
    
    .preview-section {
      border-radius: 0;
    }
    
    .preview-controls {
      bottom: 20px;
      gap: 12px;
      padding: 12px 20px;
    }
    
    .btn {
      padding: 10px 20px;
      font-size: 14px;
      min-width: 80px;
    }
    
    .outfit-info {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 320px;
      z-index: 100;
      transform: translateX(100%);
      box-shadow: -8px 0 32px rgba(0, 0, 0, 0.2);
      border-radius: 0;
    }
    
    .outfit-info.open {
      transform: translateX(0);
    }
    
    .outfit-info-content {
      padding: 16px;
    }
  }

  /* 超小屏幕 */
  @media (max-width: 480px) {
    .preview-controls {
      flex-wrap: wrap;
      gap: 10px;
      padding: 12px;
    }
    
    .btn {
      padding: 10px 16px;
      font-size: 13px;
      min-width: 70px;
    }
    
    .outfit-info {
      width: 100%;
    }
  }
</style>
