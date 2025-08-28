#!/usr/bin/env node

/**
 * 搭配灵感页面修复验证脚本
 * 验证并修复测试中发现的问题
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 开始搭配灵感页面问题修复...\n');

// 修复1: 增强InspirationSection.vue的样式和交互
function enhanceInspirationSection() {
  console.log('📁 增强InspirationSection.vue...');

  const filePath = path.join(__dirname, 'src/components/inspiration/InspirationSection.vue');

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 添加样式部分（如果不存在）
    if (!content.includes('<style') && !content.includes('scoped')) {
      const styleAddition = `

<style scoped>
.inspiration-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .inspiration-container {
    padding: 1rem;
  }
}
</style>`;

      content += styleAddition;
      fs.writeFileSync(filePath, content);
      console.log('✅ 已添加样式部分');
    }

    // 添加条件渲染优化
    if (!content.includes('v-if') && !content.includes('v-show')) {
      const conditionalRender = `
    <div v-if="loading" class="loading-spinner">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
    
    <div v-else-if="clothes.length === 0" class="empty-state">
      <p>暂无搭配灵感，快去添加一些衣物吧！</p>
    </div>`;

      // 这里需要更精确的替换，暂时跳过
      console.log('⚠️  需要手动添加条件渲染');
    }
  } catch (error) {
    console.log('❌ 无法读取InspirationSection.vue:', error.message);
  }
}

// 修复2: 增强OutfitCard.vue的响应式设计
function enhanceOutfitCard() {
  console.log('📁 增强OutfitCard.vue响应式设计...');

  const filePath = path.join(__dirname, 'src/components/inspiration/OutfitCard.vue');

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 添加响应式样式增强
    if (content.includes('responsive')) {
      const responsiveEnhance = `
@media (max-width: 640px) {
  .outfit-card {
    @apply rounded-lg;
  }
  
  .outfit-info {
    @apply p-3;
  }
  
  .outfit-actions {
    @apply flex-col space-y-2;
  }
}

@media (max-width: 768px) {
  .clothing-preview {
    @apply grid-cols-2;
  }
}

@media (min-width: 1024px) {
  .outfit-card {
    @apply hover:scale-105;
  }
}`;

      if (content.includes('<style') && !content.includes('@media')) {
        content = content.replace(/<\/style>/i, `${responsiveEnhance}\n</style>`);
        fs.writeFileSync(filePath, content);
        console.log('✅ 已增强响应式样式');
      }
    }
  } catch (error) {
    console.log('❌ 无法读取OutfitCard.vue:', error.message);
  }
}

// 修复3: 优化SavedOutfits.vue的懒加载
function enhanceSavedOutfits() {
  console.log('📁 优化SavedOutfits.vue性能...');

  const filePath = path.join(__dirname, 'src/components/inspiration/SavedOutfits.vue');

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 添加懒加载属性
    if (content.includes('<img') && !content.includes('loading=')) {
      content = content.replace(/(<img[^>]*src="[^"]*")/g, '$1 loading="lazy"');
      fs.writeFileSync(filePath, content);
      console.log('✅ 已添加图片懒加载');
    }
  } catch (error) {
    console.log('❌ 无法读取SavedOutfits.vue:', error.message);
  }
}

// 修复4: 验证Mock数据
function validateMockData() {
  console.log('📊 验证Mock数据...');

  const wardrobePath = path.join(__dirname, 'src/mock/wardrobe.js');
  const dataPath = path.join(__dirname, 'src/mock/data.js');

  try {
    // 读取文件内容验证
    const wardrobeContent = fs.readFileSync(wardrobePath, 'utf8');
    const dataContent = fs.readFileSync(dataPath, 'utf8');

    // 验证getClothesWithTags函数
    const hasGetClothesWithTags = wardrobeContent.includes('getClothesWithTags');
    console.log(`✅ wardrobe.js包含getClothesWithTags: ${hasGetClothesWithTags}`);

    // 验证mock数据
    const hasScenes = dataContent.includes('scenesMockData');
    const hasSeasons = dataContent.includes('seasonsMockData');
    const hasStyles = dataContent.includes('stylesMockData');

    console.log(`✅ 数据验证: scenes=${hasScenes}, seasons=${hasSeasons}, styles=${hasStyles}`);
  } catch (error) {
    console.log('❌ 数据验证失败:', error.message);
  }
}

// 修复5: 创建性能优化配置
function createPerformanceConfig() {
  console.log('🚀 创建性能优化配置...');

  const config = {
    imageOptimization: {
      lazyLoading: true,
      webpFormat: true,
      responsiveImages: true,
    },
    componentOptimization: {
      vShow: true,
      vIf: true,
      computed: true,
      watch: true,
    },
    responsiveDesign: {
      mobileFirst: true,
      breakpoints: ['sm', 'md', 'lg', 'xl'],
      fluidTypography: true,
    },
  };

  fs.writeFileSync(
    path.join(__dirname, 'inspiration-optimization-config.json'),
    JSON.stringify(config, null, 2)
  );

  console.log('✅ 已创建优化配置文件');
}

// 运行所有修复
function runAllFixes() {
  console.log('🛠️ 开始执行修复...\n');

  enhanceInspirationSection();
  enhanceOutfitCard();
  enhanceSavedOutfits();
  validateMockData();
  createPerformanceConfig();

  console.log('\n✅ 修复完成！');
  console.log('请查看生成的配置文件和更新后的组件');
}

// 执行修复
runAllFixes();
