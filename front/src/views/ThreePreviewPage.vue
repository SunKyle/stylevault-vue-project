<template>
  <div class="three-preview-page">
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">3D搭配预览</h1>
        <div class="header-actions">
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
    </header>

    <main class="page-content">
      <div class="preview-section">
        <ThreePreview :bodyModelPath="bodyModelPath" :outfitId="outfitId" class="three-preview" />
      </div>

      <aside class="outfit-info">
        <div class="info-card">
          <h2 class="card-title">搭配信息</h2>
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
          <h3 class="card-title">搭配元素</h3>
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
      </aside>
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
      ThreePreview,
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
        focusOnClothing,
      };
    },
  };
</script>

<style scoped>
  .three-preview-page {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  .page-header {
    background: white;
    padding: 20px 32px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 0 12px 12px;
    margin-bottom: 20px;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .page-title {
    margin: 0;
    font-size: 26px;
    color: #0f172a;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.02em;
  }

  .header-actions {
    display: flex;
    gap: 16px;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-icon {
    font-size: 16px;
  }

  .btn-text {
    font-weight: 500;
  }

  .btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .btn:active {
    transform: translateY(0);
  }

  .btn-primary {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }

  .btn-primary:active {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  }

  .btn-secondary {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3);
  }

  .btn-secondary:hover {
    background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
    box-shadow: 0 6px 20px rgba(107, 114, 128, 0.4);
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
    height: calc(100vh - 160px);
    gap: 0;
    margin: 0;
  }

  .preview-section {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border-right: 1px solid #e2e8f0;
    border-radius: 16px 0 0 16px;
    margin: 24px 0 24px 24px;
    box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.04);
  }

  .preview-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .three-preview {
    width: 100%;
    height: 100%;
  }

  .outfit-info {
    width: 350px;
    background: white;
    padding: 0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    overflow-y: auto;
    border-left: 1px solid #e2e8f0;
    border-radius: 0 12px 12px 0;
    margin: 0 24px 24px 0;
    position: relative;
    z-index: 1;
  }

  .info-card {
    padding: 20px;
    border-bottom: 1px solid #f1f5f9;
  }

  .info-card:last-child {
    border-bottom: none;
  }

  .card-title {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    color: #0f172a;
    font-weight: 600;
    position: relative;
    padding-bottom: 12px;
  }

  .card-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: #3b82f6;
    border-radius: 2px;
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

  @media (max-width: 1200px) {
    .outfit-info {
      width: 350px;
    }
  }

  @media (max-width: 1024px) {
    .outfit-info {
      width: 320px;
    }

    .page-header {
      padding: 20px 28px;
    }

    .page-title {
      font-size: 24px;
    }
  }

  @media (max-width: 768px) {
    .page-header {
      padding: 16px 20px;
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
      border-radius: 0 0 12px 12px;
      margin-bottom: 16px;
    }

    .header-content {
      flex-direction: column;
      gap: 12px;
    }

    .header-actions {
      justify-content: center;
      gap: 10px;
    }

    .page-content {
      flex-direction: column;
      height: auto;
      min-height: calc(100vh - 160px);
      margin: 0;
    }

    .preview-section {
      height: 50vh;
      border-right: none;
      border-bottom: 1px solid #e2e8f0;
      border-radius: 12px 12px 0 0;
      margin: 0 16px 0 16px;
    }

    .outfit-info {
      width: 100%;
      height: 45vh;
      border-left: none;
      border-top: 1px solid #e2e8f0;
      border-radius: 0 0 12px 12px;
      margin: 0 16px 16px 16px;
    }

    .info-card {
      padding: 16px;
    }

    .card-title {
      font-size: 16px;
      margin-bottom: 16px;
    }

    .outfit-details {
      padding: 12px;
    }
  }

  @media (max-width: 480px) {
    .page-header {
      padding: 16px 20px;
    }

    .page-title {
      font-size: 22px;
    }

    .btn {
      padding: 10px 20px;
      font-size: 13px;
    }

    .info-card {
      padding: 20px;
    }

    .clothing-item {
      padding: 16px;
      gap: 12px;
    }

    .clothing-image {
      width: 65px;
      height: 65px;
    }

    .preview-section {
      height: 50vh;
      margin: 12px;
      border-radius: 12px 12px 0 0;
    }

    .outfit-info {
      height: 45vh;
      margin: 0 12px 12px 12px;
      border-radius: 0 0 12px 12px;
    }

    .card-title {
      font-size: 18px;
    }
  }

  @media (max-width: 360px) {
    .header-actions {
      flex-wrap: wrap;
    }

    .btn {
      flex: 1;
      min-width: 100px;
    }

    .clothing-item {
      padding: 14px;
    }

    .clothing-image {
      width: 55px;
      height: 55px;
    }
  }
</style>
