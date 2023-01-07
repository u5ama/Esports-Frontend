<template>
    <div class="container-fluid py-0 px-0">
        <div class="mb-3 sticky-topbar">
            <TopBar></TopBar>
        </div>
        <div class="col-12 main-feed">
            <div class="row">
                <WidgetLeft></WidgetLeft>
                <div class="col-12 col-md-5 border-c py-3">
                    <div class="col-12">
                        <div class="row">
                            <div class="col-12 cover-image">
                                <img class="img-fluid" src="@/assets/images/league-of-legends.jpg" />
                            </div>
                            <!--//Col-->
                        </div>
                        <!--//Row-->
                        <div class="row">
                            <div class="col-3 text-center over-top">
                                <img
                                    style="max-width:100%"
                                    class="rounded-circle img-fluid"
                                    src="@/assets/images/profile.jpg"
                                />
                            </div>
                            <!--//Col-->
                            <div class="col-9 text-white">
                                <h3 class="p-2">
                                    <router-link v-if="user_data" class="text-white" :to="{ name: 'profile_view', params: {username: user_data.username  } }" >{{ user_data.firstName }} {{ user_data.lastName }}</router-link>
                                    </h3>
                                <p class="px-2">
                                    <!--<pre>{{user_data}}</pre>-->
                                    <strong v-if="user_data">{{user_data.friends.length}} Friends</strong>,
                                    <strong>{{results.length}} Posts</strong>,
                                    <strong>12 Groups</strong>
                                </p>

                                <router-link to="/edit_profile" v-if="username == User['username']" class="edit-profile">Edit Profile</router-link>
                                <button v-if="username != User['username'] && alreadyFollowed == 'found'" @click="unfollowUser()" class="edit-profile btn-danger">Un-Follow</button>
                                <button v-if="username != User['username'] && alreadyFollowed != 'found'" @click="followUser()" class="edit-profile">Follow</button>


                            </div>
                            <!--//Col-->
                        </div>
                        <!--//Row-->
                        <div
                            class="row mt-2 mt-md-4 justify-content-center"
                            v-for="result in results"
                            v-bind:key="result.id"
                        >
                            <div class="col-12 col-md-11">
                                <div class="text-white text-left post-card">
                                    <div class="post-card-head">
                                        <img
                                            style="max-width:40px;padding:0"
                                            class="rounded-circle float-left"
                                            src="@/assets/images/league-logo.jpg"
                                        />
                                    </div>
                                    <div class="text-white text-left post-card-info">
                                        <router-link v-if="result.User"  :to="{ name: 'profile_view', params: {username: result.User.username } }" ><span
                                            class="text-white font-weight-bold class-helper-1"
                                        >{{ result.User.firstName }} {{ result.User.lastName }}</span></router-link>
                                        <p>{{ result.post_title }}...</p>
                                        <p class="posted">posted on {{moment(result.createdDate).fromNow()}}

                                        </p>
                                    </div>
                                </div>
                                <div class="post-image">
                                    <img class="img-fluid" src="@/assets/images/league-of-legends.jpg" />
                                </div>
                                <div class="post-footer">
                                    <div class="row">
                                        <div class="col-4 text-white">
                                            <div v-if="!result.likedByUser" class="text-white">
                                                <button @click="postLike(result)" class="text-white pt-3">
                                                    <i class="material-icons float-left mr-3">favorite_border</i>
                                                    <span><span v-if="result.likeCount">{{ result.likeCount }}</span> Like</span>
                                                </button>
                                            </div>
                                            <div v-if="result.likedByUser" class="text-white">
                                                <button @click="postDisLike(result)" class="text-white pt-3 text-danger" >
                                                    <i class="material-icons float-left mr-3">favorite_border</i>
                                                    <span><span v-if="result.likeCount">{{ result.likeCount }}</span> Like</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="col-4 text-center">
                                            <button class="text-white pt-3">
                                                <i class="material-icons float-left mr-3">mode_comment</i>
                                                <span>Comment</span>
                                            </button>
                                        </div>
                                        <div class="col-4 text-right">
                                            <button class="text-white pt-3">
                                                <i class="material-icons float-left mr-3">share</i>
                                                <span>Share</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--//Col-->
                        </div>
                        <!--//Row-->
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
    import WidgetLeft from "../widgetleft.vue";
    export default {
        name:'profile_view',
        components: { LeftMenu, TopBar, Widget, WidgetLeft },
        data() {
            return {
                username:'',
                User: "",
                user_data: "",
                alreadyFollowed: '',
                results: [],
                followed: []
            };
        },
        beforeCreate: function() {
            if (!this.$session.exists()) {
                this.$router.replace({ name: "login" });
            }else{
                if(!this.$session.get("user_detail")){
                    this.$router.replace({ name: "login" });
                }
            }
        },methods: {
            postDisLike(post) {
                this.axios.post(this.$servername + "/likes/deletepostlike",{post:post._id}).then(response => {
                    this.getMyPosts()
                }) .catch(error => {
                    this.isError = true;
                    return error;
                });
            },
            postLike(post) {
                this.axios.post(this.$servername + "/likes/createpostlike",{post:post._id}).then(response => {
                    this.getMyPosts()
                }) .catch(error => {
                    this.isError = true;
                    return error;
                });
            },
            getMyPosts(){
                this.$session.start();
                var user_detail = this.$session.get("user_detail");
                //
                this.axios.get(this.$servername + "/posts/user/"+this.$route.params.username).then(response => {
                    var arr = response.data;
                    arr.forEach(function(part, index) {
                        if(part.likes.length){
                            let obj = part.likes.find(o => o.user === user_detail._id);
                            this[index].likedByUser = obj;
                        }else{
                            this[index].likedByUser = false;
                        }
                    }, arr);
                    this.results = arr;
                });
            }, getByInfo(){
                this.axios.get(this.$servername + "/users/username/"+this.$route.params.username).then(response => {
                    this.user_data = response.data;
                });
            }, alreayFollowed(){
                this.axios.get(this.$servername + "/follows/getfollwers").then(response => {
                    this.followed = response.data;
                    this.checkIfAlreadyFollow();
                });
            }, checkIfAlreadyFollow(){
                let follewed = this.followed.filter(value => value.user._id == this.user_data._id)
                if(follewed.length){
                    this.alreadyFollowed = 'found';
                }else{
                    this.alreadyFollowed = '';
                }
            }, followUser(){
                this.axios.post(this.$servername + "/follows/addFollower",{"user_id":this.user_data._id}).then(response => {
                this.alreayFollowed()
                //this.followed = response.data;
                });
            }, unfollowUser(){
                this.axios.post(this.$servername + "/follows/delete",{"user_id":this.user_data._id}).then(response => {
                this.alreayFollowed()
                });
            }
        },
        mounted() {

            this.User = this.$session.get("user_detail");
            this.username = this.$route.params.username;
            this.getByInfo()
            this.getMyPosts()
            this.alreayFollowed()
        }
    };
