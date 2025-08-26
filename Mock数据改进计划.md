# Mock数据改进计划

## 概述

本文档基于《数据结构设计.md》中的数据结构设计，分析当前mock数据与设计文档的差异，并提出改进计划，以确保mock数据的一致性和完整性，为后续开发提供可靠的数据支持。

## 当前mock数据分析

### 1. 衣物数据 (wardrobe.js)

#### 符合设计的部分
- 基本字段如id、name、categoryId、category、color、image、brand等已包含
- 包含了类别、风格、季节等关联数据

#### 需要改进的部分
1. **字段命名不一致**
   - 当前代码中同时使用`season`和`seasons`字段
   - 应统一为`seasons`数组字段

2. **缺少必要字段**
   - 缺少`user_id`字段，无法关联用户
   - 缺少`created_at`和`updated_at`时间戳字段
   - 缺少`is_public`字段，控制衣物是否公开

3. **数据关联方式**
   - 当前直接在衣物对象中包含`category`字符串，而不是使用`category_id`引用
   - 风格和季节数据直接嵌入在衣物对象中，而不是使用关联表

4. **数据来源**
   - 使用外部图片链接(picsum.photos)，存在加载和安全风险

### 2. 搭配数据 (outfitService.js)

#### 符合设计的部分
- 包含了基本的搭配信息，如标题、描述、图片等

#### 需要改进的部分
1. **字段命名不一致**
   - 使用`title`而不是`name`
   - 使用`desc`而不是`description`
   - 使用`tag`而不是`scene_id`

2. **缺少必要字段**
   - 缺少`id`、`user_id`、`is_public`等关键字段
   - 缺少`created_at`和`updated_at`时间戳字段

3. **数据关联方式**
   - 衣物数据以简化形式嵌入在搭配中，而不是使用关联表
   - 没有使用`position`字段标识衣物在搭配中的位置

4. **功能缺失**
   - 缺少根据场景筛选搭配的功能
   - 缺少搭配公开/私有设置

## 改进计划

### 1. 创建统一的mock数据管理模块

#### 目标
创建一个统一的mock数据管理模块，替代当前分散在多个文件中的mock数据，确保数据一致性和完整性。

#### 实现方案
1. 创建`src/mock/index.js`作为统一入口
2. 创建`src/mock/data/`目录存放各类数据
3. 创建`src/mock/api/`目录存放模拟API

#### 文件结构
```
src/mock/
├── index.js                 # 统一入口
├── data/
│   ├── users.js            # 用户数据
│   ├── categories.js       # 类别数据
│   ├── clothingItems.js    # 衣物数据
│   ├── seasons.js          # 季节数据
│   ├── styles.js           # 风格数据
│   ├── tags.js             # 标签数据
│   ├── scenes.js           # 场景数据
│   └── outfits.js          # 搭配数据
├── api/
│   ├── userApi.js         # 用户相关API
│   ├── wardrobeApi.js     # 衣柜相关API
│   └── outfitApi.js       # 搭配相关API
└── utils/
    ├── idGenerator.js     # ID生成器
    ├── dateGenerator.js   # 日期生成器
    └── imageGenerator.js  # 图片生成器
```

### 2. 重构衣物数据

#### 目标
根据数据结构设计文档重构衣物数据，确保字段命名一致，包含所有必要字段，并正确处理数据关联。

#### 实现方案
1. 创建`src/mock/data/clothingItems.js`文件
2. 使用数据结构设计文档中定义的字段
3. 使用ID引用替代嵌入数据
4. 添加时间戳和用户关联

#### 示例代码
```javascript
// src/mock/data/clothingItems.js
import { generateId } from '../utils/idGenerator.js';
import { generateDate } from '../utils/dateGenerator.js';
import { generateImageUrl } from '../utils/imageGenerator.js';

export const clothingItems = [
  {
    id: generateId(),
    user_id: 1, // 默认用户ID
    category_id: 1, // 上装类别ID
    name: '白色T恤',
    color: '#FFFFFF',
    image_url: generateImageUrl('tshirt', 'white'),
    brand: 'UNIQLO',
    material: '棉',
    purchase_date: generateDate({ monthsAgo: 3 }),
    last_worn: generateDate({ daysAgo: 5 }),
    wear_count: 8,
    favorite: true,
    created_at: generateDate({ monthsAgo: 3 }),
    updated_at: generateDate({ daysAgo: 1 })
  },
  // 更多衣物数据...
];

// 衣物季节关联数据
export const clothingItemSeasons = [
  {
    clothing_item_id: 1,
    season_id: 1 // 春季
  },
  {
    clothing_item_id: 1,
    season_id: 2 // 夏季
  },
  // 更多关联数据...
];

// 衣物风格关联数据
export const clothingItemStyles = [
  {
    clothing_item_id: 1,
    style_id: 1 // 休闲风格
  },
  // 更多关联数据...
];

// 衣物标签关联数据
export const clothingItemTags = [
  {
    clothing_item_id: 1,
    tag_id: 1 // 春季标签
  },
  {
    clothing_item_id: 1,
    tag_id: 5 // 休闲标签
  },
  // 更多关联数据...
];
```

