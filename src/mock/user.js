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

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟用户API服务
export const userAPI = {
  // 用户登录
  login: async (credentials) => {
    await delay(500) // 模拟网络延迟
    const { username, password } = credentials
    
    // 简单的验证逻辑
    if (username === "stylefan" && password === "password") {
      const user = users[0]
      // 生成模拟token
      const token = "mock-jwt-token-" + Math.random().toString(36).substring(2)
      
      return {
        success: true,
        data: {
          user,
          token
        }
      }
    } else {
      return {
        success: false,
        message: "用户名或密码错误"
      }
    }
  },

  // 用户注册
  register: async (userData) => {
    await delay(800) // 模拟网络延迟
    const { username, email, password } = userData
    
    // 检查用户名是否已存在
    if (users.some(user => user.username === username)) {
      return {
        success: false,
        message: "用户名已存在"
      }
    }
    
    // 检查邮箱是否已存在
    if (users.some(user => user.email === email)) {
      return {
        success: false,
        message: "邮箱已被注册"
      }
    }
    
    // 创建新用户
    const newUser = {
      id: users.length + 1,
      username,
      email,
      nickname: userData.nickname || username,
      avatar: "https://picsum.photos/seed/user" + (users.length + 1) + "/200/200",
      bio: userData.bio || "",
      preferences: {
        favoriteStyles: [],
        favoriteColors: [],
        preferredSeasons: []
      },
      stats: {
        totalItems: 0,
        totalOutfits: 0,
        favoriteItems: 0,
        itemsWornThisMonth: 0
      },
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: new Date().toISOString().split("T")[0]
    }
    
    users.push(newUser)
    
    // 生成模拟token
    const token = "mock-jwt-token-" + Math.random().toString(36).substring(2)
    
    return {
      success: true,
      data: {
        user: newUser,
        token
      }
    }
  },

  // 获取用户信息
  getUserProfile: async (userId) => {
    await delay(300) // 模拟网络延迟
    const user = users.find(u => u.id === userId)
    
    if (user) {
      return {
        success: true,
        data: user
      }
    } else {
      return {
        success: false,
        message: "用户不存在"
      }
    }
  },

  // 更新用户信息
  updateUserProfile: async (userId, updates) => {
    await delay(400) // 模拟网络延迟
    const index = users.findIndex(u => u.id === userId)
    
    if (index !== -1) {
      users[index] = { ...users[index], ...updates }
      return {
        success: true,
        data: users[index]
      }
    } else {
      return {
        success: false,
        message: "用户不存在"
      }
    }
  },

  // 更新用户偏好设置
  updateUserPreferences: async (userId, preferences) => {
    await delay(400) // 模拟网络延迟
    const index = users.findIndex(u => u.id === userId)
    
    if (index !== -1) {
      users[index].preferences = { ...users[index].preferences, ...preferences }
      return {
        success: true,
        data: users[index].preferences
      }
    } else {
      return {
        success: false,
        message: "用户不存在"
      }
    }
  }
}