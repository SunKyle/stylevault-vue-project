// 衣物添加功能测试脚本
// 在浏览器控制台中运行此脚本来验证修复效果

console.log('=== 衣物添加功能测试开始 ===');

// 测试用例1: 小图片上传
async function testSmallImageUpload() {
    console.log('📸 测试小图片上传...');
    
    // 创建一个小的测试图片
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(0, 0, 100, 100);
    
    canvas.toBlob(async (blob) => {
        const file = new File([blob], 'test-small.jpg', { type: 'image/jpeg' });
        console.log('文件大小:', file.size, '字节');
        
        // 模拟文件上传
        const dataUrl = await readFileAsDataURL(file);
        console.log('DataURL长度:', dataUrl.length);
        
        if (dataUrl.length > 255) {
            console.log('✅ 长度超过255，应使用占位符URL');
        } else {
            console.log('✅ 长度在限制范围内');
        }
    });
}

// 测试用例2: 大图片上传
async function testLargeImageUpload() {
    console.log('📸 测试大图片上传...');
    
    // 创建一个大测试图片
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#4ecdc4';
    ctx.fillRect(0, 0, 1000, 1000);
    
    canvas.toBlob(async (blob) => {
        const file = new File([blob], 'test-large.jpg', { type: 'image/jpeg' });
        console.log('文件大小:', file.size, '字节');
        
        const dataUrl = await readFileAsDataURL(file);
        console.log('DataURL长度:', dataUrl.length);
        
        if (dataUrl.length > 255) {
            console.log('✅ 长度超过255，应使用占位符URL');
        } else {
            console.log('⚠️ 长度在限制范围内');
        }
    });
}

// 测试用例3: 验证表单提交数据
function testFormSubmission() {
    console.log('📝 测试表单提交数据...');
    
    // 获取Vue组件实例
    const editorComponent = document.querySelector('[class*="clothing-item-editor"]');
    if (editorComponent && editorComponent.__vueParentComponent) {
        const vm = editorComponent.__vueParentComponent.ctx;
        
        if (vm.form) {
            console.log('表单数据:', {
                name: vm.form.name,
                category: vm.form.category,
                seasons: vm.form.seasons,
                image: vm.form.image ? vm.form.image.substring(0, 50) + '...' : null
            });
            
            // 模拟提交
            const submitData = {
                name: vm.form.name,
                category: vm.form.category,
                seasons: vm.form.seasons,
                mainImageUrl: vm.form.image || ''
            };
            
            console.log('提交数据:', submitData);
            console.log('mainImageUrl长度:', submitData.mainImageUrl.length);
            
            if (submitData.mainImageUrl.length > 255) {
                console.log('⚠️ 需要处理URL长度');
            } else {
                console.log('✅ URL长度正常');
            }
        }
    }
}

// 辅助函数：读取文件为DataURL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 运行测试
console.log('🚀 开始运行衣物添加功能测试...');
testSmallImageUpload();
testLargeImageUpload();

// 等待页面加载完成后测试表单
setTimeout(() => {
    testFormSubmission();
    console.log('=== 测试完成 ===');
}, 2000);

// 使用方法：
// 1. 打开 http://localhost:8080
// 2. 按F12打开开发者工具
// 3. 切换到Console标签
// 4. 粘贴此脚本并回车运行