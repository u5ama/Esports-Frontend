<template>
    <div class="row">
        <div v-if="search_q.length >= 3" class="col-12 border-c py-3">
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
        <div v-if="search_q.length < 3" class="col-12 border-c py-3" style="height: 88vh !important;">
            <div class="col-12" >
                <div class="row" style="height: max-content">
                    <div class="col col-4 col-md-4 col-sm-12" >
                        <p class="text-white">Order By: </p>
                        <div class="search">
                            <select v-model="sort_by" @change="searchFilterSelect" style="-webkit-appearance:none !important;">
                                <option value="created_time_asc">Newest</option>
                                <option value="created_time_desc">Oldest</option>
                                <option value="most_like">Reactions</option>
                            </select>
                        </div>
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
                                <option value="following">Following</option>
                                <option value="friends">Friends </option>
                            </select>
                        </div>
                    </div>
                </div>
                <br>
                <div class="row scroll-div">
                    <div
                            class="row mt-2 mt-md-1 justify-content-center "
                            v-for="result in filterItems(results)"
                            v-bind:key="result.id"
                    >
                        <post-component :postData="result" @call="likes"></post-component>
                    </div>

                </div>
                <!--//Row-->
            </div>
        </div>
        <!--<Widget :postData="result" @call="likes"></Widget>-->
    </div>
</template>
<script>
    import Group from '../components/group';
    import user from '../components/user';
    import moment from 'moment';
    import PostComponent from '../components/posts/post';
    export default {
        components: { PostComponent, Group, user},
        props:['GlobalSearchResult','search_q'],
        data() {
            return {
                results: [],
                results_intact: [],
                q:'',
                showComment : false,
                sort_by:'created_time_asc',
                friendsPosts:[],
                FollowersPosts:[]
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
            checkTime(item) {
                const currentTime = moment();
                const timeStore = moment(item);
                return currentTime.diff(timeStore, 'days');
            },
            checkMint(item) {
                const currentTime = moment();
                const timeStore = moment(item);
                return currentTime.diff(timeStore, 'h');
            },
            onImageLoadFailure: function(event) {
               event.target.src = "@/assets/images/league-of-legends.jpg"
            },
            filterItems: function(presets) {
                let searchQuery = this.q;
                if (searchQuery === '') {
                    return presets;
                }
                return presets.filter(function(preset) {
                    return preset.post_title.indexOf(searchQuery) >= 0;
                })
            },
            searchFilterSelect: function() {
                //console.log('Hello '+this.sort_by)
                this.searchFilter(this.sort_by);
            },
            trendFilterSelect: function() {
                //console.log('Hello '+this.sort_by);
                //this.searchFilter(this.sort_by);
            },
            searchFilter: function(sort) {
                    this.results = this.results_intact;
                this.sort_by = sort;
                if(this.sort_by == 'created_time_desc'){
                    this.results = this.results.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate) );
                }
                if(this.sort_by == 'created_time_asc'){
                    this.results = this.results.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime() );
                }
                if(this.sort_by == 'most_like'){
                    this.results = this.results.sort((a, b) => b.likeCount - a.likeCount );
                }
                if(this.sort_by == 'last_day'){
                    if (this.results.filter(a=>this.checkTime(a.createdDate)===0)){
                        this.results = this.results.sort((a, b) => b.likeCount - a.likeCount );
                    }else{
                        this.results = this.results.sort((a, b) => b.likeCount - a.likeCount );
                    }
                }
                if(this.sort_by == 'all_users'){
                    this.results = this.results_intact;
                }
                if(this.sort_by == 'following'){
                    this.results = this.FollowersPosts;
                }
                if(this.sort_by == 'friends'){
                    this.results = this.friendsPosts;
                }
            },
            likes(){
               this.getPosts()
            },
            getPosts(){
                this.$session.start();
                const user_detail = this.$session.get("user_detail");
                this.axios.get(this.$servername + "/posts").then(response => {
                    const arr = response.data;
                    //console.info('arr: ', response.data);
                    arr.forEach(function(part, index) {
                        if(part.likes.length){
                            let obj = part.likes.find(o => o.user === user_detail._id);
                            this[index].likedByUser = obj;
                        }else{
                            this[index].likedByUser = false;
                        }
                    }, arr);
                    this.results = arr;
                    this.results_intact = arr;
                    this.searchFilter(this.sort_by);
                    this.getFriendsPosts();
                    this.getFollowersPosts();
                });
            },
            getFriendsPosts(){
                this.axios.get(this.$servername + "/posts/FriendsPosts").then(response => {
                   this.friendsPosts = response.data;
                });
            },
            getFollowersPosts(){
                this.axios.get(this.$servername + "/posts/FollowersPosts").then(response => {
                   this.FollowersPosts = response.data;
                });
            },
            logout: function() {
                this.$session.destroy();
                this.$router.push("/");
            }
        },mounted() {
            this.getPosts();
        }
    };
</script>

<style scoped>
    .filter-btn:active{
        background-color: #1d3872;
    }
    .filter-btn{
        padding: 0 5px;
        font-size: 12px;
        margin-right: 10px;
    }
    .row.justify-content-center .col-md-11 {
        border: solid 1px #223e79;
        padding: 10px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.1);
    }
    .post-card-head {
        padding: 5px;
        position: absolute;
    }
    .post-card-info a {
        color: #fff;
    }
    .post-card-info {
        padding-left: 80px;
    }
    .cover-image {
        height: 250px;
        overflow: hidden;
    }
    .post-image img {
        object-fit: cover;
        width: 100%;
    }
    .cover-image img {
        object-fit: cover;
    }

    .scroll-div{
        height: 68vh;
        padding: 25px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .scroll-div1{
        /*height: 88vh;*/
        overflow-y: auto;
        overflow-x: hidden;
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

    /*Side Scroll*/
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
