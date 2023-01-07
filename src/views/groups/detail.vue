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
                                <div class=" float-left" v-text="group.name"></div>
                                <div class="float-right" v-text="group.createdDate"></div>
                            </div>
                            <div class="clearfix"></div>
                            <div class="media">
                                <img :src="$servername + '/image/groups/' + group.image">
                            </div>
                            <p class="" v-text="group.description"></p>
                        </div>

                    </div>

                    <div class="col-12">
                        <router-link class="btn btn-success" :to="'/groups/' + group._id + '/thread'" v-if="hasJoined">Create Thread</router-link>
                        <div class="row mt-3 text-white">
                            <div class="col-12">
                                <table class="table" v-if="threads.length">
                                    <tr>
                                        <th>Title</th>
                                        <th>Content</th>
                                        <th># Comments</th>
                                    </tr>
                                    <tr v-for="thread in threads">
                                        <td>
                                            <router-link :to="'/groups/' + $route.params.id + '/thread/' + thread._id" v-text="thread.title"></router-link>
                                        </td>
                                        <td v-text="thread.description"></td>
                                        <td v-text="thread.discussions.length"></td>
                                    </tr>
                                </table>
                                <p class="text-info" v-else>No threads exists for this group!</p>
                            </div>
                        </div>
                    </div>
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

    export default {
        name: "detail",
        components: { LeftMenu, TopBar, Widget},
        data() {
            return {
                group : {},
                threads : {},
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
        },beforeCreate: function() {
            if (!this.$session.exists()) {
                this.$router.replace({ name: "login" });
            }else{
                if(!this.$session.get("user_detail")){
                    this.$router.replace({ name: "login" });
                }
            }
        },
        mounted() {
            this.user = this.$session.get("user_detail");
            this.axios.get(this.$servername + '/groups/' + this.$route.params.id)
                .then((response) => {
                    this.group = response.data.data;
                })
                .catch();


            this.axios.get(this.$servername + '/groups/threads/' + this.$route.params.id)
                .then((response) => {
                    this.threads = response.data.data;
                })
                .catch();

        }
    }
</script>

<style scoped>

    .media img {
        width: 100%;
    }
</style>
