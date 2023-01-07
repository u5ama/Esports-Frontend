<template>
    <div class="row">
        <div class="col-md-12" id="chat-container" :style="containerHeight">
            <div class="row comment-container" v-if="discussions.length != 0" v-for="comment in discussions">
                <div class="col-md-12 comment">
                    <div class="row">
                        <div class="col-md-1">
                            <img src="@/assets/images/profile.jpg" class="user-profile-circle rounded-circle">
                        </div>
                        <div class="col-md-11 text-left">
                            <div class="row">
                                <div class="col-md-12">
                                    {{comment.createdDate | formatDate}}
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    {{comment.comment}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row comment-container" v-else>
                <div class="col-md-12 comment">Be the first to start discussion on this thread !</div></div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        name: "Discussions",
        props: ['currThread', 'needRefresh', 'mode'],
        data() {
            return {
                discussions: {}
            }
        },

        computed: {
            containerHeight() {
                return (this.mode == 'widget') ? 'height: 200px;' : 'height: 476px;';
            }
        },
        filters: {
            formatDate(value) {
                return moment(value).fromNow();
            }
        },
        watch: {
            needRefresh(val) {
                if (val) {
                    this.getThread();
                    this.$emit('discussionRefreshed', true);
                }
            },
            currThread(val) {
                if (val) {
                    this.getThread();
                }
            }
        },
        methods: {
            getThread() {
                if (this.currThread) {
                    this.axios.get(this.$servername + '/threads/' + this.currThread.threadId)
                        .then((response) => {
                            this.discussions = response.data.data.discussions;
                            let chatContainer = document.getElementById("chat-container");
                            $(chatContainer).stop().animate({ scrollTop: $(chatContainer)[0].scrollHeight}, 1000);
                        })
                        .catch(err => {});
                }
            }
        },
        mounted() {
            this.getThread();
        }

    }
</script>

<style scoped>
    #chat-container {
        border-top: solid 1px #223e79;
        padding: 10px;
        overflow: hidden;
        overflow-y: scroll;
        scrollbar-width: thin;
    }

    .comment-container {
        padding: 0px 10px;
    }

    .comment {
        border: solid 1px #223e79;
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 10px;
        overflow-wrap: break-word;
    }

    .user-profile-circle {
        max-width: 26px;
        margin-right: 7px;
    }

    /* width */
    ::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #051b4a;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

</style>