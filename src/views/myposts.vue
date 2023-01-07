<template>
    <div class="container-fluid py-0 px-0">
        <div class="col-12 main-feed">
            <div class="row">
               <!-- <WidgetLeft></WidgetLeft>-->
                <div v-if="search_q.length >= 3" class="col-12 col-md-12 border-c py-3">
<!--
                    <p class="text-white" v-if="GlobalSearchResult.users">Found Result: User {{GlobalSearchResult.users.length}}, Post {{GlobalSearchResult.posts.length}}, Group {{GlobalSearchResult.groups.length}}</p>
-->
                    <p class="text-white" v-if="GlobalSearchResult.users">Found Result: User {{GlobalSearchResult.users.length}}</p>
                    <div v-if="GlobalSearchResult.posts.length" class="col-12">
                        <div class="row mt-2 mt-md-4 justify-content-center"
                             v-for="result in GlobalSearchResult.posts"
                             v-bind:key="result.id" >
                            <post-component :postData="result"></post-component>
                        </div>
                    </div>
                    <div v-if="GlobalSearchResult.groups.length" class="col-12">
                        <div class="row" >
                            <group v-for="(grp, index) in GlobalSearchResult.groups" :group="grp"
                                   :id="'group-' + grp._id"
                                   draggable="true"
                                   :iterator="index + 1"
                                   container-class="col-md-6"
                                   @groupSubscription="getList"></group>
                        </div>
                    </div>
                    <div v-if="GlobalSearchResult.users.length" class="col-12">
                        <div class="row mt-2 mt-md-4 justify-content-center"
                             v-for="result in GlobalSearchResult.users"
                             v-bind:key="result.id" >
                            <user :result="result"></user>
                        </div>
                    </div>
                </div>
                <div v-if="search_q.length < 3" class="col-12 col-md-12 border-c py-3">
                    <div class="row scroll-div">
                    <div class="col-12">
                        <div class="row">
                            <div class="col-12 cover-image">
                                <img style="max-width: 1900px;height: 500px;" class="img-fluid" :src="$servername + '/image/users/'+User['coverImage']" @error="useSampleCover" />
                            </div>
                        </div>
                        <!--//Row-->
                        <div class="row">
                            <div class="col-3 text-center over-top">
                                <span>
                                  <img style="max-width:100%" class="rounded-circle img-fluid" :src="$servername + '/image/users/'+User['profileImage']" @error="useSample" />
                                </span>
                            </div>
                            <!--//Col-->
                            <div class="col-9 text-white">
                                <h3 class="p-2">
                                    <router-link v-if="User" class="text-white" :to="{ name: 'profile_view', params: {username: User['username'] } }" >{{ User['firstName'] }} {{ User['lastName'] }}</router-link>
                                </h3>
                                <p class="px-2">
                                    <strong v-if="User">{{User.friends.length}} Friends</strong>,
                                    <strong>{{results.length}} Posts</strong>,
                                    <strong>12 Groups</strong>
                                </p>
                                <router-link to="/edit_profile" class="edit-profile">Edit Profile</router-link>
                            </div>
                            <!--//Col-->
                        </div>
                        <!--//Row-->
                        <div class="row" style="height: max-content">
                            <div class="col col-4 col-md-4 col-sm-12" >
                            </div>
                            <div class="col col-4 col-md-4 col-sm-12" >
                                <div class="search-filter">
                                    <p class="text-white">Search:</p>
                                    <form  v-on:submit.prevent>
                                        <div class="search">
                                            <input type="text" class="text-white" value placeholder="Type Search Keywords" v-model="q" />
                                        </div>
                                    </form>
                                </div>
                                <!--//Search-fitlter-->
                            </div>
                            <div class="col col-4 col-md-4 col-sm-12" >
                                <p class="text-white">Filter:</p>
                                <div class="search">
                                    <select v-model="sort_by" @change="searchFilterSelect" style="-webkit-appearance:none !important;">
                                        <option value="all_users">All</option>
                                        <option value="last_week">Recent</option>
                                        <option value="last_month">Last Month</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-2 col-md-2">
                                <div class="col-12 col-md-1 left-icon-menus">
                                    <ul>
                                        <li>
                                            <i class="material-icons" v-on:click="dashboard()">dashboard</i>
                                        </li>
                                        <li>
                                            <i class="material-icons" v-on:click="game()">perm_identity</i>
                                        </li>
                                        <li>
                                            <i class="material-icons" v-on:click="videos()">play_circle_outline</i>
                                        </li>
                                        <li>
                                            <i class="material-icons" v-on:click="chats()">tab</i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-10 col-md-10">
                                <div
                                        class="row mt-2 mt-md-4 justify-content-center scroll-div1"
                                        v-for="result in results"
                                        v-bind:key="result.id"
                                        v-show="postdiv"
                                >
                                    <div class="col-12 col-md-12" >
                                        <div class="text-white text-left post-card">
                                            <div class="post-card-head">
                                                <img style="max-width:40px;padding:0"
                                                     class="rounded-circle float-left" :src="$servername + '/image/users/'+User['profileImage']" @error="useSample" />
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
                                            <img class="img-fluid" :src="postImage(result)" @error="useSamplePost"/>
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
                                </div>
                                <!--//Col-->
                                    <Widgetleft v-show="gamediv"></Widgetleft>
                                <!--//Col-->
                                <!--Streams-->
                                <div v-for="stream in streams"
                                     :key="stream.stream_id"
                                     :id="stream.stream_id"
                                     class="col-12 col-md-4 mt-5"
                                    v-show="streamdiv"
                                >
                                    <div class="live-box">
                                        <router-link  :to="{ path: '/livestream/'+stream.stream_id}">
                                            <img class="img-fluid image" src="@/assets/images/play-btn.png" @error="useSampleCover"/>
                                        </router-link>
                                        <div class="middle">
                                            <div class="text"></div>
                                        </div>
                                    </div>
                                    <div class="row py-3">
                                        <div class="col-7">
                                            <p class="text-white">{{stream.stream_title}}</p>
                                        </div>
                                        <div class="col-5" align="right">
                                            <p class="text-white">{{moment(stream.createdDate).fromNow()}}</p>
                                        </div>
                                    </div>
                                </div>
                                <!--Streams-->
                                <!--Friends-->
                                <div
                                        v-for="result in resultsFriends"
                                        v-bind:key="result.id"
                                        :id="result.id"
                                        v-show="friendsdiv"
                                        class="bgdark-div col-12 col-md-6 mt-5">

                                    <div class="bgdark-div" v-if="result.createdBy == User._id">
                                        <div class="bgdark ">
                                            <div class="row">
                                                <div class="col-6 text-center">
                                                    <i class="material-icons text-white" style="font-size: 75px;">account_circle</i>
                                                </div>

                                                <div class="col-6 text-right">
                                                    <h6 class="text-white">
                                                        <router-link class="text-white" v-if="result.userData"
                                                                     :to="{ name: 'profile_view', params: {username: result.userData.username } }">
                                                            <span>{{result.userData.firstName}} {{result.userData.lastName}}</span></router-link>
                                                    </h6>
                                                    <p class="px-2 px-2-xs text-white">
                                                        <strong>{{result.userData.postCount}} Posts, </strong>
                                                        <strong>{{result.userData.followerCount}} Followers, </strong>
                                                        <strong>{{result.userData.followingCount}} Following</strong>
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-12">
                                                    <p class="text-white"
                                                       v-if="result.userData.bio && result.userData.bio !== null && result.userData.bio !== 'null'">
                                                        {{result.userData.bio}}</p>
                                                    <p class="text-white"
                                                       v-if="!result.userData.bio || result.userData.bio == null || result.userData.bio == 'null'">
                                                        <br></p>
                                                    <a @click="declineFriendRequest(result.createdBy)"
                                                       class="fs13 btn btn-xs btn-warning btn-block text-white"
                                                       style="padding: 0 5px;font-size: 11px">Remove</a>
                                                    <div class="clearfix"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="bgdark-div" v-else>
                                        <div class="bgdark ">
                                            <div class="row">
                                                <div class="col-6 text-center">
                                                    <i class="material-icons text-white" style="font-size: 75px;">account_circle</i>
                                                </div>

                                                <div class="col-6 ">
                                                    <h6 class="text-white">
                                                        <router-link class="text-white" v-if="result.requesterData"
                                                                     :to="{ name: 'profile_view', params: {username: result.requesterData.username } }">
                                                            <span>{{result.requesterData.firstName}} {{result.requesterData.lastName}}</span>
                                                        </router-link>
                                                    </h6>
                                                    <p class="px-2 px-2-xs text-white">
                                                        <strong>{{result.requesterData.postCount}} Posts, </strong>
                                                        <strong>{{result.requesterData.followerCount}} Followers, </strong>
                                                        <strong>{{result.requesterData.followingCount}} Following</strong>
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-12">
                                                    <p class="text-white"
                                                       v-if="result.requesterData.bio && result.requesterData.bio !== null && result.requesterData.bio !== 'null'">
                                                        {{result.requesterData.bio}}</p>
                                                    <p class="text-white"
                                                       v-if="!result.requesterData.bio || result.requesterData.bio == null || result.requesterData.bio == 'null'">
                                                        <br></p>
                                                    <a @click="declineFriendRequest(result.createdBy)"
                                                       class="fs13 btn btn-xs btn-warning text-white btn-block  "
                                                       style="padding: 0 5px;font-size: 11px">Remove</a>
                                                    <div class="clearfix"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </div>
                        </div>
                    </div>
                        <!--//Row-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Group from '../components/group';
    import user from '../components/user';
    import Widgetleft from './widgetleft';
    import moment from 'moment';
    import FollowButton from "../components/FollowButton";
    import PostComponent from '../components/posts/post';

    export default {
        components: { Widgetleft, Group, PostComponent, user },
        props:['GlobalSearchResult','search_q'],
        data() {
            return {
                User: "",
                results: [],
                results_intact:[],
                resultsFriends:[],
                q:'',
                streams:[],
                sort_by:'all_users',
                postdiv:true,
                gamediv:false,
                streamdiv:false,
                friendsdiv:false
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
        },
    methods: {
        dashboard(){
            this.postdiv = true;
            this.gamediv = false;
            this.streamdiv = false;
            this.friendsdiv = false;
        },
        game(){
            this.postdiv = false;
            this.gamediv = true;
            this.streamdiv = false;
            this.friendsdiv = false;
        },
        videos(){
            this.postdiv = false;
            this.gamediv = false;
            this.streamdiv = true;
            this.friendsdiv = false;
        },
        chats(){
            this.postdiv = false;
            this.gamediv = false;
            this.streamdiv = false;
            this.friendsdiv = true;
        },
        getUserList() {
            this.axios.get(this.$servername + "/friends/getfriendlist").then(response => {
                this.resultsFriends = response.data;
            });
        },
    searchFilterSelect: function() {
        this.searchFilter(this.sort_by);
    },
    searchFilter: function(sort) {
        this.results = this.results_intact;
        this.sort_by = sort;
        if(this.sort_by == 'all_users'){
            this.results = this.results;
        }
        if(this.sort_by == 'last_week'){
            this.results = this.results.filter(a=>this.checkTime(a.createdDate)<=7);
        }
        if(this.sort_by == 'last_month'){
            this.results = this.results.filter(a=>this.checkTime(a.createdDate)<=30);
        }
    },
        checkTime(item) {
            const currentTime = moment();
            const timeStore = moment(item);
            return currentTime.diff(timeStore, 'days');
        },
    useSample(e) {
        e.target.src = "https://via.placeholder.com/300?text=Upload+Image"
    },
    useSampleCover(e) {
        e.target.src = "https://via.placeholder.com/1600x900?text=Upload++Cover+Image"
    },

    postImage(post) {
        return this.$servername + '/image/posts/'+post.post_media;
    },
    useSamplePost(e) {
        e.target.src = "https://via.placeholder.com/1600x900?text=Image+Not+Found"
    },
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
        const user_detail = this.$session.get("user_detail");
        this.axios.get(this.$servername + "/posts/myposts").then(response => {
            const arr = response.data;
            arr.forEach(function(part, index) {
                if(part.likes.length){
                    let obj = part.likes.find(o => o.user === user_detail._id);
                    this[index].likedByUser = obj;
                }else{
                    this[index].likedByUser = false;
                }
            }, arr);
            this.results = arr;
            this.results_intact = response.data;
            this.searchFilter(this.sort_by)
        });
    },
    getAllStreams(){
        this.axios.get(this.$servername + '/streams/getUserStreams')
            .then((response) => {
                this.streams = response.data;
            })
            .catch(err => console.info('err: ', err));
    },
},
    mounted() {
        this.getMyPosts();
        this.getAllStreams();
        this.getUserList();
        this.User = this.$session.get("user_detail");
    }
};
</script>

