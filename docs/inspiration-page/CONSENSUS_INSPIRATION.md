# 灵感搭配页面需求共识文档

## 1. 需求描述

灵感搭配页面是StyleVault应用的核心功能之一，旨在为用户提供一个直观、高效的界面，用于浏览、创建和管理个人服装搭配方案。页面应支持用户从自己的衣橱中选择衣物进行搭配组合，并提供丰富的筛选、搜索和分类功能，帮助用户快速找到所需的搭配灵感。

### 1.1 核心功能

#### 1.1.1 搭配方案浏览
- 展示用户保存的所有搭配方案
- 支持分页加载更多搭配
- 显示搭配方案的基本信息（标题、缩略图、标签等）

#### 1.1.2 搭配方案管理
- 创建新的搭配方案
- 编辑现有搭配方案
- 删除不需要的搭配方案
- 为搭配方案添加分类和标签

#### 1.1.3 搭配创作
- 从用户衣橱中选择衣物进行搭配
- 支持多件衣物的组合
- 为搭配方案添加详细信息（标题、描述、场景、季节、风格等）

#### 1.1.4 筛选与搜索
- 按分类筛选搭配方案
- 按标签筛选搭配方案
- 按关键词搜索搭配方案
- 按场景、季节、风格等维度筛选

#### 1.1.5 分享功能
- 支持复制搭配方案链接
- 支持系统分享功能（如果浏览器支持）

## 2. 数据结构设计

### 2.1 衣物数据 (ClothingItem)

```typescript
interface ClothingItem {
  id: string;              // 唯一标识符
  name: string;            // 衣物名称
  type: string;            // 衣物类型（如：T恤、牛仔裤）
  category: string;        // 衣物类别（如：上装、下装、鞋履）
  brand?: string;          // 品牌
  color: string[];         // 颜色
  size: string;            // 尺寸
  material?: string;       // 材质
  season: string[];        // 适用季节
  style: string[];         // 风格
  scene: string[];         // 适用场景
  tags?: string[];         // 自定义标签
  imageUrl: string;        // 图片URL
  purchaseDate?: Date;     // 购买日期
  lastWornDate?: Date;     // 最近穿着日期
  createdAt: Date;         // 创建时间
  updatedAt: Date;         // 更新时间
}
```

### 2.2 搭配方案数据 (Outfit)

```typescript
interface Outfit {
  id: string;              // 唯一标识符
  title: string;           // 搭配标题
  description?: string;    // 搭配描述
  items: string[];         // 衣物ID列表
  thumbnailUrl?: string;   // 搭配缩略图
  category: string;        // 搭配类别
  tags: string[];          // 搭配标签
  scene: string[];         // 适用场景
  season: string[];        // 适用季节
  style: string[];         // 搭配风格
  likes: number;           // 点赞数
  isLiked: boolean;        // 当前用户是否点赞
  isPublic: boolean;       // 是否公开
  createdAt: Date;         // 创建时间
  updatedAt: Date;         // 更新时间
  userId: string;          // 所属用户ID
}
```

### 2.3 分类数据 (Category)

```typescript
interface Category {
  id: string;              // 唯一标识符
  name: string;            // 分类名称
  type: 'clothing' | 'outfit';  // 分类类型
  parentId?: string;       // 父分类ID（如果有层级关系）
  createdAt: Date;         // 创建时间
  updatedAt: Date;         // 更新时间
}
```

### 2.4 标签数据 (Tag)

```typescript
interface Tag {
  id: string;              // 唯一标识符
  name: string;            // 标签名称
  type: 'clothing' | 'outfit';  // 标签类型
  createdAt: Date;         // 创建时间
  updatedAt: Date;         // 更新时间
}
```

## 3. 后端API接口设计

### 3.1 搭配方案相关接口

#### 3.1.1 获取搭配方案列表
```
GET /api/outfits
```

**请求参数**：
- `page`: number - 页码（默认1）
- `pageSize`: number - 每页数量（默认12）
- `category`: string - 分类筛选
- `tags`: string[] - 标签筛选
- `search`: string - 搜索关键词
- `scene`: string[] - 场景筛选
- `season`: string[] - 季节筛选
- `style`: string[] - 风格筛选

**响应格式**：
```json
{
  "success": true,
  "data": {
    "outfits": Outfit[],
    "total": number,
    "page": number,
    "pageSize": number,
    "hasMore": boolean
  },
  "message": "获取搭配方案列表成功"
}
```

