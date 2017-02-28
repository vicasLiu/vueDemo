<style scoped>
    .image{
        max-width: 100%;
    }
</style>
<template>
    <div :class="class">
        <image class="image" :src="src" :title="title" />
    </div>
</template>
<script>
    export default {
        props: {
            src: String,
            title: String,
            class: String
        }
    }
</script>