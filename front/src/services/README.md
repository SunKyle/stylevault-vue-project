# 服务层结构说明

本文档详细说明StyleVault项目服务层的组织结构、职责划分和文件说明。

## 目录结构

```
services/
├── core/              # 核心配置和基础功能
├── utils/             # 通用工具函数
├── api/               # API适配器层
├── business/          # 业务服务层
└── apiClient.js       # API客户端主入口
```

## 各层职责说明

### 1. core/ - 核心配置层
负责项目的核心配置、基础设置和共享常量。

**文件说明：**
- `axiosConfig.js`: Axios实例配置，包含拦截器、基础URL等
- `apiEndpoints.js`: API端点常量定义

### 2. utils/ - 通用工具层
提供跨服务的通用功能和辅助方法。

**文件说明：**
- `crudUtils.js`: 通用CRUD操作方法
- `localCalculations.js`: 本地计算相关工具函数

### 3. api/ - API适配器层
直接与后端API通信的接口层，封装具体的API调用。

**文件说明：**
- `authApi.js`: 认证相关API
- `clothingApi.js`: 衣物相关API
- `outfitApi.js`: 搭配相关API
- `outfitCreatorApi.js`: 搭配创建器API
- `enumsApi.js`: 枚举数据API
- `analyticsApi.js`: 分析数据API

### 4. business/ - 业务服务层
封装业务逻辑，处理数据转换和业务规则。

**文件说明：**
- `clothingService.js`: 衣物业务服务
- `outfitCreatorService.js`: 搭配创建器业务服务

## 使用说明

### 导入方式

```javascript
// 导入业务服务（推荐）
import { clothingService } from '@/services/business/clothingService';

// 导入API（仅在特殊需要时）
import { clothingApi } from '@/services/apiClient';
```

### 服务调用流程

1. **组件层** -> 调用 -> **业务服务层**
2. **业务服务层** -> 调用 -> **API适配器层**
3. **API适配器层** -> 使用 -> **核心配置层** 和 **通用工具层**

## 最佳实践

- 始终通过业务服务层调用API，避免在组件中直接调用API
- 业务逻辑应集中在业务服务层处理
- API层应保持简洁，只负责请求封装
- 通用功能抽象到utils层
- 配置和常量集中在core层

## 更新日志

- 2025-11-24: 重构服务层结构，建立分层架构