#### 3.1.2 获取搭配方案详情
```
GET /api/outfits/:id
```

**响应格式**：
```json
{
  "success": true,
  "data": Outfit,
  "message": "获取搭配方案详情成功"
}
```

#### 3.1.3 创建搭配方案
```
POST /api/outfits
```

**请求体**：
```json
{
  "title": string,
  "description": string,
  "items": string[],
  "category": string,
  "tags": string[],
  "scene": string[],
  "season": string[],
  "style": string[],
  "isPublic": boolean
}
```

**响应格式**：
```json
{
  "success": true,
  "data": Outfit,
  "message": "创建搭配方案成功"
}
```

#### 3.1.4 更新搭配方案
```
PUT /api/outfits/:id
```

**请求体**：同创建搭配方案

**响应格式**：同创建搭配方案

#### 3.1.5 删除搭配方案
```
DELETE /api/outfits/:id
```

**响应格式**：
```json
{
  "success": true,
  "data": null,
  "message": "删除搭配方案成功"
}
```

### 3.2 衣物相关接口

#### 3.2.1 获取衣物列表
```
GET /api/clothing
```

**请求参数**：
- `category`: string - 分类筛选
- `tags`: string[] - 标签筛选
- `search`: string - 搜索关键词

**响应格式**：
```json
{
  "success": true,
  "data": ClothingItem[],
  "message": "获取衣物列表成功"
}
```

### 3.3 分类与标签接口

#### 3.3.1 获取分类列表
```
GET /api/categories
```

**请求参数**：
- `type`: string - 分类类型（clothing/outfit）

**响应格式**：
```json
{
  "success": true,
  "data": Category[],
  "message": "获取分类列表成功"
}
```

#### 3.3.2 获取标签列表
```
GET /api/tags
```

**请求参数**：
- `type`: string - 标签类型（clothing/outfit）

**响应格式**：
```json
{
  "success": true,
  "data": Tag[],
  "message": "获取标签列表成功"
}
```

### 3.4 错误处理机制

所有API接口应返回统一的错误格式：

```json
{
  "success": false,
  "error": {
    "code": string,      // 错误代码
    "message": string,   // 错误信息
    "details?: any        // 错误详情
  }
}
```

常见错误代码：
- `INVALID_REQUEST`: 请求参数无效
- `UNAUTHORIZED`: 未授权访问
- `FORBIDDEN`: 禁止访问
- `NOT_FOUND`: 资源不存在
- `INTERNAL_ERROR`: 服务器内部错误

## 4. 前端与后端数据传递流程

### 4.1 数据获取流程

1. **页面加载时**：
   - 前端发送请求获取用户的搭配方案列表
   - 同时获取用户的衣橱衣物数据
   - 获取分类和标签数据用于筛选

2. **筛选/搜索时**：
   - 用户选择筛选条件或输入搜索关键词
   - 前端重新发送请求，带上相应的筛选参数
   - 后端根据参数返回过滤后的搭配方案

3. **查看详情时**：
   - 用户点击搭配方案
   - 前端发送请求获取该搭配方案的详细信息
   - 同时获取该搭配方案中包含的所有衣物详情

### 4.2 数据更新流程

1. **创建搭配方案**：
   - 用户选择衣物并填写搭配信息
   - 前端发送POST请求到后端
   - 后端创建搭配方案并返回结果
   - 前端更新本地状态并刷新列表

2. **编辑搭配方案**：
   - 用户修改搭配信息
   - 前端发送PUT请求到后端
   - 后端更新搭配方案并返回结果
   - 前端更新本地状态并刷新列表

3. **删除搭配方案**：
   - 用户确认删除搭配方案
   - 前端发送DELETE请求到后端
   - 后端删除搭配方案并返回结果
   - 前端更新本地状态并刷新列表

### 4.3 数据缓存策略

1. **衣物数据缓存**：
   - 首次加载时缓存到本地
   - 当衣橱数据更新时，重新获取并更新缓存

2. **搭配方案缓存**：
   - 分页加载的搭配方案缓存到本地
   - 支持下拉刷新清除缓存
   - 搭配方案详情不缓存，每次查看时重新获取

3. **分类与标签缓存**：
   - 首次加载时缓存到本地
   - 定期更新或在用户添加新分类/标签时更新

## 5. 状态管理方案

### 5.1 Pinia Store设计

创建`inspirationStore`管理灵感搭配页面的所有状态：

