<template>
  <div class="container-fluid py-0 px-0">
    <div class="col-12 main-feed">
      <div class="row">
        <div v-if="search_q.length >= 3" class="col-12 col-md-7 border-c py-3">
          <!-- <p class="text-white" v-if="GlobalSearchResult.users">Found Result: User {{GlobalSearchResult.users.length}},
                                                                 Post {{GlobalSearchResult.posts.length}}, Group
                                                                 {{GlobalSearchResult.groups.length}}</p>-->
          <p class="text-white" v-if="GlobalSearchResult.users">Found Result: User
                                                                {{GlobalSearchResult.users.length}}</p>
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
        <div v-if="search_q.length < 3" class="col-12 col-md-12 border-c py-3" style="height: 88vh;">
          <div class="row">
            <div class="col col-4 col-md-4 col-sm-12">
              <p class="text-white">Order By: </p>
              <div class="search">
                <select v-model="sort_by" @change="searchFilterSelect">
                  <option value="atoz">a to z</option>
                  <option value="ztoa">z to a</option>
                  <option value="max_following">Most followers</option>
                </select>
              </div>
            </div>
            <div class="col col-4 col-md-4 col-sm-12">
              <div class="search-filter">
                <p class="text-white">Search:</p>
                <form v-on:submit.prevent>
                  <div class="search">
                    <input type="text" class="text-white" value placeholder="Type Search Keywords" v-model="q"/>
                  </div>
                </form>
              </div>
              <!--//Search-filter-->
            </div>
            <div class="col col-4 col-md-4 col-sm-12">
            </div>
          </div>
          <div class="row">
            <div class="col-12" style="margin-top: 20px">
              <div class="row mt-2 mt-md-4">
                <div  class="col-12 col-md-6  text-left right-menus">
                  <h2 class="text-white ">{{title}}</h2>
                </div>

                <div class="col-12 col-md-6 text-right right-menus">

                  <select v-model="selectedFilter" class="form-control float-right" @change="handleFilter">
                    <option v-for="filter in dataFilters" :value="filter.id"  :selected="filter.selected"
                            v-text="filter.title"></option>
                  </select>

                </div>
              </div>
              <div v-if="!results.length" class="row mt-2 mt-md-4 justify-content-center">
                <div class="col-12 col-md-9">
                  <div class="text-white text-left friend-card">
                    <h6>Noting to show now</h6>
                  </div>
                </div>
              </div>
              <div v-if="title == 'Friends Requests'"
                   class="row mt-2 mt-md-4"
                   v-for="result in filterItems(results)"
                   v-bind:key="result.id">
                <div class="bgdark-div col-12 col-md-4">
                  <div class="bgdark col-12">
                    <div class="row">
                      <div class="col-6 text-center">
                        <i class="material-icons text-white" style="font-size: 75px;">account_circle</i>
                      </div>

                      <div class="col-6">
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

                        <a @click="acceptFriendRequest(result.createdBy)" class="fs13 btn btn-block btn-xs btn-primary text-white"
                           style="padding: 0 5px;font-size: 11px;margin-right: 5px">Accept</a>
                        <a @click="declineFriendRequest(result.createdBy)"
                           class="fs13 mt-1 btn btn-xs btn-warning btn-block text-white"
                           style="padding: 0 5px;font-size: 11px">Remove</a>
                        <div class="clearfix"></div>
                        <follow-button is-followed="false"
                                       :followed_id="result.id"
                                       :user_id="User._id"
                                       :followed_users="followed"
                                       @btnClicked="alreadyFollowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="title == 'Pending Friend Request'"
                   class="row mt-2 mt-md-4 "
              >
                <div v-for="result in filterItems(results)"
                     v-bind:key="result.id"
                     class="bgdark-div col-12 col-md-4"
                >
                  <div class="bgdark col-12">
                    <div class="row">
                      <div class="col-6 text-center">
                        <i class="material-icons text-white" style="font-size: 75px;">account_circle</i>
                      </div>

                      <div class="col-6">
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
                           class="fs13 btn btn-block btn-xs btn-warning text-white"
                           style="padding: 0 5px;font-size: 11px">Remove Request</a>
                        <div class="clearfix"></div>
                        <follow-button is-followed="false"
                                       :followed_id="result.id"
                                       :user_id="User._id"
                                       :followed_users="followed"
                                       @btnClicked="alreadyFollowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="title == 'Friends List'"
                   class="row mt-2 mt-md-4 ">

                <div
                  v-for="result in filterItems(results)"
                  v-bind:key="result.id"
                  :id="result.id"
                  :draggable="true"
                  @dragstart="dragStart"
                  @dragover.stop
                  class="bgdark-div col-12 col-md-4">

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
                          <follow-button is-followed="false"
                                         :followed_id="result.id"
                                         :user_id="User._id"
                                         :followed_users="followed"
                                         @btnClicked="alreadyFollowed"
                          />
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
                          <follow-button
                                  is-followed="false"
                                  :followed_id="result.id"
                                  :user_id="User._id"
                                  :followed_users="followed"
                                  @btnClicked="alreadyFollowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="title == 'Friends Followed'"
                   class="row mt-2 mt-md-4">

                <div v-for="result in filterItems(results)"
                     v-bind:key="result.id"
                     class="bgdark-div col-12 col-md-4"
                >

                <div class="bgdark-div col-12">
                  <div class="bgdark col-12">
                    <div class="row">
                      <div class="col-12 text-center">
                        <i class="material-icons text-white">account_circle</i>
                        <h6 class="text-white">
                          <router-link class="text-white" v-if="result.userData"
                                       :to="{ name: 'profile_view', params: {username: result.userData.username } }">
                            <span>{{result.userData.firstName}} {{result.userData.lastName}}</span>
                          </router-link>
                        </h6>
                        <p class="px-2 px-2-xs text-white">
                          <strong>{{result.userData.postCount}} Posts, </strong>
                          <strong>{{result.userData.followerCount}} Followers, </strong>
                          <strong>{{result.userData.followingCount}} Following</strong>
                        </p>
                      </div>

                      <div class="col-12 text-right">
                        <p class="text-white" style="margin-bottom: 0px !important;"
                           v-if="result.userData.bio && result.userData.bio !== null && result.userData.bio !== 'null'">
                          {{result.user.bio}}</p>
                        <p class="text-white" style="margin-bottom: 0px !important;"
                           v-if="!result.userData.bio || result.userData.bio == null || result.userData.bio == 'null'">
                          <br></p>
                        <div class="clearfix"></div>
                        <follow-button
                                is-followed="false"
                               :followed_id="result.id"
                               :user_id="User._id"
                               :followed_users="followed"
                               @btnClicked="alreadyFollowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
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
    import User from '../components/user';
    import PostComponent from '../components/posts/post';
    import FollowButton from "../components/FollowButton";

    export default {
        components: {
            Group, PostComponent, User, FollowButton
        },
        props: ['GlobalSearchResult', 'search_q'],
        data() {
            return {
                results: [],
                props: ['id', 'draggable', 'containerClass'],
                results_intact: [],
                followed: [],
                friendLists:[],
                q: '',
                selectedFilter: {},
                dataFilters: [
                    {id: 1, title: 'Friends List', selected: 'selected'},
                    {id: 2, title: 'Friend Requests', selected: ''},
                    {id: 3, title: 'Following', selected: ''},
                ],
                title: 'Friends List',
                sort_by: 'atoz',
                User: {}
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
            handleFilter() {
                if(this.selectedFilter == 1) {
                    this.getUserList();
                }else if(this.selectedFilter == 2) {
                    this.getFriendRequest();
                }else if(this.selectedFilter == 3) {
                    this.getFollows();
                }
            },
            dragStart(event) {
                let target = event.target;
                let obje = {friend_id: target.id, target_type: 'friend'};
                event.dataTransfer.setData("text", JSON.stringify(obje));
            },
            searchFilterSelect: function () {
                this.searchFilter(this.sort_by)
            },
          searchFilter: function (sort) {
                this.sort_by = sort;
                this.results = this.results_intact;

                if (this.sort_by == 'atoz') {
                    this.results = this.results.sort((a, b) => b.userData.username - a.userData.username);
                }
                if (this.sort_by == 'ztoa') {
                    this.results = this.results.sort((a, b) => a.userData.username - b.userData.username);
                }
                if (this.sort_by == 'max_following') {
                    this.results = this.results.sort((a, b) => b.userData.followerCount - a.userData.followerCount);
                }
            },
            filterItems: function (presets) {
                let searchQuery = this.q;
                if (searchQuery === '') {
                    return presets;
                }
                return presets.filter(function (preset) {
                    return preset.userData.username.indexOf(searchQuery) >= 0;
                })
            },
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
            acceptFriendRequest(createdBy) {
                this.axios.post(this.$servername + "/friends/acceptfriend", {user_id: createdBy}).then(response => {
                    this.getFriendRequest()
                });
            },
            declineFriendRequest(createdBy) {
                this.axios.delete(this.$servername + "/friends/removefriend/" + createdBy).then(response => {
                    this.getFriendRequest()
                });
            },

            getUserList() {
                this.title = 'Friends List';
                this.axios.get(this.$servername + "/friends/getfriendlist").then(response => {
                    this.results = response.data;
                  this.results_intact = response.data;
                  this.searchFilter(this.sort_by);
                });
            },
            getFriendRequest() {
                this.title = 'Friends Requests';
                this.axios.get(this.$servername + "/friends/getFriendRequestList").then(response => {
                    this.results = response.data;
                    this.results_intact = response.data;
                });
            },
            getFollows() {
                this.title = 'Friends Followed';
                this.axios.get(this.$servername + '/follows/get-followers')
                    .then((res) => {
                        this.followed = res.data;
                        this.results = res.data;
                        this.results_intact = res.data;
                    })
            },

            logout: function () {
                this.$session.destroy();
                this.$router.push("/");
            },

            alreadyFollowed() {
                this.axios.get(this.$servername + "/follows/get-followers").then(response => {
                    this.followed = response.data;
                });
            }
        },
        mounted() {
            this.User = this.$session.get("user_detail");

            this.alreadyFollowed();
            this.getUserList();

        }
    };
</script>

<style scoped>
  .form-control:focus {
    color: #fff;
    background-color: rgba(0, 0, 0, 0.2);
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }

  .filter-btn:active {
    background-color: #1d3872;
  }

  .filter-btn {
    padding: 0 5px;
    font-size: 12px;
    margin-right: 10px;
  }

  .px-2-xs {
    font-size: 10px;
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

  .add-btn:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  .bgdark-div:nth-child(odd) {
    padding-top: 15px;
    padding-right: 7.5px;
  }

  .bgdark-div:nth-child(even) {
    padding-top: 15px;
    padding-left: 7.5px;
  }
</style>
