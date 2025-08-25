<template>
<div class="flex-grow pt-20 pb-20">
<WardrobeSection @showUpload="$emit('showUpload')" />
</div>
</template>
<script setup>
import WardrobeSection from '../components/features/wardrobe/WardrobeSection.vue';

defineEmits(['showUpload']);
</script>
