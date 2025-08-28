<template>
<ContentLayout>
<WardrobeSection @showUpload="$emit('showUpload')" />
</ContentLayout>
</template>
<script setup>
import WardrobeSection from '../components/wardrobe/WardrobeSection.vue';
import ContentLayout from '../components/layout/ContentLayout.vue';

defineEmits(['showUpload']);
</script>