### 3. 重构搭配数据

#### 目标
根据数据结构设计文档重构搭配数据，确保字段命名一致，包含所有必要字段，并正确处理数据关联。

#### 实现方案
1. 创建`src/mock/data/outfits.js`文件
2. 使用数据结构设计文档中定义的字段
3. 使用ID引用替代嵌入数据
4. 添加时间戳和用户关联

#### 示例代码
```javascript
// src/mock/data/outfits.js
import { generateId } from '../utils/idGenerator.js';
import { generateDate } from '../utils/dateGenerator.js';
import { generateImageUrl } from '../utils/imageGenerator.js';

export const outfits = [
  {
    id: generateId(),
    user_id: 1, // 默认用户ID
    name: '简约休闲风',
    description: '适合周末出行，舒适又时尚',
    scene_id: 2, // 周末休闲场景ID
    image_url: generateImageUrl('outfit', 'casual'),
    likes: 24,
    is_public: true,
    created_at: generateDate({ monthsAgo: 2 }),
    updated_at: generateDate({ daysAgo: 3 })
  },
  // 更多搭配数据...
];

// 搭配衣物关联数据
export const outfitItems = [
  {
    id: generateId(),
    outfit_id: 1,
    clothing_item_id: 1, // 白色T恤ID
    position: 1
  },
  {
    id: generateId(),
    outfit_id: 1,
    clothing_item_id: 2, // 牛仔裤ID
    position: 2
  },
  {
    id: generateId(),
    outfit_id: 1,
    clothing_item_id: 5, // 运动鞋ID
    position: 3
  },
  // 更多关联数据...
];

// 用户点赞搭配数据
export const outfitLikes = [
  {
    id: generateId(),
    user_id: 2, // 其他用户ID
    outfit_id: 1,
    created_at: generateDate({ daysAgo: 10 })
  },
  // 更多点赞数据...
];

// 用户收藏搭配数据
export const outfitFavorites = [
  {
    id: generateId(),
    user_id: 1, // 当前用户ID
    outfit_id: 1,
    created_at: generateDate({ daysAgo: 15 })
  },
  // 更多收藏数据...
];
```

### 4. 创建工具函数

#### 目标
创建工具函数，用于生成ID、日期和图片URL，确保mock数据的一致性和真实性。

#### 实现方案
1. 创建`src/mock/utils/idGenerator.js`文件
2. 创建`src/mock/utils/dateGenerator.js`文件
3. 创建`src/mock/utils/imageGenerator.js`文件

#### 示例代码
```javascript
// src/mock/utils/idGenerator.js
let currentId = 1;

export function generateId() {
  return currentId++;
}

export function resetIdGenerator() {
  currentId = 1;
}

// src/mock/utils/dateGenerator.js
export function generateDate(options = {}) {
  const { daysAgo = 0, monthsAgo = 0, yearsAgo = 0 } = options;
  const date = new Date();

  if (daysAgo) {
    date.setDate(date.getDate() - daysAgo);
  }

  if (monthsAgo) {
    date.setMonth(date.getMonth() - monthsAgo);
  }

  if (yearsAgo) {
    date.setFullYear(date.getFullYear() - yearsAgo);
  }

  return date.toISOString().split('T')[0]; // 返回YYYY-MM-DD格式
}

// src/mock/utils/imageGenerator.js
const imageSeeds = {
  tshirt: ['white', 'black', 'blue', 'red', 'green'],
  jeans: ['blue', 'black', 'grey', 'light'],
  shoes: ['sneaker', 'formal', 'sport', 'casual'],
  outfit: ['casual', 'formal', 'sport', 'business']
};

export function generateImageUrl(type, subtype) {
  if (imageSeeds[type] && imageSeeds[type].includes(subtype)) {
    return `/images/${type}_${subtype}.jpg`; // 使用本地图片
  }
  return `/images/${type}_default.jpg`; // 默认图片
}
```

### 5. 重构API模拟

#### 目标
根据数据结构设计文档重构API模拟，确保API返回的数据结构与数据库设计一致。

