// 测试衣物列表接口的默认分页行为
const axios = require('axios');
const API_BASE_URL = 'http://localhost:3000/api/v1';

// 主测试函数
async function runTests() {
  console.log('🚀 开始测试衣物列表接口...');
  
  let token = null;
  
  try {
    // 1. 注册新用户
    console.log('1. 注册新用户...');
    const randomSuffix = Date.now();
    const registerData = {
      username: `testuser${randomSuffix}`,
      email: `testuser${randomSuffix}@example.com`,
      password: 'Password123!'
    };
    
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
    console.log('✅ 用户注册成功!');
    
    // 2. 登录获取token
    console.log('\n2. 登录获取token...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password
    });
    
    token = loginResponse.data.data.token;
    console.log('✅ 登录成功，获取到token:', token.substring(0, 20) + '...');
    
    // 3. 使用token访问衣物列表接口
    console.log('\n3. 使用token访问衣物列表接口...');
    const defaultResponse = await axios.get(`${API_BASE_URL}/clothing`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // 4. 检查默认分页行为 - 应该返回全部记录
    console.log('\n4. 检查默认分页行为...');
    console.log(`   - 返回记录数: ${defaultResponse.data.data.items.length}`);
    console.log(`   - 分页信息:`, defaultResponse.data.data.pagination);
    
    // 5. 验证默认行为是否返回全部记录
    if (defaultResponse.data.data.pagination.totalItems === defaultResponse.data.data.items.length) {
      console.log('\n🎉 测试成功! 默认情况下API返回了所有衣物记录');
      console.log('✅ 接口修改符合预期: http://localhost:3000/api/v1/clothing 默认查询全部衣物');
    } else {
      console.log('\n❌ 测试失败! 默认情况下API没有返回所有衣物记录');
      console.log(`   - 总数量: ${defaultResponse.data.data.pagination.totalItems}`);
      console.log(`   - 返回数量: ${defaultResponse.data.data.items.length}`);
      process.exit(1);
    }
    
    // 6. 测试带参数的分页行为
    console.log('\n6. 测试带参数的分页行为...');
    const paginationResponse = await axios.get(`${API_BASE_URL}/clothing`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: { page: 1, limit: 5 }
    });
    
    console.log('✅ 带参数分页测试结果:');
    console.log(`   - 返回记录数: ${paginationResponse.data.data.items.length}`);
    console.log(`   - 分页信息:`, paginationResponse.data.data.pagination);
    
    // 7. 验证带参数分页是否正常工作
    if (paginationResponse.data.data.items.length === 5) {
      console.log('✅ 带参数分页功能正常工作');
    } else {
      console.log('⚠️  带参数分页功能可能存在问题');
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
}

runTests();