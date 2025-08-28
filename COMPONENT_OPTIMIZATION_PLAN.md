# 组件组织优化方案

## 当前问题
1. 存在重复的组件目录结构，例如 `analysis/` 和 `features/analysis/` 都包含相同组件
2. `common/` 目录下又有 `layout/` 和 `ui/` 子目录，与外层的 `layout/` 和 `ui/` 目录重复
3. 一些目录为空，如 `analytics/`、`clothing/`、`layout/`、`outfits/`、`ui/`、`upload/`
4. 组件分类不够细致，命名不够统一

## 优化目标
1. 消除重复的目录结构
2. 建立清晰的组件层级关系
3. 按功能领域划分组件，提高可维护性
4. 统一组件命名规范

## 建议的组件结构

```
src/
└── components/
    ├── layout/              # 布局组件
    │   ├── AppHeader.vue
    │   ├── AppSidebar.vue
    │   ├── AppFooter.vue
    │   └── AppLayout.vue
    │
    ├── ui/                  # 通用UI组件
    │   ├── BaseButton.vue
    │   ├── BaseCard.vue
    │   ├── BaseModal.vue
    │   ├── BaseInput.vue
    │   ├── BaseSelect.vue
    │   ├── SearchBar.vue
    │   ├── FloatingActionButton.vue
    │   └── StatCard.vue
    │
    ├── form/                # 表单组件
    │   ├── ClothingForm.vue
    │   ├── OutfitForm.vue
    │   └── UploadForm.vue
    │
    ├── clothing/            # 服装相关组件
    │   ├── ClothingItem.vue
    │   ├── ClothingCategory.vue
    │   ├── ClothingItemEditor.vue
    │   └── CategoryDrawer.vue
    │
    ├── outfits/             # 穿搭相关组件
    │   ├── OutfitCard.vue
    │   ├── OutfitCreator.vue
    │   ├── OutfitPreviewPanel.vue
    │   └── SavedOutfits.vue
    │
    ├── wardrobe/            # 衣橱管理相关组件
    │   ├── WardrobeSection.vue
    │   ├── WardrobeHeader.vue
    │   ├── FavoriteSection.vue
    │   └── FeaturedOutfits.vue
    │
    ├── inspiration/         # 灵感相关组件
    │   ├── InspirationSection.vue
    │   ├── ClothingSelectionPanel.vue
    │   └── OutfitCard.vue
    │
    ├── analysis/            # 分析相关组件
    │   └── AnalysisSection.vue
    │
    ├── analytics/           # 数据分析相关组件
    │   ├── StatsView.vue
    │   └── AnalyticsDashboard.vue
    │
    ├── weather/             # 天气相关组件
    │   └── WeatherSection.vue
    │
    └── upload/              # 上传相关组件
        ├── UploadModal.vue
        └── ImageUploader.vue
```

## 优化步骤

1. **整合重复组件**：
   - 将 `features/` 目录下的组件移动到对应的功能目录中
   - 删除 `features/` 目录
   - 将 `common/` 目录下的组件移动到对应的目录中

2. **填充空目录**：
   - 为空目录添加基础组件文件
   - 如果某些目录确实不需要，则删除这些目录

3. **统一命名规范**：
   - 布局组件使用 `App` 前缀
   - 通用UI组件使用 `Base` 前缀
   - 功能组件使用描述性名称

4. **更新引用**：
   - 更新所有引用了移动组件的文件
   - 确保所有导入路径正确

## 注意事项

1. 在移动组件之前，确保检查所有引用这些组件的文件
2. 移动组件后，需要更新相应的导入路径
3. 建议分步骤进行，先移动一个目录的组件，测试无误后再继续