#### 实现方案
1. 创建`src/mock/api/wardrobeApi.js`文件
2. 创建`src/mock/api/outfitApi.js`文件
3. 使用统一的数据源和工具函数

#### 示例代码
```javascript
// src/mock/api/wardrobeApi.js
import { clothingItems, clothingItemSeasons, clothingItemStyles, clothingItemTags } from '../data/clothingItems.js';
import { categories } from '../data/categories.js';
import { seasons } from '../data/seasons.js';
import { styles } from '../data/styles.js';
import { tags } from '../data/tags.js';
import { delay } from '../utils/delay.js';

export const wardrobeAPI = {
  // 获取所有衣物类别
  async getCategories() {
    await delay(300); // 模拟网络延迟
    return { success: true, data: categories };
  },

  // 获取所有衣物
  async getClothingItems() {
    await delay(500);

    // 为每个衣物添加关联数据
    const itemsWithRelations = clothingItems.map(item => {
      const category = categories.find(c => c.id === item.category_id);

      // 获取季节
      const itemSeasons = clothingItemSeasons
        .filter(relation => relation.clothing_item_id === item.id)
        .map(relation => seasons.find(s => s.id === relation.season_id))
        .filter(Boolean);

      // 获取风格
      const itemStyles = clothingItemStyles
        .filter(relation => relation.clothing_item_id === item.id)
        .map(relation => styles.find(s => s.id === relation.style_id))
        .filter(Boolean);

      // 获取标签
      const itemTags = clothingItemTags
        .filter(relation => relation.clothing_item_id === item.id)
        .map(relation => tags.find(t => t.id === relation.tag_id))
        .filter(Boolean);

      return {
        ...item,
        category: category ? category.name : '未知类别',
        seasons: itemSeasons.map(s => s.name),
        styles: itemStyles.map(s => s.name),
        tags: itemTags.map(t => t.name)
      };
    });

    return { success: true, data: itemsWithRelations };
  },

  // 其他API方法...
};

// src/mock/api/outfitApi.js
import { outfits, outfitItems, outfitLikes, outfitFavorites } from '../data/outfits.js';
import { scenes } from '../data/scenes.js';
import { clothingItems } from '../data/clothingItems.js';
import { delay } from '../utils/delay.js';

export const outfitAPI = {
  // 获取所有搭配
  async getOutfits() {
    await delay(500);

    // 为每个搭配添加关联数据
    const outfitsWithRelations = outfits.map(outfit => {
      const scene = scenes.find(s => s.id === outfit.scene_id);

      // 获取搭配中的衣物
      const items = outfitItems
        .filter(relation => relation.outfit_id === outfit.id)
        .sort((a, b) => a.position - b.position)
        .map(relation => {
          const clothingItem = clothingItems.find(item => item.id === relation.clothing_item_id);
          return {
            id: relation.id,
            clothing_item: clothingItem,
            position: relation.position
          };
        });

      return {
        ...outfit,
        scene: scene ? scene.name : '未知场景',
        items: items
      };
    });

    return { success: true, data: outfitsWithRelations };
  },

  // 其他API方法...
};
```

## 实施计划

### 第一阶段：基础架构搭建
1. 创建mock数据管理模块的文件结构
2. 实现工具函数（ID生成器、日期生成器、图片生成器）
3. 创建基础数据（类别、季节、风格、标签、场景）

### 第二阶段：数据重构
1. 重构衣物数据，确保符合数据结构设计
2. 重构搭配数据，确保符合数据结构设计
3. 创建关联数据（衣物季节、衣物风格、衣物标签、搭配衣物等）

### 第三阶段：API模拟重构
1. 重构衣柜API，确保返回符合数据结构设计的数据
2. 重构搭配API，确保返回符合数据结构设计的数据
3. 添加新的API方法，支持更复杂的查询和操作

### 第四阶段：集成测试
1. 更新服务层代码，使用新的mock数据
2. 测试所有功能，确保数据一致性
3. 修复发现的问题

## 长期维护计划

1. **数据同步**：定期检查mock数据与数据结构设计文档的一致性
2. **功能扩展**：根据新功能需求，扩展mock数据和API
3. **性能优化**：优化mock数据的生成和查询，提高开发效率
4. **文档更新**：及时更新mock数据相关文档，确保文档与代码同步

## 总结

通过本改进计划，我们将建立一个与数据结构设计文档完全一致的mock数据系统，为后续开发提供可靠的数据支持。这不仅有助于提高开发效率，还能确保前后端数据结构的一致性，减少集成阶段的问题。

在后续开发中，我们将不断完善mock数据系统，使其更加贴近真实场景，为项目开发提供更好的支持。
