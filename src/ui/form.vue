<style>
    .ui-form{
        border-top: 1px solid #e9e9e9;
        border-bottom: 1px solid #e9e9e9;
    }
    .ui-form .ui-field{
        border-top: 1px solid #e9e9e9;
    }
    .ui-form .ui-field:first-child{
        border-top: none;
    }
</style>

<template>
    <div class="ui-form">
        <slot></slot>
    </div>
</template>

<script>
    export default {
    }
</script>