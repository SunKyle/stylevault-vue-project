<template>
<ContentLayout>
<WardrobeSection @showUpload="$emit('showUpload')" />
</ContentLayout>
</template>
<script setup>
import WardrobeSection from '../components/features/wardrobe/WardrobeSection.vue';
import ContentLayout from '../components/common/layout/ContentLayout.vue';

defineEmits(['showUpload']);
</script>
