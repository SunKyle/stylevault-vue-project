// 测试clothingApi导入
try {
  // 测试命名导入是否正常工作
  import('/src/services/api/clothingApi.js')
    .then(module => {
      console.log('导入成功:', module.clothingApi);
    })
    .catch(error => {
      console.error('导入失败:', error);
    });
} catch (e) {
  console.error('测试导入发生错误:', e);
}
