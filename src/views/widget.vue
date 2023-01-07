<template>
  <div class="col-12 col-md-4 widgets">
    <div class="widget-inner scroll-div">
      <ajax-loader :isLoading="isLoading"/>
      <div class="group-contains ">
        <div class="col-12 col-md-12 p-0 mb-3">
          <div class="row">
            <div class="col-md-12">
              <div class="bgdark text-white text-center widget-groups-board"
                   id="widget-groups-board"
                   @drop.prevent="drop"
                   @dragover.prevent="allowDrop">
                  <i class="material-icons float-left pr-3" data-toggle="tooltip" data-placement="left" id="drag-drop-info"
                     title="You can drag your friends, groups, stream, posts etc.." style="cursor: help">
                    help_outline
                  </i>
                <span>Drag Items Here...</span>
              </div>
            </div>
          </div>
        </div>
        <div id="video-streamer" class="mb-1">
          <youtube
                  :video-id="videoId"
                  :player-vars="playerVars"
                  ref="youtube"
                  :fitParent=true
                  @playing="playing"></youtube>
          <button @click="playVideo"></button>
        </div>
        <div id="groups-list" class="mb-3" v-if="$route.name != 'start_discussion'">
          <group mode="widget" v-for="(grp, index) in groups" :group="grp"
                 class="mb-3 widget-group"
                 :id="'group-' + grp._id"
                 draggable="true"
                 container-class="col-md-12"
                 :iterator="index + 1"></group>
        </div>

        <div id="stream-list" class="mb-3">
        </div>

        <div id="friend-list" class="mb-3">
        </div>
      </div>

      <div id="widget-friends" class="widget-box" v-if="widgetFriends.length">
        <div class="row mb-3 scroll-div1"
                v-for="result in widgetFriends"
                v-bind:key="result.id">

          <div class="bgdark-div col-12 col-md-12" v-if="result.createdBy == User._id">
            <div class="bgdark col-12 widget-friend-item">
              <i class="material-icons text-white pt-2 float-right remove-from-widget" aria-hidden="true"
                 :id="result._id"
                 @click="removeFriend($event.target)" :data-type="result.type == 'user' ? 'follows' : 'friends'">clear
              </i>
              <div class="row">

                <div class="col-12 text-center">
                  <i class="material-icons text-white">account_circle</i>
                  <h6 class="text-white">
                    <router-link class="text-white" v-if="result.userData"
                                 :to="{ name: 'profile_view', params: {username: result.userData.username } }"><span>{{result.userData.firstName}} {{result.userData.lastName}}</span>
                    </router-link>
                  </h6>
                </div>
                <div class="col-12 text-center" v-if="result.userData.postCount">
                  <post-component
                          mode="widget"
                          v-for="post in result.userData.posts"
                          :postData="post"/>
                </div>
                <div class="col-6 text-center text-white" v-else>
                  <p>No posts available...</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bgdark-div col-12 col-md-12" v-else-if="result.user == User._id">
            <div class="bgdark col-12 widget-friend-item">
              <i class="material-icons text-white pt-2 float-right remove-from-widget" aria-hidden="true"
                 :id="result._id"
                 @click="removeFriend($event.target)" :data-type="result.type == 'user' ? 'follows' : 'friends'">clear
              </i>
              <div class="row">

                <div class="col-12 text-center">
                  <i class="material-icons text-white">account_circle</i>
                  <h6 class="text-white">
                    <router-link class="text-white" v-if="result.requesterData"
                                 :to="{ name: 'profile_view', params: {username: result.requesterData.username } }"><span>{{result.requesterData.firstName}} {{result.requesterData.lastName}}</span>
                    </router-link>
                  </h6>
                </div>
                <div class="col-12 text-center" v-if="result.requesterData.postCount">
                  <post-component
                          mode="widget"
                          v-for="post in result.requesterData.posts"
                          :postData="post"/>
                </div>
                <div class="col-6 text-center text-white" v-else>
                  <p>No posts available...</p>
                </div>
              </div>
            </div>
          </div>




          <!--//Col-->
        </div>
      </div>

      <!--  Streams-->
      <div v-show="play" class="scroll-div2 widget-box">
        <div class="col-12 border-c" v-for="favStream in favStreamList">
          <div align="right">
            <i class="material-icons text-white pt-2 float-right" aria-hidden="true" :id="favStream.stream_id"
               @click="removeStream($event.target)" style="cursor: pointer;">clear</i>
          </div>
          <div class="row">
            <div class="col-12 col-md-12">
              <div class="live-box">
                <!--<router-link  :to="{ path: '/livestream/'+favStream.stream_id }">-->
                  <img class="img-fluid" src="@/assets/images/play-btn.png" @click="playLive(favStream.stream_id,favStream.stream_status)" v-show="samplePoster" data-toggle="tooltip" data-placement="left"
                       title="Play Live Stream" style="cursor: pointer"/>
                <span v-if="LiveButn" class="livebutn">Live</span>
                <span v-if="favStream.stream_status !== 'starting'" class="offlinebtn">Offline/Notavailable</span>
                <vplayer v-if="LiveStream" :playerOptions="vOption" @onplay="playStream" @onerror="errorPlay" />
                <!--</router-link>-->
              </div>
              <div class="row py-3">
                <div class="col-7">
                  <p class="text-white">{{favStream.stream_title}}</p>
                </div>
                <div class="col-5" align="right">
                  <p class="text-white">{{moment(favStream.createdDate).fromNow()}}</p>
                </div>
              </div>
              <!--//Col-->
            </div>
          </div>
          <!--//Row-->
        </div>
      </div>
      <!--  Streams-->
    </div>
    <!--//Row-->
  </div>
  <!--  Streams-->
