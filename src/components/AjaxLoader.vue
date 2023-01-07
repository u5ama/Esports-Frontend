<template>
  <div class="vld-parent">
    <loading :active.sync="isLoading"
             :width="128"
             :height="128"
             color="#3056aa"
             :is-full-page="fullPage"></loading>
  </div>
</template>

<script>
    // Import component
    import Loading from 'vue-loading-overlay';
    // Import stylesheet
    import 'vue-loading-overlay/dist/vue-loading.css';
    export default {
        name: "AjaxLoader",
        props: ['isLoading'],
        components: {
            Loading
        },
        data() {
            return {
                fullPage: true
            }
        }
    }
</script>

<style scoped>

</style>