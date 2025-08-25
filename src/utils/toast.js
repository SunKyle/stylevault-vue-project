export const showToast = (message, type = 'info') => {
  // 创建toast元素
  const toast = document.createElement('div');
  
  // 设置样式
  toast.className = `fixed top-24 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-strong z-50 transition-all duration-300 flex items-center space-x-2`;
  
  // 根据类型设置不同的样式
  switch(type) {
    case 'success':
      toast.classList.add('bg-green-50', 'text-green-600', 'border', 'border-green-200');
      toast.innerHTML = '<i class="fa fa-check-circle"></i><span>' + message + '</span>';
      break;
    case 'error':
      toast.classList.add('bg-red-50', 'text-red-600', 'border', 'border-red-200');
      toast.innerHTML = '<i class="fa fa-exclamation-circle"></i><span>' + message + '</span>';
      break;
    case 'warning':
      toast.classList.add('bg-yellow-50', 'text-yellow-600', 'border', 'border-yellow-200');
      toast.innerHTML = '<i class="fa fa-exclamation-triangle"></i><span>' + message + '</span>';
      break;
    default:
      toast.classList.add('bg-blue-50', 'text-blue-600', 'border', 'border-blue-200');
      toast.innerHTML = '<i class="fa fa-info-circle"></i><span>' + message + '</span>';
  }
  
  // 添加到页面
  document.body.appendChild(toast);
  
  // 显示动画
  setTimeout(() => {
    toast.classList.add('opacity-100');
    toast.classList.remove('opacity-0');
  }, 10);
  
  // 3秒后移除
  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};
