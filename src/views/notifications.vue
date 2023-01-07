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
          <div v-if="search_q.length < 3" class="col-12 border-c py-3 scroll-div3">
          <div class="col-12">
              <div class="row" style="height: max-content">
                  <div class="col col-4 col-md-4 col-sm-12" >
                      <p class="text-white">Order By: </p>
                      <div class="search">
                          <select v-model="sort_by" @change="searchFilterSelect" style="-webkit-appearance:none !important;">
                              <option value="new">New</option>
                              <option value="old">Old</option>
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
                          <select v-model="selectedFilter" class="form-control" @change="handleFilter">
                              <option v-for="filter in dataFilters" :value="filter.id"  :selected="filter.selected"
                                      v-text="filter.title"></option>
                          </select>
                      </div>
                  </div>
              </div>
              <br><br>
            <div class="row">
              <div class="col-12 col-md-12">
                <div class="bgdark">
                  <div class="row py-3">
                    <div class="col-12">
                      <p class="text-white text-center lead">Challenges</p>
                    </div>
                  </div>
                  <!--//Inner Row-->
                  <div class="row py-3"></div>
                  <!--//Inner Row-->
                  <div class="row py-3"></div>
                  <!--//Inner Row-->
                </div>
              </div>
              <!--//Col-->
              <div class="col-12 col-md-12">
                <div class="bgdark">
                  <div class="row py-3">
                    <div class="col-12">
                      <p class="text-white text-center lead">Friend Requests</p>
                     <!-- All Friends Requests-->
                      <div v-if="title == 'Friends Requests'"
                           class="row py-3"
                      >
                        <div class="bgdark-div col-12 col-md-12" v-for="result in results"
                             v-bind:key="result.id">
                          <div class="bgdark col-12">
                            <div class="row">
                              <div class="col-6 text-center">
                                <i class="material-icons text-white">account_circle</i>
                                <h6 class="text-white">
                                  <router-link class="text-white" v-if="result.requesterData"  :to="{ name: 'profile_view', params: {username: result.requesterData.username } }" ><span>{{result.requesterData.firstName}} {{result.requesterData.lastName}}</span></router-link>
                                </h6>
                                <p class="px-2 px-2-xs text-white">
                                  <strong>{{result.requesterData.postCount}}  Posts, </strong>
                                  <strong>{{result.requesterData.followerCount}} Followers, </strong>
                                  <strong>{{result.requesterData.followingCount}} Following</strong>
                                </p>
                              </div>

                              <div class="col-6 text-center">
                                <p class="text-white" v-if="result.requesterData.bio && result.requesterData.bio !== null && result.requesterData.bio !== 'null'">{{result.requesterData.bio}}</p>
                                <p class="text-white" v-if="!result.requesterData.bio || result.requesterData.bio == null || result.requesterData.bio == 'null'"><br></p>

                                <a @click="acceptFriendRequest(result.createdBy)" class="fs13 btn btn-xs btn-primary text-white" style="padding: 0 5px;font-size: 11px;margin-right: 5px">Accept</a>
                                <a @click="declineFriendRequest(result.createdBy)" class="fs13 btn btn-xs btn-warning text-white" style="padding: 0 5px;font-size: 11px">Remove Friends Requests</a>
                                <div class="clearfix"></div>
                                <button v-if="checkIfAlreadyFollow(result.requesterData)" @click="unfollowUser(result.requesterData)" class="fs13 btn btn-xs btn-danger" style="padding: 0 5px;font-size: 11px">Un-Follow</button>
                                <button v-if="!checkIfAlreadyFollow(result.requesterData)" @click="followUser(result.requesterData)" class="fs13 btn btn-xs btn-success" style="padding: 0 5px;font-size: 11px">Follow</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- All Friends Requests-->
                    </div>
                  </div>
                  <!--//Inner Row-->
                </div>
              </div>
              <!--//Col-->
            </div>
            <!--//Row-->
            <div class="row">
              <div class="col-12 col-md-12">
                <div class="bgdark">
                  <div class="row py-3">
                    <div class="col-12">
                      <p class="text-white text-center lead">Rivals</p>
                    </div>
                  </div>
                  <!--//Inner Row-->
                  <div class="row py-3"></div>
                  <!--//Inner Row-->
                  <div class="row py-3"></div>
                  <!--//Inner Row-->
                </div>
              </div>
              <!--//Col-->
              <div class="col-12 col-md-12">
                <div class="bgdark">
                  <div class="row py-3">
                    <div class="col-12">
                      <p class="text-white text-center lead">Coming Up</p>
                    </div>
                  </div>
                  <!--//Inner Row-->
                  <div class="row py-3"></div>
                  <!--//Inner Row-->
                  <div class="row py-3"></div>
                  <!--//Inner Row-->
                </div>
              </div>
              <!--//Col-->
            </div>
            <!--//Row-->
          </div>
        </div>
      </div>
