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
                        <h2 class="text-white">Followed By You</h2>
                        <div v-if="!followed.length" class="row mt-2 mt-md-4 justify-content-center" >
                            <div class="col-12 col-md-9">
                                <div class="text-white text-left friend-card">
                                    <h6>Noting to show now</h6>
                                </div>
                            </div>
                        </div>
                        <div
                            class="row mt-2 mt-md-4 justify-content-center"
                            v-for="result in followed"
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
                    <span
                        class="text-white font-weight-bold"
                        style="width: 88%; display: inline-block;font-size: 14px;"
                    >{{ result.user.firstName }} {{ result.user.lastName }}</span>
                                        <p class="posted">Since {{moment(result.createdDate).fromNow()}}</p>
                                        <button @click="unfollowUser(result)" class="edit-profile btn-danger">Un-Follow</button>
                                    </div>
                                </div>
                            </div>
                            <!--//Col-->
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
    import WidgetLeft from "../widgetleft.vue";
    export default {
        name:'profile_follow',
        components: { LeftMenu, TopBar, Widget, WidgetLeft },
        data() {
            return {
                username:'',
                User: "",
                user_data: "",
                alreadyFolloed: false,
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
            alreayFollowed(){
                this.axios.get(this.$servername + "/follows/getfollwers").then(response => {
                    this.followed = response.data;
                    //this.checkIfAlreadyFollow();
                });
            },unfollowUser(result){
                this.axios.post(this.$servername + "/follows/delete",{"user_id":result.user._id}).then(response => {
                this.alreayFollowed()
                });
            }
        },
        mounted() {
            this.User = this.$session.get("user_detail");
            this.alreayFollowed()
        }
    };
</script>

<style scoped>
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
        margin-top: -40px;
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
