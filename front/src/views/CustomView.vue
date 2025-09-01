<template>
  <PageLayout title="风格定制">
    <p class="text-gray-600 mb-4">在这里你可以定制自己的风格和搭配方案。</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FeatureCard title="风格偏好" description="设置你的个人风格偏好，我们将为你推荐合适的搭配。">
        <template #actions>
          <button class="text-primary hover:text-primary/80 font-medium">设置偏好</button>
        </template>
      </FeatureCard>
      <FeatureCard title="搭配方案" description="创建和保存你的个性化搭配方案。">
        <template #actions>
          <button class="text-primary hover:text-primary/80 font-medium">创建方案</button>
        </template>
      </FeatureCard>
    </div>
  </PageLayout>
</template>

<script setup>
  import PageLayout from '../components/layout/PageLayout.vue';
  import FeatureCard from '../components/ui/FeatureCard.vue';
</script>
