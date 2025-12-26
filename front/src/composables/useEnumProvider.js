import { computed, provide, inject } from 'vue';
import { useEnumsStore } from '@/stores/modules/enumsStore';

/**
 * 枚举数据提供模式 - 使用 provide/inject 统一传递枚举数据
 * 解决深层组件props逐层传递的繁琐问题
 */

// 注入键常量
export const ENUM_PROVIDER_KEY = 'stylevault-enum-provider';

/**
 * 创建枚举数据提供者
 * 在父组件中使用，提供枚举数据给所有子组件
 */
export function useEnumProvider() {
  const enumsStore = useEnumsStore();

  // 提供所有枚举数据
  provide(ENUM_PROVIDER_KEY, {
    // 场景枚举
    scenes: computed(() => enumsStore.getOptions('scene')),
    getSceneLabel: (value) => enumsStore.getLabel('scene', value),

    // 季节枚举
    seasons: computed(() => enumsStore.getOptions('season')),
    getSeasonLabel: (value) => enumsStore.getLabel('season', value),

    // 风格枚举
    styles: computed(() => enumsStore.getOptions('style')),
    getStyleLabel: (value) => enumsStore.getLabel('style', value),

    // 标签枚举
    tags: computed(() => enumsStore.getOptions('tag')),
    getTagLabel: (value) => enumsStore.getLabel('tag', value),

    // 颜色枚举
    colors: computed(() => enumsStore.getOptions('color')),
    getColorLabel: (value) => enumsStore.getLabel('color', value),

    // 尺寸枚举
    sizes: computed(() => enumsStore.getOptions('size')),
    getSizeLabel: (value) => enumsStore.getLabel('size', value),

    // 分类枚举（从clothingStore获取）
    categories: computed(() => enumsStore.getOptions('category')),
    getCategoryLabel: (value) => enumsStore.getLabel('category', value),

    // 刷新所有枚举数据
    refreshEnums: () => enumsStore.fetchAllEnums(),
  });
}

/**
 * 使用枚举数据的注入函数
 * 在任意子组件中使用，获取父组件提供的枚举数据
 */
export function useEnums() {
  const enums = inject(ENUM_PROVIDER_KEY);

  if (!enums) {
    console.warn('useEnums: 未找到枚举数据提供者，请在父组件中使用 useEnumProvider');
    // 返回默认空值
    return {
      scenes: [],
      getSceneLabel: () => '',
      seasons: [],
      getSeasonLabel: () => '',
      styles: [],
      getStyleLabel: () => '',
      tags: [],
      getTagLabel: () => '',
      colors: [],
      getColorLabel: () => '',
      sizes: [],
      getSizeLabel: () => '',
      categories: [],
      getCategoryLabel: () => '',
      refreshEnums: () => {},
    };
  }

  return enums;
}

/**
 * 便捷Hook - 只获取特定类型的枚举
 * @param {string} enumType - 枚举类型: scene/season/style/tag/color/size/category
 */
export function useEnum(enumType) {
  const enums = useEnums();

  const enumMap = {
    scene: { options: enums.scenes, getLabel: enums.getSceneLabel },
    season: { options: enums.seasons, getLabel: enums.getSeasonLabel },
    style: { options: enums.styles, getLabel: enums.getStyleLabel },
    tag: { options: enums.tags, getLabel: enums.getTagLabel },
    color: { options: enums.colors, getLabel: enums.getColorLabel },
    size: { options: enums.sizes, getLabel: enums.getSizeLabel },
    category: { options: enums.categories, getLabel: enums.getCategoryLabel },
  };

  const selected = enumMap[enumType];

  if (!selected) {
    console.warn(`useEnum: 未知的枚举类型 "${enumType}"`);
    return { options: [], getLabel: () => '' };
  }

  return selected;
}

export default {
  useEnumProvider,
  useEnums,
  useEnum,
  ENUM_PROVIDER_KEY,
};