</script>

<style scoped>
    .class-helper-1{
        width: 88%;
        display: inline-block;
        font-size: 14px;
    }
    #secure {
        background-color: #ffffff;
        border: 1px solid #cccccc;
        padding: 20px;
        margin-top: 10px;
    }
    .over-top {
        margin-top: -55px;
    }
    .edit-profile {
        cursor: pointer;
        color: #fff;
        font-size: 12px;
        background: #223e79;
        padding: 6px;
        border-radius: 5px;
        text-align: center;
        width: 90px;
        display: inline-block;
        float: right;
        margin-top: -60px;
    }
    .row.justify-content-center .col-md-11 {
        border: solid 1px #223e79;
        padding: 10px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.1);
    }
    .post-card-head {
        position: absolute;
    }
    .post-card-info {
        padding-left: 80px;
    }
    .cover-image {
        height: 250px;
        overflow: hidden;
    }
    .cover-image img {
        object-fit: cover;
    }
    @media all and (max-width: 767px) {
        .over-top {
            margin-top: 0;
        }
        .cover-image {
            height: auto;
            margin-bottom: 15px;
        }
        .edit-profile {
            position: static;
            float: none;
        }
    }
    .btn-danger {
        color: #fff;
        background-color: #dc3545 !IMPORTANT;
        border-color: #dc3545;
    }
</style>
