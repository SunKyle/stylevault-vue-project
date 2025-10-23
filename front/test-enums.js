// 简单的测试脚本来验证枚举数据获取
const fetch = require('node-fetch');

async function testEnumsApi() {
  try {
    console.log('测试后端枚举API...');
    const response = await fetch('http://localhost:3000/api/v1/enums/all');
    
    if (!response.ok) {
      console.error(`API请求失败: ${response.status}`);
      return;
    }
    
    const responseData = await response.json();
    console.log('API响应:', JSON.stringify(responseData, null, 2));
    
    // 从嵌套的data字段中获取枚举数据
    const data = responseData.data || responseData;
    
    // 检查关键枚举字段是否存在
    console.log('\n枚举字段检查:');
    console.log('categories:', Array.isArray(data.categories) ? `${data.categories.length} 个项目` : '不存在或格式错误');
    console.log('sizes:', Array.isArray(data.sizes) ? `${data.sizes.length} 个项目` : '不存在或格式错误');
    console.log('styles:', Array.isArray(data.styles) ? `${data.styles.length} 个项目` : '不存在或格式错误');
    console.log('colors:', Array.isArray(data.colors) ? `${data.colors.length} 个项目` : '不存在或格式错误');
    
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

testEnumsApi();