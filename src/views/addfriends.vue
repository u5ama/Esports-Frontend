<template>
  <div class="row">
    <div v-if="search_q.length >= 3" class="col-12 border-c py-3">
      <!--<p class="text-white" v-if="GlobalSearchResult.users">Found Result: User {{GlobalSearchResult.users.length}}, Post
                                                            {{GlobalSearchResult.posts.length}}, Group
                                                            {{GlobalSearchResult.groups.length}}</p>-->

      <p class="text-white" v-if="GlobalSearchResult.users">Found Result: User {{GlobalSearchResult.users.length}}</p>
      <div v-if="GlobalSearchResult.posts.length" class="col-12">
        <div class="row mt-2 mt-md-4 justify-content-center"
             v-for="result in GlobalSearchResult.posts"
             v-bind:key="result.id">
          <post-component :postData="result"></post-component>
        </div>
      </div>
      <div v-if="GlobalSearchResult.groups.length" class="col-12">
        <div class="row">
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
             v-bind:key="result.id">
          <user :result="result"></user>
        </div>
      </div>
    </div>
    <div v-if="search_q.length < 3" class="col-12 border-c py-3">
      <div class="row" style="height: max-content">
        <div class="col col-4 col-md-4 col-sm-12">
          <p class="text-white">Order By: </p>
         <div class="search">
            <select v-model="sort_by" @change="searchFilterSelect">
              <option value="created_time">Sort by</option>
              <option value="max_trophies">Trophies</option>
              <option value="max_following">Following</option>
              <option value="max_posts">Posts</option>
            </select>
          </div>
        </div>
        <div class="col col-4 col-md-4 col-sm-12">
          <div class="search-filter">
            <p class="text-white">Search : </p>
            <form v-on:submit.prevent>
              <div class="search">
                <input type="text" class="text-white" value placeholder="Type Search Keywords" v-model="q"/>
              </div>
            </form>
          </div>
          <div style="clear: both"></div>
          <!--//Search-filter-->
        </div>
        <div class="col col-4 col-md-4 col-sm-12">
        </div>
      </div>
      <br>
      <div class="row scroll-div">
        <div v-if="!results.length" class="col-12 text-center m-t-20 ">
          <div class="text-white text-left friend-card">
            <h6 class="text-center">Noting to show now</h6>
          </div>
        </div>
        <div v-for="result in filterItems(results)"
             v-bind:key="result.id" class="col-12 col-md-6 text-center m-t-20 ">
          <div class="bgdark">
            <div class="row">
              <div class="col-7">
                <i class="material-icons text-white">account_circle</i>
                <h6 class="text-white">
                  <router-link v-if="result" class="text-white"
                               :to="{ name: 'profile_view', params: {username: result.username } }"><span>{{result.firstName}} {{result.lastName}}</span>
                  </router-link>
                </h6>
                <p class="pxs text-white">
                  <strong>{{result.postCount}} Posts, </strong>
                  <strong>{{result.followerCount}} Followers, </strong>
                  <strong>{{result.followingCount}} Following</strong>
                </p>
              </div>
              <div class="col-5 pull-right">
                <p class="text-white" v-if="result.bio && result.bio !== null && result.bio !== 'null'">
                  {{result.bio}}</p>
                <p class="text-white" v-if="!result.bio || result.bio == null || result.bio == 'null'"><br></p>
                <p>
                </p>
                <button class="add-btn btn-block" style="padding: 5px 10px;font-size: 11px"
                        @click.prevent="addFriend(result.id)">
                  Add to Firends
                </button>
                <div class="clearfix"></div>

                <follow-button is-followed="false"
                               :followed_id="result.id"
                               :user_id="user._id"
                               :followed_users="followed"
                               @btnClicked="alreadyFollowed"
                ></follow-button>
                <!--<button v-if="checkIfAlreadyFollow(result)" @click="unfollowUser(result)"
                        class="fs13 btn btn-xs btn-danger" style="padding: 0 5px;font-size: 11px">Un-Follow
                </button>
                <button v-if="!checkIfAlreadyFollow(result)" @click="followUser(result)"
                        class="fs13 btn btn-xs btn-success" style="padding: 0 5px;font-size: 11px">Follow
                </button>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    import Group from '../components/group';
    import user from '../components/user';
    import PostComponent from '../components/posts/post';
    import FollowButton from "../components/FollowButton";

    export default {
        components: {PostComponent, Group, user, FollowButton},
        props: ['GlobalSearchResult', 'search_q'],
        data() {
            return {
                results: [],
                results_intact: [],
                followed: [],
                user: {},
                q: '',
                sort_by: 'created_time',
            };
        },
        beforeCreate: function () {
            if (!this.$session.exists()) {
                this.$router.replace({name: "login"});
            } else {
                if (!this.$session.get("user_detail")) {
                    this.$router.replace({name: "login"});
                }
            }

        },
        methods: {
            /*checkIfAlreadyFollow(user) {
                console.info('user: ', user);
                let followed = this.followed.filter(value => value.user._id == user._id)
                if (followed.length) {
                    return true;
                } else {
                    return false;
                }
            },*/
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
            filterItems: function (presets) {
                let searchQuery = this.q;
                if (searchQuery === '') {
                    return presets;
                }
                return presets.filter(function (preset) {
                    const find = preset.username.indexOf(searchQuery) >= 0
                    if (!find) {
                        const firstName = preset.firstName.toLowerCase()
                        find = firstName.indexOf(searchQuery) >= 0
                    }
                    if (!find) {
                        const lastName = preset.lastName.toLowerCase()
                        find = lastName.indexOf(searchQuery) >= 0
                    }
                    return find;
                })
            },
            searchFilterSelect: function () {
                this.searchFilter(this.sort_by);
            },
            searchFilter: function (sort) {
                this.sort_by = sort;
                this.results = this.results_intact;
                if (this.sort_by == 'max_trophies') {
                    this.results = this.results.sort((a, b) => b.trophies.length - a.trophies.length);
                }
                if (this.sort_by == 'created_time') {

                    this.getUserList();
                }
                if (this.sort_by == 'max_following') {

                    this.results = this.results.sort((a, b) => b.followerCount - a.followerCount);
                }
                if (this.sort_by == 'max_posts') {

                    this.results = this.results.sort((a, b) => b.postCount - a.postCount);
                }
            },
            addFriend(friend_id) {
                this.User = this.$session.get("user_detail");
                this.axios.post(this.$servername + '/friends/addfriend', {user_id: friend_id})
                    .then((response) => {
                        this.getUserList();
                        this.flashMessage.show({status: 'success', message: 'Frined Request send successfully!'})
                    })
                    .catch((errors) => {
                        this.flashMessage.show({status: 'error', message: 'Something went wrong try again later!'})
                        console.info('errors:: ', errors);
                    });
            },
            getUserList() {
                this.User = this.$session.get("user_detail");
                if (Object.keys(this.User).length) {
                    let user_id = this.User._id;
                    this.axios.get(this.$servername + "/users/get-to-know-users/" + user_id).then(response => {
                        this.results = response.data;
                        this.results_intact = response.data;
                    });
                } else {
                    this.axios.get(this.$servername + "/users/").then(response => {
                        this.results = response.data;
                        this.results_intact = response.data;
                    });
                }
            },
            logout: function () {
                this.$session.destroy();
                this.$router.push("/");
            },
            /*followUser(userData) {
                this.axios.post(this.$servername + "/follows/addFollower", {"user_id": userData._id}).then(response => {
                    this.alreadyFollowed()
                    //this.followed = response.data;
                });
            },
            unfollowUser(userData) {
                this.axios.post(this.$servername + "/follows/delete", {"user_id": userData._id}).then(response => {
                    this.alreadyFollowed()
                });
            },*/
            alreadyFollowed() {
                this.axios.get(this.$servername + "/follows/get-followers").then(response => {
                    this.followed = response.data;
                });
            }
        },
        mounted() {
            this.alreadyFollowed()
            this.getUserList()
            this.user = this.$session.get("user_detail");
        }
    };
</script>

<style scoped>
  .filter-btn:active {
    background-color: #1d3872;
  }

  .filter-btn {
    padding: 0 5px;
    font-size: 12px;
    margin-right: 10px;
  }

  .pxs {
    font-size: 10px
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

  .row.m-t-20 {
    margin-top: 20px;
  }

  .m-t-20 {
    margin-top: 20px !important;
  }

  .search-filter input {
    background: rgba(0, 0, 0, 0.2);
    border: 0;
    padding: 10px 8px;
    color: #fff;
    border-radius: 7px;
    font-size: 14px;
    width: 300px;
  }

  .scroll-div {
    height: 68vh;
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
    margin: auto;
    display: inline-block;
  }

  .search-filter input {
    background: rgba(0, 0, 0, 0.2);
    border: 0;
    padding: 10px 8px;
    border-radius: 7px;
    font-size: 14px;
    width: auto;
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
  }

  .pull-right {
    float: right;
  }
</style>
