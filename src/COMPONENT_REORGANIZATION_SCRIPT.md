# 组件重组脚本

## 需要移动的组件列表

### 从 features/analysis/ 移动到 analysis/
- AnalysisSection.vue (已存在，但 features/analysis/ 中的更完整)

### 从 features/inspiration/ 移动到 inspiration/
- InspirationSection.vue (已存在，但 features/inspiration/ 中的更完整)
- ClothingSelectionPanel.vue
- OutfitCard.vue
- OutfitCreator.vue
- OutfitPreviewPanel.vue
- SavedOutfits.vue

### 从 features/wardrobe/ 移动到 wardrobe/
- WardrobeSection.vue (已存在，但 features/wardrobe/ 中的更完整)
- CategoryDrawer.vue
- ClothingItemEditor.vue
- FavoriteSection.vue
- FeaturedOutfits.vue
- WardrobeHeader.vue

### 从 features/weather/ 移动到 weather/
- WeatherSection.vue (已存在，但 features/weather/ 中的更完整)

### 从 common/layout/ 移动到 layout/
- ContentLayout.vue
- Footer.vue
- Header.vue
- PageLayout.vue

### 从 common/ui/ 移动到 ui/
- ClothingCategory.vue
- ClothingItem.vue
- FeatureCard.vue
- FloatingActionButton.vue
- OutfitCard.vue
- SearchBar.vue
- StatCard.vue
- UploadModal.vue

### 从 common/ 移动到对应目录
- ClothingCategory.vue -> ui/
- ClothingItem.vue -> ui/
- Footer.vue -> layout/
- Header.vue -> layout/
- OutfitCard.vue -> ui/
- UploadModal.vue -> ui/

## 需要删除的空目录
- features/ (移动完所有组件后)
- common/ (移动完所有组件后)
- analytics/ (如果为空)
- clothing/ (如果为空)
- upload/ (如果为空)

## 注意事项
1. 移动组件前，确保检查所有引用这些组件的文件
2. 移动组件后，需要更新相应的导入路径
3. 建议分步骤进行，先移动一个目录的组件，测试无误后再继续
