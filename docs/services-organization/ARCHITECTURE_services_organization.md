# 服务层架构图

## 1. 整体分层架构

```mermaid
graph TD
    subgraph "应用层"
        A1[Vue组件]
        A2[Pinia Stores]
    end

    subgraph "业务服务层"
        B1[clothingService.js]
    end

    subgraph "API适配器层"
        C1[authApi.js]
        C2[enumsApi.js]
        C3[clothingApi.js]
        C4[outfitApi.js]
        C5[outfitCreatorApi.js]
        C6[analyticsApi.js]
    end

    subgraph "通用工具层"
        D1[crudUtils.js]
        D2[localCalculations.js]
    end

    subgraph "基础配置层"
        E1[axiosConfig.js]
        E2[apiEndpoints.js]
        E3[apiClient.js]
    end

    A1 --> B1
    A1 --> C1
    A1 --> C2
    A2 --> B1
    A2 --> C3
    A2 --> C4
    A2 --> C6
    
    B1 --> C3
    B1 --> E3
    
    C1 --> E1
    C1 --> E2
    C2 --> E1
    C2 --> E2
    C3 --> E1
    C3 --> E2
    C3 --> D1
    C4 --> E1
    C4 --> E2
    C4 --> D1
    C5 --> E1
    C6 --> E1
    C6 --> E2
    C6 --> D2
    
    D1 --> E1
    D1 --> E2
    
    E3 --> E1
    E3 --> E2
    E3 --> D1
    E3 --> C1
    E3 --> C2
    E3 --> C3
    E3 --> C4
    E3 --> C5
    E3 --> C6
    E3 --> D2
```

## 2. API调用数据流

```mermaid
sequenceDiagram
    participant Component as Vue组件
    participant Store as Pinia Store
    participant Service as 业务服务层
    participant Api as API适配器
    participant Utils as 通用工具
    participant Axios as Axios客户端
    participant Server as 后端API

    alt 直接调用API
        Component->>Api: 调用API方法
        Store->>Api: 调用API方法
    else 通过业务服务调用
        Component->>Service: 调用业务方法
        Store->>Service: 调用业务方法
        Service->>Api: 调用API方法
    end
    
    alt 使用通用CRUD
        Api->>Utils: createApiService
        Utils-->>Api: 返回CRUD方法
    end
    
    Api->>Axios: 发起HTTP请求
    Axios->>Server: 发送请求
    Server-->>Axios: 返回响应
    Axios-->>Api: 处理响应/错误
    
    alt 降级计算（analytics）
        Api->>Utils: 本地计算
        Utils-->>Api: 返回计算结果
    end
    
    Api-->>Service: 返回数据
    Service-->>Component: 返回格式化数据
    Service-->>Store: 返回格式化数据
    Api-->>Component: 返回数据
    Api-->>Store: 返回数据
```

## 3. 文件分类关系图

```mermaid
graph TB
    subgraph "分类关系"
        Root[服务层 root]
        
        subgraph "基础配置层"
            Config[配置文件]
            Axios[axiosConfig.js]
            Endpoints[apiEndpoints.js]
            Client[apiClient.js]
        end
        
        subgraph "通用工具层"
            Utils[工具文件]
            Crud[crudUtils.js]
            LocalCalc[localCalculations.js]
        end
        
        subgraph "API适配器层"
            Apis[API适配器]
            Auth[authApi.js]
            Enums[enumsApi.js]
            Clothing[clothingApi.js]
            Outfit[outfitApi.js]
            Creator[outfitCreatorApi.js]
            Analytics[analyticsApi.js]
        end
        
        subgraph "业务服务层"
            Services[业务服务]
            ClothingService[clothingService.js]
        end
    end
    
    Root --> Config
    Root --> Utils
    Root --> Apis
    Root --> Services
    
    Config --> Axios
    Config --> Endpoints
    Config --> Client
    
    Utils --> Crud
    Utils --> LocalCalc
    
    Apis --> Auth
    Apis --> Enums
    Apis --> Clothing
    Apis --> Outfit
    Apis --> Creator
    Apis --> Analytics
    
    Services --> ClothingService
```

## 4. 依赖层次图

```mermaid
graph BT
    subgraph "依赖层次"
        Layer1[业务服务层] --> Layer2[API适配器层]
        Layer2 --> Layer3[通用工具层]
        Layer2 --> Layer4[基础配置层]
        Layer3 --> Layer4
    end
    
    subgraph "文件依赖关系"
        ClothingService --> ClothingApi
        ClothingService --> ApiClient
        
        AuthApi --> AxiosConfig
        AuthApi --> ApiEndpoints
        
        EnumsApi --> AxiosConfig
        EnumsApi --> ApiEndpoints
        
        ClothingApi --> AxiosConfig
        ClothingApi --> ApiEndpoints
        ClothingApi --> CrudUtils
        
        OutfitApi --> AxiosConfig
        OutfitApi --> ApiEndpoints
        OutfitApi --> CrudUtils
        
        CreatorApi --> AxiosConfig
        
        AnalyticsApi --> AxiosConfig
        AnalyticsApi --> ApiEndpoints
        AnalyticsApi --> LocalCalculations
        
        CrudUtils --> AxiosConfig
        CrudUtils --> ApiEndpoints
        
        ApiClient --> AxiosConfig
        ApiClient --> ApiEndpoints
        ApiClient --> CrudUtils
        ApiClient --> AuthApi
        ApiClient --> EnumsApi
        ApiClient --> ClothingApi
        ApiClient --> OutfitApi
        ApiClient --> CreatorApi
        ApiClient --> AnalyticsApi
        ApiClient --> LocalCalculations
    end
```

## 5. 服务层调用关系总结

- **基础配置层**：为所有上层提供基础设施，不依赖其他服务层文件
- **通用工具层**：依赖基础配置层，为API适配器层提供工具函数
- **API适配器层**：依赖基础配置层和通用工具层，为业务服务层和应用层提供API调用
- **业务服务层**：依赖API适配器层和apiClient，为应用层提供业务逻辑封装

这种分层设计确保了：
1. **关注点分离**：每一层专注于特定职责
2. **代码复用**：通过通用工具和基础配置实现代码共享
3. **易维护性**：修改特定层不会影响其他层
4. **扩展性**：可以轻松添加新的API适配器或业务服务