```typescript
// inspirationStore.js
export const useInspirationStore = defineStore('inspiration', () => {
  // 状态
  const outfits = ref([]);
  const filteredOutfits = ref([]);
  const selectedClothes = ref([]);
  const isLoading = ref(false);
  const filters = reactive({
    category: '全部',
    tags: [],
    search: '',
    scene: [],
    season: [],
    style: []
  });
  const pagination = reactive({
    page: 1,
    pageSize: 12,
    total: 0,
    hasMore: true
  });

  // 计算属性
  const visibleOutfits = computed(() => {
    return filteredOutfits.value;
  });

  // 动作
  const fetchOutfits = async () => {
    // 调用API获取搭配方案列表
  };

  const createOutfit = async (outfitData) => {
    // 调用API创建搭配方案
  };

  const updateOutfit = async (id, outfitData) => {
    // 调用API更新搭配方案
  };

  const deleteOutfit = async (id) => {
    // 调用API删除搭配方案
  };

  const setFilters = (newFilters) => {
    // 更新筛选条件
  };

  const resetFilters = () => {
    // 重置筛选条件
  };

  const toggleClothSelection = (clothId) => {
    // 切换衣物选择状态
  };

  return {
    // 状态
    outfits,
    filteredOutfits,
    selectedClothes,
    isLoading,
    filters,
    pagination,
    // 计算属性
    visibleOutfits,
    // 动作
    fetchOutfits,
    createOutfit,
    updateOutfit,
    deleteOutfit,
    setFilters,
    resetFilters,
    toggleClothSelection
  };
});
```

### 5.2 组件间数据流转

1. **页面组件** (`InspirationView`)
   - 负责整体页面布局
   - 调用store获取和管理数据
   - 传递数据给子组件

2. **搭配列表组件** (`SavedOutfits`)
   - 展示搭配方案列表
   - 处理分页加载
   - 触发查看、编辑、删除等操作

3. **搭配创建组件** (`OutfitCreator`)
   - 提供搭配创建界面
   - 从`clothingStore`获取衣物数据
   - 调用`inspirationStore`创建搭配

4. **筛选组件** (`OutfitFilters`)
   - 提供筛选和搜索功能
   - 更新`inspirationStore`中的筛选条件

## 6. 任务边界限制

### 6.1 功能范围
- ✅ 搭配方案的浏览与分页加载
- ✅ 搭配方案的创建、编辑与删除
- ✅ 基于衣橱衣物的搭配组合
- ✅ 搭配方案的分类与标签管理
- ✅ 搭配方案的搜索与筛选
- ✅ 搭配方案的分享功能
- ❌ 第三方搭配灵感推荐（本次不实现）
- ❌ 智能搭配算法（本次不实现）
- ❌ 搭配方案的点赞功能（本次不实现）

### 6.2 技术限制
- 前端使用Vue 3 + Vite + Pinia + TailwindCSS
- 后端使用RESTful API接口
- 数据缓存采用前端本地缓存
- 不涉及第三方服务集成

## 7. 验收标准

### 7.1 功能验收
1. 用户可以查看所有保存的搭配方案
2. 用户可以分页加载更多搭配方案
3. 用户可以创建新的搭配方案
4. 用户可以编辑和删除现有搭配方案
5. 用户可以从衣橱中选择衣物进行搭配
6. 用户可以使用筛选和搜索功能查找搭配方案
7. 用户可以分享搭配方案

### 7.2 性能验收
1. 页面加载时间不超过2秒
2. 数据请求响应时间不超过1秒
3. 分页加载流畅，无明显卡顿

### 7.3 兼容性验收
1. 支持主流浏览器（Chrome、Firefox、Safari、Edge）
2. 响应式设计，适配不同屏幕尺寸

## 8. 技术约束与集成方案

### 8.1 技术约束
- 前端必须使用Vue 3 Composition API
- 状态管理必须使用Pinia
- 样式必须使用TailwindCSS
- API请求必须使用Axios
- 代码必须遵循项目现有的ESLint和Prettier规范

### 8.2 集成方案
- 与现有`clothingStore`集成，获取用户衣橱数据
- 与现有`outfitStore`集成，管理搭配方案数据
- 与现有路由系统集成，确保页面导航正常
- 与现有认证系统集成，确保数据安全

---

**文档创建日期**：2023-10-01
**文档版本**：v1.0
**文档作者**：AI Assistant