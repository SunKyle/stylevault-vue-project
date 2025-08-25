// 衣物类别数据
export const categories = [
  { id: 1, name: '上装', icon: 'tshirt' },
  { id: 2, name: '下装', icon: 'socks' },
  { id: 3, name: '外套', icon: 'vest' },
  { id: 4, name: '鞋履', icon: 'shoe-prints' },
  { id: 5, name: '配饰', icon: 'gem' },
  { id: 6, name: '包包', icon: 'bag-shopping' }
]

// 衣物数据
export const clothingItems = [
  {
    id: 1,
    name: '白色T恤',
    categoryId: 1,
    category: '上装',
    color: '#FFFFFF',
    image: 'https://picsum.photos/seed/tshirt1/300/400',
    brand: 'UNIQLO',
    season: ['春', '夏'],
    style: '休闲',
    material: '棉',
    purchaseDate: '2023-05-15',
    lastWorn: '2023-08-20',
    wearCount: 8,
    favorite: true
  },
  {
    id: 2,
    name: '牛仔裤',
    categoryId: 2,
    category: '下装',
    color: '#4A5568',
    image: 'https://picsum.photos/seed/jeans1/300/400',
    brand: 'Levi',
    season: ['春', '秋', '冬'],
    style: '休闲',
    material: '牛仔布',
    purchaseDate: '2023-03-10',
    lastWorn: '2023-08-18',
    wearCount: 12,
    favorite: true
  },
  {
    id: 3,
    name: '连帽卫衣',
    categoryId: 1,
    category: '上装',
    color: '#2D3748',
    image: 'https://picsum.photos/seed/hoodie1/300/400',
    brand: 'Nike',
    season: ['秋', '冬'],
    style: '运动',
    material: '棉',
    purchaseDate: '2022-11-20',
    lastWorn: '2023-08-15',
    wearCount: 15,
    favorite: false
  },
  {
    id: 4,
    name: '风衣',
    categoryId: 3,
    category: '外套',
    color: '#718096',
    image: 'https://picsum.photos/seed/coat1/300/400',
    brand: 'ZARA',
    season: ['春', '秋'],
    style: '商务',
    material: '聚酯纤维',
    purchaseDate: '2023-02-05',
    lastWorn: '2023-08-10',
    wearCount: 5,
    favorite: true
  },
  {
    id: 5,
    name: '运动鞋',
    categoryId: 4,
    category: '鞋履',
    color: '#000000',
    image: 'https://picsum.photos/seed/shoes1/300/400',
    brand: 'Adidas',
    season: ['春', '夏', '秋'],
    style: '运动',
    material: '合成材料',
    purchaseDate: '2023-01-15',
    lastWorn: '2023-08-19',
    wearCount: 20,
    favorite: true
  },
  {
    id: 6,
    name: '手表',
    categoryId: 5,
    category: '配饰',
    color: '#C0C0C0',
    image: 'https://picsum.photos/seed/watch1/300/400',
    brand: 'Casio',
    season: ['春', '夏', '秋', '冬'],
    style: '商务',
    material: '不锈钢',
    purchaseDate: '2022-12-25',
    lastWorn: '2023-08-21',
    wearCount: 30,
    favorite: true
  },
  {
    id: 7,
    name: '双肩包',
    categoryId: 6,
    category: '包包',
    color: '#2B6CB0',
    image: 'https://picsum.photos/seed/backpack1/300/400',
    brand: 'Herschel',
    season: ['春', '夏', '秋', '冬'],
    style: '休闲',
    material: '尼龙',
    purchaseDate: '2023-04-10',
    lastWorn: '2023-08-17',
    wearCount: 18,
    favorite: true
  },
  {
    id: 8,
    name: '衬衫',
    categoryId: 1,
    category: '上装',
    color: '#FFFFFF',
    image: 'https://picsum.photos/seed/shirt1/300/400',
    brand: 'H&M',
    season: ['春', '夏', '秋'],
    style: '商务',
    material: '棉',
    purchaseDate: '2023-06-01',
    lastWorn: '2023-08-16',
    wearCount: 7,
    favorite: true
  },
  {
    id: 9,
    name: '短裤',
    categoryId: 2,
    category: '下装',
    color: '#4A5568',
    image: 'https://picsum.photos/seed/shorts1/300/400',
    brand: 'UNIQLO',
    season: ['夏'],
    style: '休闲',
    material: '棉',
    purchaseDate: '2023-05-20',
    lastWorn: '2023-08-14',
    wearCount: 10,
    favorite: true
  },
  {
    id: 10,
    name: '皮夹克',
    categoryId: 3,
    category: '外套',
    color: '#000000',
    image: 'https://picsum.photos/seed/jacket1/300/400',
    brand: 'AllSaints',
    season: ['秋', '冬'],
    style: '摇滚',
    material: '真皮',
    purchaseDate: '2022-10-15',
    lastWorn: '2023-08-12',
    wearCount: 6,
    favorite: true
  },
  {
    id: 11,
    name: '皮鞋',
    categoryId: 4,
    category: '鞋履',
    color: '#000000',
    image: 'https://picsum.photos/seed/leather-shoes1/300/400',
    brand: 'ECCO',
    season: ['春', '秋', '冬'],
    style: '商务',
    material: '真皮',
    purchaseDate: '2023-01-30',
    lastWorn: '2023-08-11',
    wearCount: 9,
    favorite: false
  },
  {
    id: 12,
    name: '太阳镜',
    categoryId: 5,
    category: '配饰',
    color: '#000000',
    image: 'https://picsum.photos/seed/sunglasses1/300/400',
    brand: 'Ray-Ban',
    season: ['春', '夏'],
    style: '时尚',
    material: '塑料',
    purchaseDate: '2023-04-25',
    lastWorn: '2023-08-13',
    wearCount: 15,
    favorite: true
  },
  // 上装类别更多数据
  {
    id: 13,
    name: '条纹衬衫',
    categoryId: 1,
    category: '上装',
    color: '#4A5568',
    image: 'https://picsum.photos/seed/shirt1/300/400',
    brand: 'ZARA',
    season: ['春', '夏'],
    style: '商务',
    material: '棉',
    purchaseDate: '2023-06-10',
    lastWorn: '2023-08-19',
    wearCount: 5,
    favorite: false
  },
  {
    id: 14,
    name: '黑色 Polo 衫',
    categoryId: 1,
    category: '上装',
    color: '#1A202C',
    image: 'https://picsum.photos/seed/polo1/300/400',
    brand: 'Ralph Lauren',
    season: ['春', '夏'],
    style: '休闲',
    material: '棉',
    purchaseDate: '2023-05-20',
    lastWorn: '2023-08-18',
    wearCount: 7,
    favorite: true
  },
  {
    id: 15,
    name: '灰色毛衣',
    categoryId: 1,
    category: '上装',
    color: '#718096',
    image: 'https://picsum.photos/seed/sweater1/300/400',
    brand: 'UNIQLO',
    season: ['秋', '冬'],
    style: '休闲',
    material: '羊毛',
    purchaseDate: '2022-10-15',
    lastWorn: '2023-08-10',
    wearCount: 20,
    favorite: true
  },
  // 下装类别更多数据
  {
    id: 16,
    name: '黑色休闲裤',
    categoryId: 2,
    category: '下装',
    color: '#1A202C',
    image: 'https://picsum.photos/seed/pants1/300/400',
    brand: 'H&M',
    season: ['春', '秋', '冬'],
    style: '休闲',
    material: '棉',
    purchaseDate: '2023-04-05',
    lastWorn: '2023-08-17',
    wearCount: 10,
    favorite: false
  },
  {
    id: 17,
    name: '卡其色短裤',
    categoryId: 2,
    category: '下装',
    color: '#D69E2E',
    image: 'https://picsum.photos/seed/shorts1/300/400',
    brand: 'UNIQLO',
    season: ['春', '夏'],
    style: '休闲',
    material: '棉',
    purchaseDate: '2023-06-01',
    lastWorn: '2023-08-16',
    wearCount: 8,
    favorite: true
  },
  {
    id: 18,
    name: '灰色运动裤',
    categoryId: 2,
    category: '下装',
    color: '#718096',
    image: 'https://picsum.photos/seed/joggers1/300/400',
    brand: 'Nike',
    season: ['秋', '冬'],
    style: '运动',
    material: '聚酯纤维',
    purchaseDate: '2022-12-10',
    lastWorn: '2023-08-15',
    wearCount: 25,
    favorite: true
  },
  // 外套类别更多数据
  {
    id: 19,
    name: '黑色皮夹克',
    categoryId: 3,
    category: '外套',
    color: '#1A202C',
    image: 'https://picsum.photos/seed/jacket1/300/400',
    brand: 'AllSaints',
    season: ['秋', '冬'],
    style: '摇滚',
    material: '皮革',
    purchaseDate: '2022-11-05',
    lastWorn: '2023-08-14',
    wearCount: 12,
    favorite: true
  },
  {
    id: 20,
    name: '蓝色牛仔外套',
    categoryId: 3,
    category: '外套',
    color: '#2B6CB0',
    image: 'https://picsum.photos/seed/denim1/300/400',
    brand: 'Levi',
    season: ['春', '秋'],
    style: '休闲',
    material: '牛仔布',
    purchaseDate: '2023-03-15',
    lastWorn: '2023-08-13',
    wearCount: 15,
    favorite: false
  },
  {
    id: 21,
    name: '灰色风衣',
    categoryId: 3,
    category: '外套',
    color: '#718096',
    image: 'https://picsum.photos/seed/trench1/300/400',
    brand: 'Burberry',
    season: ['春', '秋'],
    style: '商务',
    material: '棉',
    purchaseDate: '2023-04-20',
    lastWorn: '2023-08-12',
    wearCount: 8,
    favorite: true
  },
  // 鞋履类别更多数据
  {
    id: 22,
    name: '白色运动鞋',
    categoryId: 4,
    category: '鞋履',
    color: '#FFFFFF',
    image: 'https://picsum.photos/seed/sneakers1/300/400',
    brand: 'Adidas',
    season: ['春', '夏', '秋'],
    style: '运动',
    material: '合成材料',
    purchaseDate: '2023-05-10',
    lastWorn: '2023-08-20',
    wearCount: 30,
    favorite: true
  },
  {
    id: 23,
    name: '棕色皮鞋',
    categoryId: 4,
    category: '鞋履',
    color: '#975A16',
    image: 'https://picsum.photos/seed/leather1/300/400',
    brand: 'Clarks',
    season: ['秋', '冬'],
    style: '商务',
    material: '皮革',
    purchaseDate: '2022-10-25',
    lastWorn: '2023-08-19',
    wearCount: 18,
    favorite: true
  },
  {
    id: 24,
    name: '黑色靴子',
    categoryId: 4,
    category: '鞋履',
    color: '#1A202C',
    image: 'https://picsum.photos/seed/boots1/300/400',
    brand: 'Dr. Martens',
    season: ['秋', '冬'],
    style: '摇滚',
    material: '皮革',
    purchaseDate: '2022-11-15',
    lastWorn: '2023-08-18',
    wearCount: 14,
    favorite: false
  },
  // 配饰类别更多数据
  {
    id: 25,
    name: '黑色皮带',
    categoryId: 5,
    category: '配饰',
    color: '#1A202C',
    image: 'https://picsum.photos/seed/belt1/300/400',
    brand: 'Gucci',
    season: ['春', '夏', '秋', '冬'],
    style: '商务',
    material: '皮革',
    purchaseDate: '2023-01-10',
    lastWorn: '2023-08-17',
    wearCount: 40,
    favorite: true
  },
  {
    id: 26,
    name: '蓝色围巾',
    categoryId: 5,
    category: '配饰',
    color: '#2B6CB0',
    image: 'https://picsum.photos/seed/scarf1/300/400',
    brand: 'UNIQLO',
    season: ['秋', '冬'],
    style: '休闲',
    material: '羊毛',
    purchaseDate: '2022-12-05',
    lastWorn: '2023-08-16',
    wearCount: 20,
    favorite: true
  },
  {
    id: 27,
    name: '黑色太阳镜',
    categoryId: 5,
    category: '配饰',
    color: '#1A202C',
    image: 'https://picsum.photos/seed/sunglasses1/300/400',
    brand: 'Ray-Ban',
    season: ['春', '夏'],
    style: '休闲',
    material: '塑料',
    purchaseDate: '2023-06-15',
    lastWorn: '2023-08-15',
    wearCount: 10,
    favorite: false
  },
  // 包包类别更多数据
  {
    id: 28,
    name: '黑色双肩包',
    categoryId: 6,
    category: '包包',
    color: '#1A202C',
    image: 'https://picsum.photos/seed/backpack1/300/400',
    brand: 'Herschel',
    season: ['春', '夏', '秋', '冬'],
    style: '休闲',
    material: '尼龙',
    purchaseDate: '2023-02-20',
    lastWorn: '2023-08-20',
    wearCount: 50,
    favorite: true
  },
  {
    id: 29,
    name: '棕色手提包',
    categoryId: 6,
    category: '包包',
    color: '#975A16',
    image: 'https://picsum.photos/seed/handbag1/300/400',
    brand: 'Coach',
    season: ['春', '夏', '秋'],
    style: '商务',
    material: '皮革',
    purchaseDate: '2023-04-10',
    lastWorn: '2023-08-19',
    wearCount: 15,
    favorite: true
  },
  {
    id: 30,
    name: '蓝色腰包',
    categoryId: 6,
    category: '包包',
    color: '#2B6CB0',
    image: 'https://picsum.photos/seed/waist1/300/400',
    brand: 'Nike',
    season: ['春', '夏'],
    style: '运动',
    material: '尼龙',
    purchaseDate: '2023-05-25',
    lastWorn: '2023-08-18',
    wearCount: 12,
    favorite: false
  }
]

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟API服务
export const wardrobeAPI = {
  // 获取所有衣物类别
  getCategories: async () => {
    await delay(300) // 模拟网络延迟
    return { success: true, data: categories }
  },

  // 获取所有衣物
  getClothingItems: async () => {
    await delay(500) // 模拟网络延迟
    return { success: true, data: clothingItems }
  },

  // 根据类别获取衣物
  getClothingItemsByCategory: async (categoryId) => {
    await delay(400) // 模拟网络延迟
    const items = clothingItems.filter(item => item.categoryId === categoryId)
    return { success: true, data: items }
  },

  // 获取衣物详情
  getClothingItemDetail: async (id) => {
    await delay(300) // 模拟网络延迟
    const item = clothingItems.find(item => item.id === id)
    if (item) {
      return { success: true, data: item }
    } else {
      return { success: false, message: '未找到该衣物' }
    }
  },

  // 添加衣物
  addClothingItem: async (item) => {
    await delay(600) // 模拟网络延迟
    const newItem = {
      ...item,
      id: clothingItems.length + 1,
      wearCount: 0,
      lastWorn: null
    }
    clothingItems.push(newItem)
    return { success: true, data: newItem }
  },

  // 更新衣物信息
  updateClothingItem: async (id, updates) => {
    await delay(500) // 模拟网络延迟
    const index = clothingItems.findIndex(item => item.id === id)
    if (index !== -1) {
      clothingItems[index] = { ...clothingItems[index], ...updates }
      return { success: true, data: { ...clothingItems[index] } }
    } else {
      return { success: false, message: '未找到该衣物' }
    }
  },

  // 删除衣物
  deleteClothingItem: async (id) => {
    await delay(400) // 模拟网络延迟
    const index = clothingItems.findIndex(item => item.id === id)
    if (index !== -1) {
      clothingItems.splice(index, 1)
      return { success: true }
    } else {
      return { success: false, message: '未找到该衣物' }
    }
  },

  // 搜索衣物
  searchClothingItems: async (keyword) => {
    await delay(400) // 模拟网络延迟
    const results = clothingItems.filter(item => 
      item.name.toLowerCase().includes(keyword.toLowerCase()) ||
      item.brand.toLowerCase().includes(keyword.toLowerCase()) ||
      item.style.toLowerCase().includes(keyword.toLowerCase())
    )
    return { success: true, data: results }
  }
}
