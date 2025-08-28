// 统一的mock数据管理文件

// 衣物类别数据
export const categories = [
  { id: 1, name: '上装', icon: 'tshirt' },
  { id: 2, name: '下装', icon: 'socks' },
  { id: 3, name: '外套', icon: 'vest' },
  { id: 4, name: '鞋履', icon: 'shoe-prints' },
  { id: 5, name: '配饰', icon: 'gem' },
  { id: 6, name: '包包', icon: 'bag-shopping' }
]

// 场景数据
export const scenesMockData = [
  { value: 'daily', label: '日常' },
  { value: 'work', label: '工作' },
  { value: 'party', label: '聚会' },
  { value: 'date', label: '约会' },
  { value: 'travel', label: '旅行' },
  { value: 'sports', label: '运动' }
]

// 季节数据
export const seasonsMockData = [
  { value: 'spring', label: '春季' },
  { value: 'summer', label: '夏季' },
  { value: 'autumn', label: '秋季' },
  { value: 'winter', label: '冬季' }
]

// 风格数据
export const stylesMockData = [
  { value: 'casual', label: '休闲' },
  { value: 'formal', label: '正式' },
  { value: 'business', label: '商务' },
  { value: 'street', label: '街头' },
  { value: 'vintage', label: '复古' },
  { value: 'minimalist', label: '极简' }
]

// 用户数据
export const users = [
  {
    id: 1,
    username: "stylefan",
    email: "user@example.com",
    nickname: "时尚达人",
    avatar: "https://picsum.photos/seed/user1/200/200",
    bio: "热爱时尚，喜欢尝试不同风格的穿搭",
    preferences: {
      favoriteStyles: ["休闲", "商务"],
      favoriteColors: ["#000000", "#4A5568", "#FFFFFF"],
      preferredSeasons: ["春季", "秋季"]
    },
    stats: {
      totalItems: 30,
      totalOutfits: 12,
      favoriteItems: 20,
      itemsWornThisMonth: 15
    },
    createdAt: "2023-01-15",
    lastLogin: "2023-08-21"
  }
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
    seasons: ['春季', '夏季'],
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
    seasons: ['春季', '秋季', '冬季'],
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
    seasons: ['秋季', '冬季'],
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
    seasons: ['春季', '秋季'],
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
    seasons: ['春季', '夏季', '秋季'],
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
    seasons: ['春季', '夏季', '秋季', '冬季'],
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
    seasons: ['春季', '夏季', '秋季', '冬季'],
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
    seasons: ['春季', '夏季', '秋季'],
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
    seasons: ['夏季'],
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
    seasons: ['秋季', '冬季'],
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
    seasons: ['春季', '秋季', '冬季'],
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
    seasons: ['春季', '夏季'],
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
    seasons: ['春季', '夏季'],
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
    seasons: ['春季', '夏季'],
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
    seasons: ['秋季', '冬季'],
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
    seasons: ['春季', '秋季', '冬季'],
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
    seasons: ['春季', '夏季'],
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
    seasons: ['秋季', '冬季'],
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
    seasons: ['秋季', '冬季'],
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
    seasons: ['春季', '秋季'],
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
    seasons: ['春季', '秋季'],
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
    seasons: ['春季', '夏季', '秋季'],
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
    seasons: ['秋季', '冬季'],
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
    seasons: ['秋季', '冬季'],
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
    seasons: ['春季', '夏季', '秋季', '冬季'],
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
    seasons: ['秋季', '冬季'],
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
    seasons: ['春季', '夏季'],
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
    seasons: ['春季', '夏季', '秋季', '冬季'],
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
    seasons: ['春季', '夏季', '秋季'],
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
    seasons: ['春季', '夏季'],
    style: '运动',
    material: '尼龙',
    purchaseDate: '2023-05-25',
    lastWorn: '2023-08-18',
    wearCount: 12,
    favorite: false
  }
]

// 搭配数据
export const outfits = [
  {
    id: 1,
    name: "商务休闲",
    description: "适合办公室的商务休闲搭配",
    image: "https://picsum.photos/seed/outfit1/400/500",
    items: [1, 8, 16, 11], // 衣物ID数组
    tags: ["商务", "休闲"],
    seasons: ["春季", "秋季"],
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
    seasons: ["春季", "夏季"],
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
    seasons: ["春季", "秋季"],
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
    seasons: ["春季", "夏季", "秋季"],
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
    seasons: ["秋季", "冬季"],
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
    seasons: ["春季", "夏季"],
    style: "休闲",
    scene: "travel",
    favorite: false,
    likes: 12,
    createdAt: "2023-06-20",
    lastWorn: "2023-08-10"
  }
]

// 分析数据
export const analyticsData = {
  // 衣物统计信息
  clothingStats: {
    totalItems: 30,
    totalValue: 15000,
    averageWearCount: 12,
    mostWornItem: {
      id: 5,
      name: "运动鞋",
      wearCount: 30
    },
    leastWornItem: {
      id: 4,
      name: "风衣",
      wearCount: 5
    },
    favoriteItems: 20,
    itemsAddedThisMonth: 3,
    itemsWornThisMonth: 15
  },

  // 搭配统计信息
  outfitStats: {
    totalOutfits: 12,
    favoriteOutfits: 8,
    mostUsedOutfit: {
      id: 2,
      name: "周末休闲",
      usageCount: 8
    },
    outfitsCreatedThisMonth: 2,
    averageItemsPerOutfit: 3.5
  },

  // 穿着频率分析
  wearFrequency: [
    { name: "白色T恤", count: 8 },
    { name: "牛仔裤", count: 12 },
    { name: "连帽卫衣", count: 15 },
    { name: "风衣", count: 5 },
    { name: "运动鞋", count: 30 },
    { name: "手表", count: 30 },
    { name: "双肩包", count: 18 }
  ],

  // 类别分布
  categoryDistribution: [
    { name: "上装", count: 8, percentage: 27 },
    { name: "下装", count: 5, percentage: 17 },
    { name: "外套", count: 4, percentage: 13 },
    { name: "鞋履", count: 5, percentage: 17 },
    { name: "配饰", count: 4, percentage: 13 },
    { name: "包包", count: 4, percentage: 13 }
  ],

  // 季节穿着分析
  seasonalAnalysis: [
    { season: "春季", count: 20, percentage: 35 },
    { season: "夏季", count: 15, percentage: 26 },
    { season: "秋季", count: 18, percentage: 32 },
    { season: "冬季", count: 4, percentage: 7 }
  ],

  // 风格偏好分析
  stylePreferences: [
    { style: "休闲", count: 18, percentage: 60 },
    { style: "商务", count: 8, percentage: 27 },
    { style: "运动", count: 3, percentage: 10 },
    { style: "摇滚", count: 1, percentage: 3 }
  ],

  // 价值分析
  valueAnalysis: {
    totalValue: 15000,
    averageItemValue: 500,
    highestValueItem: {
      id: 21,
      name: "灰色风衣",
      value: 2500
    },
    lowestValueItem: {
      id: 1,
      name: "白色T恤",
      value: 99
    },
    valuePerWear: {
      highest: {
        id: 5,
        name: "运动鞋",
        value: 800,
        wearCount: 30,
        valuePerWear: 26.67
      },
      lowest: {
        id: 4,
        name: "风衣",
        value: 1500,
        wearCount: 5,
        valuePerWear: 300
      }
    }
  }
}