</template>
<script>

    import DiscussionSection from "./discussions/DiscussionSection";
    import group from '../components/group';
    import {EventBus} from "../eventbus";
    import AjaxLoader from "../components/AjaxLoader";
    import PostComponent from '../components/posts/post';
    import { vplayer } from 'vue-hls-player';

export default {
    name: "Widget",
    props: ['groupId', 'friendId', 'postData'],
    components: {group, DiscussionSection, AjaxLoader, PostComponent, vplayer},
    data() {
    return {
        groups: {},
        friends: {},
        widgetFriends: {},
        follows: {},
        favStreamList: {},
        results: [],
        streams: {},
         offline: false,
        id: '',
        videoId: '3KgmY5NrEzU',
        isLoading: false,
        play: false,
        LiveStream:false,
        LiveButn:false,
        samplePoster:true,
        vOption:{
          preload: false,
          type: "application/x-mpegURL",
          //src: 'https://wowzaprod225-i.akamaihd.net/hls/live/1006166/5538ebf0/playlist.m3u8',
          //preload: false,
          autoplay: false,
          isLoop: false,
          playsinline: false,
          //poster: 'https://oimdztrab.qnssl.com/Frp4SyVe5PosdkUKRaE-krjK7B5z',
          controls: 'progress,current,duration,volume',
          crossOrigin: false //设置视频的 CORS 设置。
        },
        playerVars: {
            autoplay: 1,
            loop: 1,
            version: 3,
            rel: 0
        },
    }
},
  computed: {
      player() {
          return this.$refs.youtube.player
      },
  },
  methods: {
  userProfileImage(user) {
      if (user != undefined && user.profileImage) {
          return this.$servername + '/image/users/' + user.profileImage
      } else {
          //return this.$servername + '/image/users/'+ user.profileImage
          return '';
      }
  },
    playLive(streamid,status){

      this.id = streamid;
      if (status == 'starting'){
        this.axios.get(this.$servername + '/streams/getById/' + this.id)
          .then((response) => {
            this.vOption.src = response.data.live_stream.player_hls_playback_url;
            this.LiveStream = true;
            this.samplePoster = false;
            if (status == 'starting'){
              this.LiveButn = true;
            }
            //this.getThumbnail();
          })
          .catch(err => console.info('err: ', err));
      }else{
        this.offline = true;
      }

    },
    playStream(e){
      //console.log(e)
      //console.log(this.vOption)
    },
    errorPlay(e){
     // console.log('errorPlay')
      //console.log(e)
    },
    playVideo() {
        //console.info('play video: ', arguments);
        this.player.playVideo()
    },
    playing() {
        //console.info('play video: ', arguments);
        //console.log('\o/ we are watching!!!')
    },
    allowDrop(event) {
    },
    useSample(e) {
        e.target.src = "https://via.placeholder.com/300?text=Upload+Image"
    },
    drop(event) {
        let obj = JSON.parse(event.dataTransfer.getData("text"));
        //console.info('obj: ', obj);

        if (obj.target_type == 'friend') {
            //console.log("hello");
            let friendId = obj.friend_id;
            let frnd = document.getElementById(friendId);
            frnd.style.display = "block";
            frnd.classList.add('col-md-12')
            let friendListContainer = document.getElementById('friend-list');
            friendListContainer.appendChild(frnd);

            friendId = friendId.split('-').pop();
            this.axios.post(this.$servername + '/friends/add-to-widget', {
                friend_id: friendId
            });
        } else if (obj.target_type == 'following') {
            let followId = obj.friend_id;
            let following = document.getElementById(followId);
            following.style.display = "block";
            following.classList.add('col-md-12')
            let followingListContainer = document.getElementById('friend-list');
            followingListContainer.appendChild(following);

            followId = followId.split('-').pop();
            this.axios.post(this.$servername + '/follows/add-to-widget', {
                friend_id: followId
            });
        } else if (obj.target_type == 'stream') {
            let streamId = obj.stream_id;
            streamId = streamId.split('-').pop();
            this.axios.post(this.$servername + '/streams/add-to-widget', {
                stream_id: streamId,
                user_id: this.User._id
            }).then(response => {
              this.getWidgetStreams();
              //this.followed = response.data;
            });

        } else if (obj.target_type == 'group') {
            let groupId = obj.group_id;
            this.isLoading = true;
            groupId = groupId.split('-').pop();
            this.axios.post(this.$servername + '/groups/add-to-widget', {
                group_id: groupId,
                user_id: this.User._id
            }).then(() => {
                EventBus.$emit('groupWidgetized', {groupId});
                this.getWidgetGroups();
            });
        }
    },
    friend(event) {

    },
    checkIfAlreadyFollow(user) {
        let folleweds = this.followed.filter(value => value.user._id == user._id)
        if (folleweds.length) {
            return true;
        } else {
            return false;
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
    followUser(userData) {
        this.axios.post(this.$servername + "/follows/addFollower", {"user_id": userData._id}).then(response => {
            this.alreayFollowed();
        });
    },
    unfollowUser(userData) {
        this.axios.post(this.$servername + "/follows/delete", {"user_id": userData._id}).then(response => {
            this.alreayFollowed()
        });
    },
    alreayFollowed() {
        this.axios.get(this.$servername + "/follows/get-followers").then(response => {
            this.followed = response.data;
        });
    },
    countGold(trophies) {
        let trophyCount = trophies.filter(value => value.trophy_type == 'gold')
        return trophyCount.length;
    },
    countSilver(trophies) {
        let trophyCount = trophies.filter(value => value.trophy_type == 'silver')
        return trophyCowidget-friendsunt.length;
    },
    countBronze(trophies) {
        let trophyCount = trophies.filter(value => value.trophy_type == 'bronze')
        return trophyCount.length;
    },
    getUserList() {
        this.title = 'Friends List'
        this.axios.get(this.$servername + "/friends/getfriendlist").then(response => {
            this.results = response.data;
        });
    },

    getWidgetGroups() {
        this.axios.get(this.$servername + '/groups/widget-groups/', {
            params: {user_id: this.User._id}
        })
          .then((res) => {
              this.isLoading = false;
              this.groups = res.data.data;
              EventBus.$emit('groupWidgetized', {});
          })
          .catch(() => {
          });
    },

    getWidgetFriends() {
        this.axios.get(this.$servername + '/friends/widget-friends')
        .then((res) => {
            //console.info('fes is: ', res);
            this.friends = res.data.data;
            //this.friends = Object.assign(this.follows, this.friends);
            this.widgetFriends = Object.assign(this.follows, this.friends);
        })
        .catch((err) => {
        });
    },
    getWidgetFollows() {
        this.axios.get(this.$servername + '/follows/get-widget-follows')
            .then((res) => {
                this.follows = res.data.data;
                this.widgetFriends = Object.assign(this.follows, this.friends);
            })
            .catch((err) => {
            });
    },
    getWidgetStreams() {
        this.axios.get(this.$servername + '/streams/widget-streams', {
            params: {user_id: this.User._id}
        })
          .then((response) => {
              this.favStreamList = response.data.data;
              if (this.favStreamList != '') {
                  this.play = true;
              }
          })
          .catch((err) => {
          });
    },
    removeStream(element) {
        let user = this.$session.get("user_detail");
        this.axios.post(this.$servername + '/streams/remove-from-widget', {
            stream_id: element.id,
            user_id: user._id
        })
        .then((response) => {
            this.getWidgetStreams();
        })
        .catch((err) => {
        });
    },

    removeFriend(element) {
        let user = this.$session.get("user_detail");
        let type = element.dataset['type'];
        this.axios.post(this.$servername + '/' + type + '/remove-from-widget', {
            id: element.id,
            user_id: user._id
        })
          .then((response) => {
              this.getWidgetFollows();
              this.getWidgetFriends();
          })
          .catch((err) => {
          });
    },
    getNotifications() {
        this.axios.get(this.$servername + '/notifications/get-all-by-user', {
            params: {user_id: this.User._id}
        })
        .then((response) => {
            EventBus.$emit('update-notifications', response.data);
        })
        .catch((err) => {
            console.info('error for fetching notifications', err)
        });
    }
},
  mounted() {
      $('#drag-drop-info').tooltip()
      this.User = this.$session.get("user_detail");

      this.$session.start();
      var user_detail = this.$session.get("user_detail");
      this.axios.get(this.$servername + "/posts/favFriends").then(response => {
          var arr = response.data;
          arr.forEach(function (part, index) {
              if (part.likes.length) {
                  let obj = part.likes.find(o => o.user === user_detail._id);
                  this[index].likedByUser = obj;
              } else {
                  this[index].likedByUser = false;
              }
          }, arr);
          this.results = arr;
          this.results_intact = arr;
      });

      this.alreayFollowed();
      this.getUserList();
      this.getWidgetGroups();
      this.getWidgetFriends();
      this.getWidgetFollows();
      this.getWidgetStreams();
      this.getNotifications();

      //let interval = 1000 * 60 * 5; // where X is your every X minutes
      let interval = 10000; // where X is your every X minutes
      setInterval(() => {
          this.getWidgetGroups();
          //this.getWidgetFriends();
          //this.getWidgetFollows();
          this.getNotifications();
      }, interval)
    }
  };
</script>
<style scoped>

  .remove-from-widget {
    cursor: pointer;
    position: absolute;
    right: 10px;
    z-index: 50;
  }

  .widget-friend-item {
    overflow-x: hidden;
  }

  .widget-box {
    height: 375px;
    overflow-x: hidden;
    margin-top: 20px;
  }

  .widget-group {
    padding-left: 0;
    padding-right: 0;
  }

  @media all and (max-width: 767px) {
    .widgets {
      margin-top: 10px;
    }

    .widget-inner .col-12.col-md-5.pl-0 {
      padding-right: 0;
    }

    .widgets .widget-inner {
      height: auto;
    }
  }

  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #051b4a;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .scroll-div2 {
    height: 44vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /*Side Scroll*/
  /* width */
  .scroll-div2::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  .scroll-div2::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  .scroll-div2::-webkit-scrollbar-thumb {
    background: #051b4a;
  }

  /* Handle on hover */
  .scroll-div2::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  .livebutn{
    position: absolute;
    color: white;
    font-size: 12px;
    background: red;
    left: 20px;
    top: 10px;
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 5px;
    z-index: 999;
  }
  .offlinebtn{
    position: absolute;
    color: white;
    font-size: 10px;
    background: gray;
    left: 20px;
    top: 10px;
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 5px;
    z-index: 999;
  }
</style>
