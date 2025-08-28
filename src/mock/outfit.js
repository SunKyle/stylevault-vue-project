// 搭配数据
export const outfits = [
  {
    id: 1,
    name: "商务休闲",
    description: "适合办公室的商务休闲搭配",
    image: "https://picsum.photos/seed/outfit1/400/500",
    items: [1, 8, 16, 11], // 衣物ID数组
    tags: ["商务", "休闲"],
    season: ["春季", "秋季"],
    style: "商务",
    scene: "work",
    favorite: true,
    likes: 15,
    createdAt: "2023-06-10",
    lastWorn: "2023-08-15"
  },
  {
    id: 2,
    name: "周末休闲",
    description: "舒适的周末休闲搭配",
    image: "https://picsum.photos/seed/outfit2/400/500",
    items: [1, 2, 5], // 衣物ID数组
    tags: ["休闲"],
    season: ["春季", "夏季"],
    style: "休闲",
    scene: "daily",
    favorite: true,
    likes: 20,
    createdAt: "2023-05-20",
    lastWorn: "2023-08-19"
  },
  {
    id: 3,
    name: "运动风",
    description: "适合运动和健身的搭配",
    image: "https://picsum.photos/seed/outfit3/400/500",
    items: [3, 18, 5], // 衣物ID数组
    tags: ["运动"],
    season: ["春季", "秋季"],
    style: "运动",
    scene: "sports",
    favorite: false,
    likes: 10,
    createdAt: "2023-04-15",
    lastWorn: "2023-08-12"
  },
  {
    id: 4,
    name: "约会穿搭",
    description: "适合约会的时尚搭配",
    image: "https://picsum.photos/seed/outfit4/400/500",
    items: [8, 2, 23, 25], // 衣物ID数组
    tags: ["时尚", "正式"],
    season: ["春季", "夏季", "秋季"],
    style: "商务",
    scene: "date",
    favorite: true,
    likes: 25,
    createdAt: "2023-07-01",
    lastWorn: "2023-08-20"
  },
  {
    id: 5,
    name: "摇滚风格",
    description: "个性的摇滚风格搭配",
    image: "https://picsum.photos/seed/outfit5/400/500",
    items: [10, 2, 24], // 衣物ID数组
    tags: ["摇滚", "个性"],
    season: ["秋季", "冬季"],
    style: "摇滚",
    scene: "party",
    favorite: true,
    likes: 18,
    createdAt: "2023-03-25",
    lastWorn: "2023-08-14"
  },
  {
    id: 6,
    name: "旅行装备",
    description: "舒适实用的旅行搭配",
    image: "https://picsum.photos/seed/outfit6/400/500",
    items: [1, 17, 22, 28], // 衣物ID数组
    tags: ["休闲", "舒适"],
    season: ["春季", "夏季"],
    style: "休闲",
    scene: "travel",
    favorite: false,
    likes: 12,
    createdAt: "2023-06-20",
    lastWorn: "2023-08-10"
  }
]

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟搭配API服务
export const outfitAPI = {
  // 获取所有搭配
  getOutfits: async () => {
    await delay(500) // 模拟网络延迟
    return { success: true, data: [...outfits] }
  },

  // 根据标签获取搭配
  getOutfitsByTag: async (tag) => {
    await delay(400) // 模拟网络延迟
    const results = outfits.filter(outfit => 
      outfit.tags.includes(tag)
    )
    return { success: true, data: results }
  },

  // 根据场景获取搭配
  getOutfitsByScene: async (scene) => {
    await delay(400) // 模拟网络延迟
    const results = outfits.filter(outfit => outfit.scene === scene)
    return { success: true, data: results }
  },

  // 根据季节获取搭配
  getOutfitsBySeason: async (season) => {
    await delay(400) // 模拟网络延迟
    const results = outfits.filter(outfit => 
      outfit.season.includes(season)
    )
    return { success: true, data: results }
  },

  // 获取搭配详情
  getOutfitDetail: async (id) => {
    await delay(300) // 模拟网络延迟
    const outfit = outfits.find(o => o.id === id)
    
    if (outfit) {
      return { success: true, data: outfit }
    } else {
      return { success: false, message: "未找到该搭配" }
    }
  },

  // 添加新搭配
  addOutfit: async (outfit) => {
    await delay(600) // 模拟网络延迟
    const newOutfit = {
      ...outfit,
      id: outfits.length + 1,
      likes: 0,
      createdAt: new Date().toISOString().split("T")[0]
    }
    outfits.push(newOutfit)
    return { success: true, data: { ...newOutfit } }
  },

  // 更新搭配
  updateOutfit: async (id, updates) => {
    await delay(500) // 模拟网络延迟
    const index = outfits.findIndex(o => o.id === id)
    
    if (index !== -1) {
      outfits[index] = { ...outfits[index], ...updates }
      return { success: true, data: { ...outfits[index] } }
    } else {
      return { success: false, message: "未找到该搭配" }
    }
  },

  // 删除搭配
  deleteOutfit: async (id) => {
    await delay(400) // 模拟网络延迟
    const index = outfits.findIndex(o => o.id === id)
    
    if (index !== -1) {
      outfits.splice(index, 1)
      return { success: true }
    } else {
      return { success: false, message: "未找到该搭配" }
    }
  },

  // 切换搭配的喜欢状态
  toggleLike: async (id) => {
    await delay(300) // 模拟网络延迟
    const index = outfits.findIndex(o => o.id === id)
    
    if (index !== -1) {
      outfits[index].favorite = !outfits[index].favorite
      if (outfits[index].favorite) {
        outfits[index].likes += 1
      } else {
        outfits[index].likes -= 1
      }
      return { success: true, data: { ...outfits[index] } }
    } else {
      return { success: false, message: "未找到该搭配" }
    }
  }
}