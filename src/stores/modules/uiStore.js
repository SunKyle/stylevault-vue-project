
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    loading: false,
    loadingMessage: '加载中...',
    error: null,
    notification: null,
    sidebarOpen: false,
    theme: 'light', // 'light' 或 'dark'
    activeModal: null,
    modalProps: null,
    breadcrumbs: [],
    pageTitle: 'StyleVault'
  }),

  getters: {
    isLoading: (state) => state.loading,
    currentTheme: (state) => state.theme,
    hasError: (state) => !!state.error,
    hasNotification: (state) => !!state.notification,
    isSidebarOpen: (state) => state.sidebarOpen,
    getActiveModal: (state) => state.activeModal,
    getModalProps: (state) => state.modalProps,
    getBreadcrumbs: (state) => state.breadcrumbs,
    getPageTitle: (state) => state.pageTitle
  },

  actions: {
    // 设置加载状态
    setLoading(status, message = '加载中...') {
      this.loading = status
      this.loadingMessage = message
    },

    // 设置错误信息
    setError(error) {
      this.error = error
    },

    // 清除错误信息
    clearError() {
      this.error = null
    },

    // 显示通知
    showNotification(message, type = 'info', duration = 3000) {
      this.notification = { message, type }

      // 设置定时器自动清除通知
      if (duration > 0) {
        setTimeout(() => {
          this.clearNotification()
        }, duration)
      }
    },

    // 清除通知
    clearNotification() {
      this.notification = null
    },

    // 切换侧边栏
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    // 打开侧边栏
    openSidebar() {
      this.sidebarOpen = true
    },

    // 关闭侧边栏
    closeSidebar() {
      this.sidebarOpen = false
    },

    // 切换主题
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      // 应用主题到document元素，以便全局生效
      document.documentElement.setAttribute('data-theme', this.theme)
      // 保存主题偏好到本地存储
      localStorage.setItem('theme', this.theme)
    },

    // 设置主题
    setTheme(theme) {
      if (['light', 'dark'].includes(theme)) {
        this.theme = theme
        // 应用主题到document元素，以便全局生效
        document.documentElement.setAttribute('data-theme', this.theme)
        // 保存主题偏好到本地存储
        localStorage.setItem('theme', this.theme)
      }
    },

    // 从本地存储初始化主题
    initializeTheme() {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        this.setTheme(savedTheme)
      } else {
        // 默认使用系统偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.setTheme(prefersDark ? 'dark' : 'light')
      }
    },

    // 打开模态框
    openModal(modalName, props = {}) {
      this.activeModal = modalName
      this.modalProps = props
    },

    // 关闭模态框
    closeModal() {
      this.activeModal = null
      this.modalProps = null
    },

    // 设置面包屑
    setBreadcrumbs(breadcrumbs) {
      this.breadcrumbs = breadcrumbs
    },

    // 添加面包屑
    addBreadcrumb(crumb) {
      this.breadcrumbs.push(crumb)
    },

    // 清除面包屑
    clearBreadcrumbs() {
      this.breadcrumbs = []
    },

    // 设置页面标题
    setPageTitle(title) {
      this.pageTitle = title
      // 同时更新document的title
      document.title = `${title} - StyleVault`
    },

    // 初始化UI状态
    initializeUi() {
      // 初始化主题
      this.initializeTheme()

      // 监听系统主题变化
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e) => {
        // 只有当用户没有手动设置主题时才跟随系统
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light')
        }
      }

      // 添加监听器
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
      } else {
        // 兼容旧浏览器
        mediaQuery.addListener(handleChange)
      }

      // 页面加载时显示欢迎消息
      this.showNotification('欢迎使用 StyleVault！', 'success', 3000)
    },

    // 显示错误提示
    showErrorToast(message) {
      this.showNotification(message, 'error', 5000)
    },

    // 显示成功提示
    showSuccessToast(message) {
      this.showNotification(message, 'success', 3000)
    },

    // 显示警告提示
    showWarningToast(message) {
      this.showNotification(message, 'warning', 4000)
    },

    // 显示信息提示
    showInfoToast(message) {
      this.showNotification(message, 'info', 3000)
    }
  }
})