</template>
<script>
import Group from '../components/group';
import user from '../components/user';
import moment from 'moment';
import PostComponent from '../components/posts/post';

export default {
  components: { Group, PostComponent, user },
    props:['GlobalSearchResult','search_q'],
  data() {
    return {
      results: [],
        selectedFilter: {},
        sort_by:'new',
        dataFilters: [
            {id: 1, title: 'Upcoming events', selected: 'selected'},
            {id: 2, title: 'Posts/videos', selected: ''},
        ],
        q: '',
        title:'Friends Requests',
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
    mounted() {
      this.getFriendRequest();
      this.alreayFollowed();
    },
  methods: {
        logout: function() {
          this.$session.destroy();
          this.$router.push("/");
        },
      handleFilter() {
          if(this.selectedFilter == 1) {
              this.getEvents();
          }else if(this.selectedFilter == 2) {
              this.getPostsAndVideos();
          }
      },
      getEvents(){
         console.log("Events");
      },
      getPostsAndVideos(){
          console.log("Videos");
      },
      searchFilterSelect: function() {
          //console.log('Hello '+this.sort_by)
          this.searchFilter(this.sort_by);
      },
        searchFilter: function(sort) {
          this.sort_by = sort;
          this.results = this.results_intact;

          if(this.sort_by == 'old'){
              this.results = this.results.filter(a=>this.checkTime(a.createdDate)>=0)
          }
          if(this.sort_by == 'new'){
              this.results = this.results.filter(a=>this.checkTime(a.createdDate)===0);
          }
        },
      checkTime(item) {
          const currentTime = moment();
          const timeStore = moment(item);
          return currentTime.diff(timeStore, 'days');
      },
        getFriendRequest(){
          this.title = 'Friends Requests';
          this.axios.get(this.$servername + "/friends/getFriendRequestList").then(response => {
            this.results = response.data;
            this.results_intact = response.data;
            this.searchFilter(this.sort_by)
          });
        },
        filterItems: function(presets) {
          let searchQuery = this.q;
          if (searchQuery === '') {
            return presets;
          }
          return presets.filter(function(preset) {
            return preset.requesterData.username.indexOf(searchQuery) >= 0;
          })
        },
        checkIfAlreadyFollow(user){
          let folleweds = this.followed.filter(value => value.user._id == user._id);
          if(folleweds.length){
            return true;
          }else{
            return false;
          }
        },
        acceptFriendRequest(createdBy){
          this.axios.post(this.$servername + "/friends/acceptfriend",{user_id:createdBy}).then(response => {
            this.getFriendRequest()
          });
        },
        declineFriendRequest(createdBy){
          //console.log('declineFriendRequest')
          this.axios.delete(this.$servername + "/friends/removefriend/"+createdBy).then(response => {
            this.getFriendRequest()
          });
        },
        followUser(userData){
          this.axios.post(this.$servername + "/follows/addFollower",{"user_id":userData._id}).then(response => {
            this.alreayFollowed()
            //this.followed = response.data;
          });
        },
        unfollowUser(userData){
          this.axios.post(this.$servername + "/follows/delete",{"user_id":userData._id}).then(response => {
            this.alreayFollowed()
          });
        },
        alreayFollowed(){
          this.axios.get(this.$servername + "/follows/get-followers").then(response => {
            this.followed = response.data;
          });
        }
  },
}
</script>

<style scoped>
.btn-outline {
  background: none;
  color: #fff;
  border: solid 1px #223e79;
  border-radius: 4px;
  text-align: center;
  min-width: 150px;
}
.main-feed .col-12.col-md-7.border-c .bgdark {
  min-height: 300px;
  max-height: 300px;
  margin-bottom: 15px;
  overflow-y: scroll;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  scrollbar-width: thin;
}
.main-feed .col-12.col-md-7.border-c .bgdark::-webkit-scrollbar {
  width: 5px;
}
.main-feed .col-12.col-md-7.border-c .bgdark::-webkit-scrollbar-track-piece {
  background-color: transparent;
}
.main-feed .col-12.col-md-7.border-c .bgdark::-webkit-scrollbar-thumb:vertical {
  height: 20px;
  background-color: rgba(0, 0, 0, 0.2);
}
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
.scroll-div3{
  height: 88vh;
  overflow-y: auto;
  overflow-x: hidden;
}
/*Side Scroll*/
/* width */
.scroll-div3::-webkit-scrollbar {
  width: 10px;
}

/* Track */
.scroll-div3::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
.scroll-div3::-webkit-scrollbar-thumb {
  background: transparent;
}

/* Handle on hover */
.scroll-div3::-webkit-scrollbar-thumb:hover {
  background: transparent;
}
.form-control:focus {
    color: #fff;
    background-color: rgba(0, 0, 0, 0.2);
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
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
