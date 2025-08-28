
// Store入口文件 - 统一导出所有store模块

// 导入各个模块store
import { useClothingStore } from './modules/clothingStore'
import { useOutfitStore } from './modules/outfitStore'
import { useUserStore } from './modules/userStore'
import { useUiStore } from './modules/uiStore'

// 统一导出
export {
  useClothingStore,
  useOutfitStore,
  useUserStore,
  useUiStore
}

// 可选：导出一个初始化函数，用于在应用启动时初始化所有store
export async function initializeStores() {
  // 初始化UI状态
  const uiStore = useUiStore()
  uiStore.initializeUi()

  // 初始化用户数据
  const userStore = useUserStore()
  await userStore.initializeUser()

  // 初始化衣物数据
  const clothingStore = useClothingStore()
  await clothingStore.initializeData()

  // 初始化搭配数据
  const outfitStore = useOutfitStore()
  await outfitStore.initializeData()
}
