<template>
    <div class="row">
        <discussion-section/>
    </div>
</template>

<script>
    import DiscussionSection from "./DiscussionSection";

    export default {
        name: "DiscussionPanel",
        components: {DiscussionSection},
        data() {
            return {
                currThread : null,
                threadTitle: '',
                needRefresh : false
            }
        },
        computed: {
            backUrl() {
                return '/groups/' + this.$route.params.id + '/thread/' + this.$route.params.threadId;
            }
        },
        methods: {
            handleDiscussionRefreshed(val) {
                this.needRefresh = !val;
            },
            handleThreadClick(params) {
                this.currThread = params;
                this.threadTitle = params.title;
            },
        },
        mounted() {
        }
    }
</script>

<style scoped>

</style>