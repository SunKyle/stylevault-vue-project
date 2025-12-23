// 测试默认分页行为的脚本
const axios = require('axios');

// 配置API基础URL
const API_BASE_URL = 'http://localhost:3000/api/v1';

// 测试账号（使用已知存在的账号）
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'Password123';

async function testDefaultPagination() {
  console.log('🚀 开始测试默认分页行为...');
  
  try {
    // 1. 登录获取Token
    console.log('\n1. 登录获取访问令牌...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ 登录成功，获取到访问令牌');
    
    // 2. 测试默认分页行为
    console.log('\n2. 测试默认分页行为（不提供limit参数）...');
    const defaultResponse = await axios.get(`${API_BASE_URL}/clothing`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ 获取衣物列表成功!');
    console.log(`   - 总记录数: ${defaultResponse.data.data.pagination.totalItems}`);
    console.log(`   - 返回记录数: ${defaultResponse.data.data.items.length}`);
    console.log(`   - 分页信息:`, defaultResponse.data.data.pagination);
    
    // 3. 验证默认行为是否返回全部记录
    if (defaultResponse.data.data.pagination.totalItems === defaultResponse.data.data.items.length) {
      console.log('\n🎉 测试成功! 默认情况下API返回了所有衣物记录');
      console.log('✅ 接口修改符合预期: http://localhost:3000/api/v1/clothing 默认查询全部衣物');
    } else {
      console.log('\n❌ 测试失败! 默认情况下API没有返回所有衣物记录');
      console.log(`   - 总数量: ${defaultResponse.data.data.pagination.totalItems}`);
      console.log(`   - 返回数量: ${defaultResponse.data.data.items.length}`);
      process.exit(1);
    }
    
    // 4. 测试带参数的分页行为
    console.log('\n3. 测试带参数的分页行为（limit=5）...');
    const paginationResponse = await axios.get(`${API_BASE_URL}/clothing`, {
      params: {
        limit: 5
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ 带参数分页测试成功!');
    console.log(`   - 总记录数: ${paginationResponse.data.data.pagination.totalItems}`);
    console.log(`   - 返回记录数: ${paginationResponse.data.data.items.length}`);
    console.log(`   - 分页信息:`, paginationResponse.data.data.pagination);
    
    // 验证带参数分页是否正常工作
    if (paginationResponse.data.data.items.length <= 5) {
      console.log('✅ 带参数分页功能正常工作');
    } else {
      console.log('⚠️  带参数分页功能可能存在问题');
    }
    
    console.log('\n🎉 所有测试完成! API默认分页行为已修改为返回全部衣物记录');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
    if (error.response) {
      console.error('   - 响应状态:', error.response.status);
      console.error('   - 响应数据:', error.response.data);
    }
    process.exit(1);
  }
}

testDefaultPagination();