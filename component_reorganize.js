#!/usr/bin/env node

/**
 * 组件重组脚本
 * 根据COMPONENT_REORGANIZATION_SCRIPT.md执行组件重组
 */

const fs = require('fs');
const path = require('path');

// 项目根目录
const projectRoot = '/Users/sunxiaokai/Desktop/stylevault-vue-project';
const srcComponentsDir = path.join(projectRoot, 'src/components');

/**
 * 移动文件
 * @param {string} sourcePath 源文件路径
 * @param {string} targetPath 目标文件路径
 * @param {boolean} overwrite 是否覆盖目标文件
 */
function moveFile(sourcePath, targetPath, overwrite = false) {
  // 检查源文件是否存在
  if (!fs.existsSync(sourcePath)) {
    console.log(`源文件不存在: ${sourcePath}`);
    return false;
  }

  // 检查目标文件是否存在
  if (fs.existsSync(targetPath)) {
    if (!overwrite) {
      console.log(`目标文件已存在，跳过移动: ${targetPath}`);
      return false;
    }
    console.log(`覆盖目标文件: ${targetPath}`);
  }

  // 创建目标目录
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`创建目录: ${targetDir}`);
  }

  // 移动文件
  fs.renameSync(sourcePath, targetPath);
  console.log(`移动文件: ${sourcePath} -> ${targetPath}`);
  return true;
}

/**
 * 删除目录（如果为空）
 * @param {string} dirPath 目录路径
 */
function removeEmptyDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    if (files.length === 0) {
      fs.rmdirSync(dirPath);
      console.log(`删除空目录: ${dirPath}`);
      return true;
    } else {
      console.log(`目录不为空，不删除: ${dirPath}`);
      return false;
    }
  }
  return false;
}

/**
 * 执行组件重组
 */
function reorganizeComponents() {
  console.log('开始组件重组...');

  // 1. 从 features/analysis/ 移动到 analysis/
  console.log('\n从 features/analysis/ 移动到 analysis/');
  moveFile(
    path.join(srcComponentsDir, 'features/analysis/AnalysisSection.vue'),
    path.join(srcComponentsDir, 'analysis/AnalysisSection.vue'),
    true // 覆盖
  );

  // 2. 从 features/inspiration/ 移动到 inspiration/
  console.log('\n从 features/inspiration/ 移动到 inspiration/');
  const inspirationComponents = [
    'InspirationSection.vue',
    'ClothingSelectionPanel.vue',
    'OutfitCard.vue',
    'OutfitCreator.vue',
    'OutfitPreviewPanel.vue',
    'SavedOutfits.vue'
  ];

  inspirationComponents.forEach(component => {
    moveFile(
      path.join(srcComponentsDir, 'features/inspiration/', component),
      path.join(srcComponentsDir, 'inspiration/', component),
      true // 覆盖
    );
  });

  // 3. 从 features/wardrobe/ 移动到 wardrobe/
  console.log('\n从 features/wardrobe/ 移动到 wardrobe/');
  const wardrobeComponents = [
    'WardrobeSection.vue',
    'CategoryDrawer.vue',
    'ClothingItemEditor.vue',
    'FavoriteSection.vue',
    'FeaturedOutfits.vue',
    'WardrobeHeader.vue'
  ];

  wardrobeComponents.forEach(component => {
    moveFile(
      path.join(srcComponentsDir, 'features/wardrobe/', component),
      path.join(srcComponentsDir, 'wardrobe/', component),
      true // 覆盖
    );
  });

  // 4. 从 features/weather/ 移动到 weather/
  console.log('\n从 features/weather/ 移动到 weather/');
  moveFile(
    path.join(srcComponentsDir, 'features/weather/WeatherSection.vue'),
    path.join(srcComponentsDir, 'weather/WeatherSection.vue'),
    true // 覆盖
  );

  // 5. 从 common/layout/ 移动到 layout/
  console.log('\n从 common/layout/ 移动到 layout/');
  const layoutComponents = [
    'ContentLayout.vue',
    'Footer.vue',
    'Header.vue',
    'PageLayout.vue'
  ];

  layoutComponents.forEach(component => {
    moveFile(
      path.join(srcComponentsDir, 'common/layout/', component),
      path.join(srcComponentsDir, 'layout/', component),
      true // 覆盖
    );
  });

  // 6. 从 common/ui/ 移动到 ui/
  console.log('\n从 common/ui/ 移动到 ui/');
  const uiComponents = [
    'ClothingCategory.vue',
    'ClothingItem.vue',
    'FeatureCard.vue',
    'FloatingActionButton.vue',
    'OutfitCard.vue',
    'SearchBar.vue',
    'StatCard.vue',
    'UploadModal.vue'
  ];

  uiComponents.forEach(component => {
    moveFile(
      path.join(srcComponentsDir, 'common/ui/', component),
      path.join(srcComponentsDir, 'ui/', component),
      true // 覆盖
    );
  });

  // 7. 从 common/ 根目录移动到对应目录
  console.log('\n从 common/ 根目录移动到对应目录');
  const commonRootComponents = [
    { source: 'ClothingCategory.vue', target: 'ui/ClothingCategory.vue' },
    { source: 'ClothingItem.vue', target: 'ui/ClothingItem.vue' },
    { source: 'Footer.vue', target: 'layout/Footer.vue' },
    { source: 'Header.vue', target: 'layout/Header.vue' },
    { source: 'OutfitCard.vue', target: 'ui/OutfitCard.vue' },
    { source: 'UploadModal.vue', target: 'ui/UploadModal.vue' }
  ];

  commonRootComponents.forEach(({ source, target }) => {
    moveFile(
      path.join(srcComponentsDir, 'common/', source),
      path.join(srcComponentsDir, target),
      true // 覆盖
    );
  });

  // 8. 删除空目录
  console.log('\n删除空目录');
  const emptyDirs = [
    'features',
    'common',
    'analytics',
    'clothing',
    'upload'
  ];

  emptyDirs.forEach(dir => {
    removeEmptyDir(path.join(srcComponentsDir, dir));
  });

  console.log('\n组件重组完成!');
  console.log('请手动检查并更新所有组件引用路径');
}

// 执行组件重组
reorganizeComponents();