<style scoped>
    .scroll-div{
        height: 82vh;
        overflow-y: auto;
        overflow-x: hidden;
    }
    /* width */
    .scroll-div::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    .scroll-div::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Handle */
    .scroll-div::-webkit-scrollbar-thumb {
        background: transparent;
    }

    /* Handle on hover */
    .scroll-div::-webkit-scrollbar-thumb:hover {
        background: transparent;
    }

    .scroll-div1{
        height: 56vh;
        overflow-y: auto;
        overflow-x: hidden;
    }
    /* width */
    .scroll-div1::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    .scroll-div1::-webkit-scrollbar-track {
        background: #0f234f;
    }

    /* Handle */
    .scroll-div1::-webkit-scrollbar-thumb {
        background: #888;
    }

    /* Handle on hover */
    .scroll-div1::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

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
    .search-filter {
        position: absolute;
        top: 0;
        margin: auto;
        display: inline-block;
    }
    .search-filter input {
        background: rgba(0, 0, 0, 0.2);
        border: 0;
        padding: 10px 8px;
        border-radius: 7px;
        font-size: 14px;
        width: 100%;
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
    .left-icon-menus ul {
        padding: 30px 60px 30px 0px;
        list-style: none;
        border: solid 1px #223e79;
        text-align: center;
        border-radius: 10px;
        height: calc(100vh - 100px);
        position: -webkit-sticky;
        position: sticky;
        top: 72px;
    }

    .left-icon-menus ul li {
        padding: 8px;
    }

    .left-icon-menus ul li i {
        color: #223e79;
        display: block;
        padding: 3.3vh 0;
    }

    .left-icon-menus ul li i:hover,
    .left-icon-menus ul li i.active {
        color: #fff;
        cursor: pointer;
    }

    .left-icon-menus ul li i {
        font-size: 45px;
    }

    @media all and (max-width: 767px) {
        .left-icon-menus ul {
            height: auto;
        }

        .left-icon-menus ul li {
            display: inline-block;
        }

        .left-icon-menus ul li i {
            padding: 2px;
        }

        .left-icon-menus ul li i {
            font-size: 20px;
        }
    }
</style>
