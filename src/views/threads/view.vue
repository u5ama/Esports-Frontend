<template>
    <div class="container-fluid py-0 px-0">
        <div class="mb-3 sticky-topbar">
            <TopBar></TopBar>
        </div>
        <div class="col-12 main-feed">
            <div class="row">
                <LeftMenu></LeftMenu>
                <div class="col-12 col-md-7 border-c py-3">
                    <div class="col-12">
                        <div class="detail-container text-white">
                            <div class="title-container font-weight-bold">
                                <div class=" float-left" v-text="thread.title"></div>
                                <div class="float-right" v-text="thread.createdDate"></div>
                            </div>
                            <div class="clearfix"></div>
                            <div class="media">
                                <img :src="$servername + '/image/threads/' + thread.image">
                            </div>
                            <p class="" v-text="thread.description"></p>
                        </div>
                    </div>


                    <div class="col-12">
                        <router-link :to="$route.path + '/start-discussion'" class="btn btn-success">Add Comment</router-link>
                    </div>
                    <!--<div class="col-12">
                        <button class="btn btn-success" v-if="hasJoined" @click="addComment = !addComment">Add Comment</button>
                        <div class="row mt-3 text-white">
                            <div class="col-12 mb-3" v-if="addComment">
                                <create-comment
                                    @commentAdded="getThread"
                                    type="thread"
                                    :data="{id: this.$route.params.threadId}"
                                >
                                </create-comment>
                            </div>
                            <div class="col-12">
                                <table class="table" v-if="comments.length">
                                    <tr v-for="comment in comments">
                                        <td>

                                        </td>
                                        <td v-text="comment.comment"></td>
                                    </tr>
                                </table>
                                <p class="text-info" v-else>No Comments exists for this Thread!</p>
                            </div>
                        </div>
                    </div>-->
                </div>
                <Widget></Widget>
            </div>
        </div>
    </div>
</template>

<script>
    import TopBar from "../topbar.vue";
    import LeftMenu from "../leftmenu.vue";
    import Widget from "../widget.vue";
    import createComment from '../comments/comment';

    export default {
        name: "detail",
        components: { LeftMenu, TopBar, Widget, createComment},
        data() {
            return {
                group : {},
                thread : {},
                comments : {},
                addComment: false,
                user: {},
            }
        },
        computed: {
            hasJoined() {
                if(Object.keys(this.group).length && this.group.members.length) {
                    let member = this.group.members.filter((member) => {
                        return member.user_id == this.user._id;
                    })

                    if(member.length > 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
                return false;
            }
        },
        methods: {
            getThread() {
                this.axios.get(this.$servername + '/threads/' + this.$route.params.threadId)
                    .then((response) => {
                        this.thread = response.data.data;
                        this.comments = this.thread.discussions;
                    })
                    .catch();
            }
        },
        mounted() {
            this.user = this.$session.get("user_detail");
            this.axios.get(this.$servername + '/groups/' + this.$route.params.id)
                .then((response) => {
                    this.group = response.data.data;
                })
                .catch(err => console.info('err here: ', err));

            this.getThread();
        }
    }
</script>

<style scoped>

</style>