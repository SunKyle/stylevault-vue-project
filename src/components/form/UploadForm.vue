<template>
  <div class="bg-white rounded-2xl shadow-medium p-6 md:p-8">
    <div class="mb-8">
      <h3 class="text-xl font-bold mb-2">添加新衣物</h3>
      <p class="text-neutral-500">上传衣物照片并填写详细信息，帮助系统更好地为你推荐搭配</p>
    </div>
    
    <!-- 图片上传区域 -->
    <div class="mb-8">
      <label class="block text-sm font-medium text-neutral-700 mb-3">衣物照片</label>
      <div class="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer bg-neutral-50">
        <div class="max-w-xs mx-auto">
          <div class="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <font-awesome-icon :icon="['fas', 'cloud-upload']" class="text-primary text-2xl" />
          </div>
          <h4 class="font-medium mb-1">点击上传或拖放图片</h4>
          <p class="text-sm text-neutral-500">支持 JPG、PNG 格式，建议尺寸 500×500</p>
        </div>
      </div>
    </div>
    
    <!-- 表单字段 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <label class="block text-sm font-medium text-neutral-700 mb-2">衣物名称</label>
        <input type="text" v-model="clothingItem.name" placeholder="例如：黑色修身牛仔裤" class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all">
      </div>
      
      <div>
        <label class="block text-sm font-medium text-neutral-700 mb-2">衣物类别</label>
        <select v-model="clothingItem.categoryId" class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none bg-white">
          <option value="">请选择类别</option>
          <option value="1">上装</option>
          <option value="2">下装</option>
          <option value="3">外套</option>
          <option value="4">鞋履</option>
          <option value="5">配饰</option>
          <option value="6">包包</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-neutral-700 mb-2">风格</label>
        <select v-model="clothingItem.style" class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none bg-white">
          <option value="">请选择风格</option>
          <option value="休闲">休闲</option>
          <option value="正式">正式</option>
          <option value="运动">运动</option>
          <option value="复古">复古</option>
          <option value="潮流">潮流</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-neutral-700 mb-2">适用季节</label>
        <select v-model="clothingItem.season" class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none bg-white">
          <option value="">请选择季节</option>
          <option value="春季">春季</option>
          <option value="夏季">夏季</option>
          <option value="秋季">秋季</option>
          <option value="冬季">冬季</option>
          <option value="四季">四季通用</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-neutral-700 mb-2">颜色</label>
        <input type="text" v-model="clothingItem.color" placeholder="例如：深蓝色" class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all">
      </div>
      
      <div>
        <label class="block text-sm font-medium text-neutral-700 mb-2">品牌（可选）</label>
        <input type="text" v-model="clothingItem.brand" placeholder="例如：优衣库" class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all">
      </div>
    </div>
    
    <div class="mb-8">
      <label class="block text-sm font-medium text-neutral-700 mb-2">备注（可选）</label>
      <textarea v-model="clothingItem.notes" rows="3" placeholder="添加关于这件衣物的更多信息..." class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none"></textarea>
    </div>
    
    <div class="flex justify-end space-x-4">
      <button @click="handleCancel" class="px-6 py-3 border border-neutral-200 rounded-xl text-neutral-700 font-medium hover:bg-neutral-50 transition-colors">
        取消
      </button>
      <button @click="saveClothes" class="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-soft">
        保存衣物
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useWardrobeStore } from "../../stores/wardrobeStore";
import { showToast } from '../../utils/toast';

const router = useRouter();
const wardrobeStore = useWardrobeStore();

// 表单数据
const clothingItem = reactive({
  name: "",
  categoryId: "",
  style: "",
  season: "",
  color: "",
  brand: "",
  notes: "",
  image: "https://picsum.photos/seed/clothing-item/300/400" // 默认图片
});

// 取消按钮处理函数
const handleCancel = () => {
  console.log("取消按钮被点击");
  // 使用window.location进行页面跳转
  window.location.href = "/";
  console.log("使用window.location跳转已执行");
};

const saveClothes = async () => {
  // 验证必填字段
  if (!clothingItem.name || !clothingItem.categoryId) {
    showToast("请填写衣物名称和类别", "error");
    return;
  }

  try {
    // 调用 store 方法保存衣物
    await wardrobeStore.addClothingItem(clothingItem);
    showToast("衣物添加成功", "success");

    // 清空表单
    clothingItem.name = "";
    clothingItem.categoryId = "";
    clothingItem.style = "";
    clothingItem.season = "";
    clothingItem.color = "";
    clothingItem.brand = "";
    clothingItem.notes = "";

    // 2秒后返回衣橱页面
    setTimeout(() => {
      router.push({ name: "wardrobe" });
    }, 2000);
  } catch (error) {
    showToast("添加失败，请重试", "error");
    console.error("添加衣物失败:", error);
  }
};
</script>