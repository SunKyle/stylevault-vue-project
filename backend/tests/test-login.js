// 简单的登录API测试脚本
const http = require('http');

const testData = {
  email: 'test@example.com',
  password: 'Password123'
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('测试登录API...');
console.log('发送数据:', testData);

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('状态码:', res.statusCode);
    console.log('响应:', data);
  });
});

req.on('error', (error) => {
  console.error('请求错误:', error.message);
});

req.write(postData);
req.end();