<template>
    <div class="bgdark col-12">
        <div class="row">
            <div class="col-6 text-center">
                <i class="material-icons text-white">account_circle</i>
                <h6 class="text-white">
                    <router-link class="text-white" v-if="result"  :to="{ name: 'profile_view', params: {username: result.username } }" ><span>{{result.firstName}} {{result.lastName}}</span></router-link>
                </h6>
                <p class="px-2 px-2-xs text-white">
                    <strong>{{result.postCount}}  Posts, </strong>
                    <strong>{{result.followerCount}} Followers, </strong>
                    <strong>{{result.followingCount}} Following</strong>
                </p>
                 <el-tooltip placement="right">
                     <div slot="content">{{countGold(result.trophies)}} x Gold Trophy</div>
                     <span class="text-warning"><i class="material-icons"  style="color: gold;cursor: pointer">emoji_events</i></span>
                 </el-tooltip>
                 <el-tooltip placement="right">
                     <div slot="content">{{countSilver(result.trophies)}} x Silver Trophy</div>
                     <span class="text-warning"><i class="material-icons"  style="color: silver;cursor: pointer">emoji_events</i></span>
                 </el-tooltip>
                 <el-tooltip placement="right">
                     <div slot="content">{{countBronze(result.trophies)}} x Brown Trophy</div>
                     <span class="text-warning"><i class="material-icons"  style="color: saddlebrown;cursor: pointer">emoji_events</i></span>
                 </el-tooltip>
            </div>

            <div class="col-6 text-center">
                <p class="text-white" v-if="result.bio && result.bio !== null && result.bio !== 'null'">{{result.bio}}</p>
                <p class="text-white" v-if="!result.bio || result.bio == null || result.bio == 'null'"><br></p>

                <div class="clearfix"></div>
                <button v-if="checkIfAlreadyFollow(result)" @click="unfollowUser(result)" class="fs13 btn btn-xs btn-danger" style="padding: 0 5px;font-size: 11px">Un-Follow</button>
                <button v-if="!checkIfAlreadyFollow(result)" @click="followUser(result)" class="fs13 btn btn-xs btn-success" style="padding: 0 5px;font-size: 11px">Follow</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "user",
        components: {  },
        props: ['result'],
        data() {
            return {
                followed: [],
                numComment: 0,
                refreshCommentList: false,
            }
        },

        methods: {
            countGold(trophies) {
                let trophyCount = trophies.filter(value => value.trophy_type == 'gold')
                return trophyCount.length;
            },
            countSilver(trophies) {
                let trophyCount = trophies.filter(value => value.trophy_type == 'silver')
                return trophyCount.length;
            },
            countBronze(trophies) {
                let trophyCount = trophies.filter(value => value.trophy_type == 'bronze')
                return trophyCount.length;
            },
            checkIfAlreadyFollow(user){
                let folleweds = this.followed.filter(value => value.user._id == user._id)
                if(folleweds.length){
                    return true;
                }else{
                    return false;
                }
            },followUser(userData){
                this.axios.post(this.$servername + "/follows/addFollower",{"user_id":userData._id}).then(response => {
                    this.alreayFollowed()
                    //this.followed = response.data;
                });
            }, unfollowUser(userData){
                this.axios.post(this.$servername + "/follows/delete",{"user_id":userData._id}).then(response => {
                    this.alreayFollowed()
                });
            },alreayFollowed(){
                this.axios.get(this.$servername + "/follows/getfollwers").then(response => {
                    this.followed = response.data;
                });
            }
            /*afterListUpdated(params) {
                console.info('params after list updated: ', params);
                this.refreshCommentList = false
                this.numComment = params.numComments;
            },*/
        },
        mounted() {
            this.alreayFollowed();
        }
    }
</script>

<style scoped>
    .pxs{ font-size: 10px}
    .row.justify-content-center .col-md-9 {
        border: solid 1px #223e79;
        padding: 10px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.1);
    }
    .friend-card-head {
        position: absolute;
    }
    .friend-card-info {
        padding-left: 80px;
    }
    .add-btn {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 7px;
        padding: 5px 15px;
        color: #fff;
        border: none;
        cursor: pointer;
        outline: none !important;
    }
    .add-btn:hover {
        background: rgba(0, 0, 0, 0.7);
    }
    .row.m-t-20 {
        margin-top: 20px;
    }
    .m-t-20 {
        margin-top: 20px !important;
    }
    .search-filter input{
        background: rgba(0, 0, 0, 0.2);
        border: 0;
        padding: 10px 8px;
        color: #fff;
        border-radius: 7px;
        font-size: 14px;
        width: 300px;
    }
    .scroll-div{
        height: 75vh;
        overflow: auto;
    }
    /* width */
    .scroll-div::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    .scroll-div::-webkit-scrollbar-track {
        background: #0f234f;
    }

    /* Handle */
    .scroll-div::-webkit-scrollbar-thumb {
        background: #888;
    }

    /* Handle on hover */
    .scroll-div::-webkit-scrollbar-thumb:hover {
        background: #555;
    }


    .top-header * {
        color: #fff;
    }
    .current-user {
        position: relative;
        top: 6px;
    }
    .top-header .right-menus a {
        font-size: 24px;
    }
    .top-header .right-menus a i {
        position: relative;
        top: 8px;
    }
    .user-profile-circle {
        max-width: 26px;
        margin-right: 7px;
    }
    .search-filter {
        position: absolute;
        top: 0;
        left: 25%;
        margin: auto;
        display: inline-block;
    }
    .search-filter input {
        background: rgba(0, 0, 0, 0.2);
        border: 0;
        padding: 10px 8px;
        border-radius: 7px;
        font-size: 14px;
        width: 300px;
    }
    .search-filter select {
        background: rgba(0, 0, 0, 0.2);
        border: 0;
        padding: 10px 8px;
        border-radius: 7px;
        margin-left: 5px;
        font-size: 14px;
        width: 150px;
    }
    @media all and (max-width: 767px) {
        .current-user span {
            display: none;
        }
        .search-filter {
            display: none;
        }
        #nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #011237;
            z-index: 9;
        }
    }
    select {
        background: rgba(0, 0, 0, 0.2);
        border: 0;
        padding: 10px 8px;
        border-radius: 7px;
        margin-left: 5px;
        font-size: 14px;
        width: 150px;
        color: #fff;
    }.pull-right{
         float: right;
     }
</style>
