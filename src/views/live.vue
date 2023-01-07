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
          <div v-if="search_q.length < 3" class="col-12 border-c py-3 scroll-div2">
          <div class="col-12 ">
              <div class="row" style="height: max-content">
                  <div class="col col-4 col-md-4 col-sm-12" >
                      <p class="text-white">Order By: </p>
                      <div class="search">
                          <select v-model="sort_by" @change="searchFilterSelect" style="-webkit-appearance:none !important;">
                              <option value="newest">Newest</option>
                              <option value="most_viewers">Most viewers</option>
                              <option value="duration">Duration</option>
                              <option value="most_popluar">Popluar</option>
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
                <div class="col-12 col-md-6 mb-3">
                        <button class="btn btn-info" @click="showModal = true">{{btnTitle}}</button>
                </div>
                <div class="col-12 col-md-6 mb-3" align="right">
                    <button @click="start()" class="btn btn-success" v-show="strt">Start Stream</button>
                    <button @click="stop()" class="btn btn-danger" v-show="stp">Stop Stream</button>
                </div>

                <!--Streams-->
              <div v-for="stream in streams"
                   :key="stream.stream_id"
                   :id="stream.stream_id"
                   :draggable="true"
                   @dragstart="dragStart"
                   @dragleave="dragLeave"
                   @dragover.stop
                   class="col-12 col-md-4">
                <div class="live-box">
                    <router-link  :to="{ path: '/livestream/'+stream.stream_id}">
                        <img class="img-fluid image" src="@/assets/images/play-btn.png" @error="useSampleCover" draggable="false"/>
                    </router-link>
                    <div class="middle">
                        <div class="text"></div>
                    </div>
                </div>
                <div class="row pt-3">
                  <div class="col-7">
                    <p class="text-white">{{stream.stream_title}}</p>
                  </div>
                  <div class="col-5" align="right">
                    <p class="text-white">{{moment(stream.createdDate).fromNow()}}</p>
                  </div>
                </div>
                  <div class="row pb-3">
                  <div class="col-7">
                    <p class="text-white">Views</p>
                  </div>
                  <div class="col-5" align="right">
                    <p class="text-white">{{stream.count_views}}</p>
                  </div>
                </div>
              </div>
                <!--Streams-->

                <div v-if="showModal">
                    <transition name="modal">
                        <div class="modal-mask">
                            <div class="modal-wrapper">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-body">
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true" @click="closeModel()">&times;</span>
                                            </button>
                                            <div class="col-12">
                                                <div class="row mt-2 mt-md-4 scroll-div">
                                                    <div class="col-12" v-show="streamContent">
                                                        <div class="row mt-2 mt-md-2 border-c py-3">
                                                            <div class="col-12 col-md-12">
                                                                <h4 class="text-white">Use these credentials to connect with OBS</h4>
                                                            </div>
                                                            <div class="col-12 col-md-12 mt-5">
                                                                <p class="text-white fnt">Server: &nbsp; rtmp://{{stream_server}}/{{stream_app}}</p>
                                                            </div>
                                                            <div class="col-12 col-md-12">
                                                                <p class="text-white fnt">Stream Name: &nbsp; {{stream_name}}</p>
                                                            </div>
                                                            <div class="col-12 col-md-12">
                                                                <p class="text-white fnt">Username: &nbsp; {{stream_username}}</p>
                                                            </div>
                                                            <div class="col-12 col-md-12">
                                                                <p class="text-white fnt">Password: &nbsp; {{stream_password}}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-12 col-md-12 mt-2 border-c">
                                                        <h4 class="text-white">{{title}} Live Stream</h4>
                                                        <div class="create-post-form">
                                                            <label>Stream Title</label>
                                                            <input type="text" v-model.trim="$v.st_title.$model"/>
                                                            <div class="error" v-if="$v.st_title.$dirty && $v.st_title.$error && !$v.st_title.required">Stream Title is required</div>

                                                            <label>Stream Username</label>
                                                            <input type="text" v-model.trim="$v.st_user.$model"/>
                                                            <div class="error" v-if="$v.st_user.$dirty && $v.st_user.$error && !$v.st_user.required">Stream Username is required</div>

                                                            <label>Stream Password</label>
                                                            <input type="password" v-model.trim="$v.st_password.$model"/>
                                                            <div class="error" v-if="$v.st_password.$dirty && $v.st_password.$error && !$v.st_password.required">Stream Password is required</div>
                                                            <!--<div v-show="host">
                                                                <label>Hosted Page Title</label>
                                                                <input type="text" v-model.trim="$v.st_pg_title.$model"/>
                                                                <div class="error" v-if="$v.st_pg_title.$dirty && $v.st_pg_title.$error && !$v.st_pg_title.required">Hosted Page Title is required</div>
                                                            </div>-->
                                                            <div v-if="butn">
                                                                <button v-on:click="postCreate" class="btn btn-info">Create</button>
                                                            </div>
                                                            <div v-else>
                                                                <button v-on:click="updatePost" class="btn btn-info mr-2">Update</button>
                                                                <button v-on:click="deletePost" class="btn btn-danger">Delete</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--//Col-->
                                                </div>
                                                <!--//Row-->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
               <!-- Modal-->
            </div>
          </div>
        </div>
      </div>
</template>

<script>
import Group from '../components/group';
import user from '../components/user';
import PostComponent from '../components/posts/post';
import moment from 'moment';
import {alphaNum, minLength, required} from "vuelidate/lib/validators";

export default {
  components: { Group,PostComponent,user },
    props:['GlobalSearchResult','search_q'],
    data() {
        return {
            props: ['id', 'draggable', 'containerClass'],
            id:'',
            streams:[],
            streams_intact:[],
            Friendsstreams:[],
            Followerstreams:[],
            showModal:false,
            st_title: '',
            st_user: '',
            st_password: '',
            streamid:'',
            title:'',
            btnTitle:'',
            butn:true,
            streamContent:false,
            form:false,
            txt:true,
            stream_server:'',
            stream_name:'',
            stream_username:'',
            stream_password:'',
            stream_app:'',
            strt:false,
            stp:false,
            q:'',
            streamThumbs:[],
            selectedFilter: {},
            sort_by:'newest',
            dataFilters: [
                {id: 1, title: 'All', selected: 'selected'},
                {id: 2, title: 'Friends', selected: ''},
                {id: 3, title: 'Following', selected: ''},
            ],
        };
    },
    validations: {
        st_title: {
            required,
            minLength: minLength(4)
        },
        st_user: {
            required,
            minLength: minLength(4),
            alphaNum:alphaNum
        },
        st_password: {
            required
        },
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
      this.getId();
      this.getAllStreams();
  },
    methods:{
    handleFilter() {
        if(this.selectedFilter == 1) {
            this.getAllVideos();
        }else if(this.selectedFilter == 2) {
            this.getFriendsVideos();
        }else if(this.selectedFilter == 3) {
            this.getFollowingVideos();
        }
    },
    getAllVideos(){
        this.streams = this.streams_intact;
    },
    getFriendsVideos(){
        this.streams = this.Friendsstreams;
    },
    getFollowingVideos(){
        this.streams = this.Followerstreams;
    },
    searchFilterSelect: function() {
        this.searchFilter(this.sort_by);
    },
    searchFilter: function(sort) {
        this.sort_by = sort;
        this.streams = this.streams_intact;

        if(this.sort_by == 'newest'){
            this.streams = this.streams.filter(a=>this.checkTime(a.createdDate)<=7)
        }
        if(this.sort_by == 'most_viewers'){
            this.streams = this.streams.sort((a, b) => b.count_views - a.count_views);
        }
        if(this.sort_by == 'duration'){
            this.streams = this.streams.filter(a=>this.checkTime(a.createdDate)===0);
        }
        if(this.sort_by == 'most_popluar'){
            this.streams = this.streams.sort((a, b) => b.count_views - a.count_views);
        }
    },
    checkTime(item) {
        const currentTime = moment();
        const timeStore = moment(item);
        return currentTime.diff(timeStore, 'days');
    },
    dragStart(event) {
        let target = event.target;
        event.target.style.border = '3px dotted white';
        let objs = {stream_id: target.id, target_type: 'stream'};
        event.dataTransfer.setData("text", JSON.stringify(objs));
    },
    dragLeave(event){
        event.target.style.border = 'none';
    },
    useSampleCover(e) {
        e.target.src = "@/assets/images/play-btn.png"
    },
    closeModel() {
        this.showModal = false;
    },
    editStream(){
        this.form = true;
        this.txt = false;
    },
    getAllStreams(){
        this.axios.get(this.$servername + '/streams/getAllStreams')
        .then((response) => {
            this.streams = response.data;
            this.streams_intact = response.data;
            this.searchFilter(this.sort_by);
            this.getFriendsStreams();
            this.getFollowersStreams();
        })
        .catch(err => console.info('err: ', err));
    },
    getFriendsStreams(){
        this.axios.get(this.$servername + '/streams/getFriendStream')
            .then((response) => {
                this.Friendsstreams = response.data;
            })
            .catch(err => console.info('err: ', err));
    },
    getFollowersStreams(){
        this.axios.get(this.$servername + '/streams/getFollowerStream')
            .then((response) => {
                this.Followerstreams = response.data;
            })
            .catch(err => console.info('err: ', err));
    },
    getId(){
        this.axios.get(this.$servername + '/streams/getId')
        .then((response) => {
            const arr = response.data;
            let st_id ='';
            let userid = '';
            let status = '';
            arr.forEach(function(part) {
                st_id = part.stream_id,
                userid = part._id,
                status = part.stream_status
            });
            if(userid !== ''){
                this.title = 'Edit';
                this.btnTitle = 'Edit/Settings';
                if(status == 'starting'){
                    this.strt = false;
                    this.stp = true;
                }else if(status == 'stopped'){
                    this.strt = true;
                    this.stp = false;
                }else{
                    this.strt = true;
                }
                this.butn = false;
                this.streamid = st_id;
                this.id = this.streamid;
                this.streamContent = true;
                this.getData();
                this.axios.get(this.$servername + '/streams/getById/' + this.id)
                    .then((response) => {
                        response.data.live_stream
                        this.st_title = response.data.live_stream.name;
                        this.st_user = response.data.live_stream.source_connection_information.username;
                        this.st_password = response.data.live_stream.source_connection_information.password;
                    })
                    .catch(err => console.info('err: ', err));
            }else{
                this.title = 'Create';
                this.btnTitle = 'Create Stream';
                this.form = true;
            }
        })
        .catch(err => console.info('err: ', err));
    },
    getData(){
      this.axios.get(this.$servername + '/streams/getById/' + this.id)
        .then((response) => {
            this.stream_server = response.data.live_stream.source_connection_information.primary_server;
            this.stream_app = response.data.live_stream.source_connection_information.application;
            this.stream_name = response.data.live_stream.source_connection_information.stream_name;
            this.stream_username = response.data.live_stream.source_connection_information.username;
            this.stream_password = response.data.live_stream.source_connection_information.password;
        })
        .catch(err => console.info('err: ', err));
    },
    start(){
        this.axios
        .put(this.$servername + '/streams/start/' + this.streamid)
        .then(response => {
            if (response.data.live_stream.state == 'starting') {
                toastr.success('Your Stream is starting');
                this.strt = false;
                this.stp = true;

            } else {
                toastr.error('Unable to create post, please try again!');
            }
            return response.data.live_stream;
        })
    },
    stop(){
        this.axios
        .put(this.$servername + '/streams/stop/' + this.streamid)
        .then(response => {
            if (response.data.live_stream.state == 'stopped') {
                toastr.success('Your stream is stopped');
                this.strt = true;
                this.stp = false;
            } else {
                toastr.error('Unable to create post, please try again!');
            }
            return response.data.live_stream;
        })
    },
    postCreate() {
        this.$v.$touch()
        if (this.$v.$invalid) {
            this.submitStatus = 'ERROR'
        }else{
            this.axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            this.axios
            .post(this.$servername + "/streams/createstream", {st_title: this.st_title, st_user: this.st_user,st_password: this.st_password})
            .then(response => {
                if (response.data.live_stream !== '') {
                    this.st_title = "";
                    this.st_user = "";
                    this.st_password = "";
                    this.showModal = false;
                    toastr.success('Stream Created Successfully!');
                    this.getAllStreams();
                    this.getId();
                } else {
                    toastr.error('Unable to create stream, please try again!');
                }
                return response.data;
            })
            .catch(error => {
                toastr.error(errors);
                return error;
            });
        }
    },
    updatePost(){
        this.$v.$touch()
        if (this.$v.$invalid) {
            this.submitStatus = 'ERROR'
        }else{
            this.axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
            this.axios
                .put(this.$servername + "/streams/updatestream/" + this.streamid, {st_title: this.st_title, st_user: this.st_user,st_password: this.st_password})
                .then(response => {
                    if (response.data.live_stream !== '') {
                        this.showModal = false;
                        toastr.success('Stream updated successfully!');
                    } else {
                        toastr.error('Unable to update stream, please try again!');
                    }
                    return response.data;
                })
        }
    },
    deletePost(){
        this.axios
            .delete(this.$servername + "/streams/deletestream/" + this.streamid)
            .then(response => {
                if (response.data.live_stream !== '') {
                    this.showModal = false;
                    toastr.success('Stream Deleted Successfully');
                    this.getAllStreams();
                    this.getId();
                } else {
                    toastr.error('Unable to update stream, please try again!');
                }
                return response.data;
            })
        }
    }
};
</script>

<style scoped>
    .create-post-form {
        margin-top: 50px;
    }
    .create-post-form input {
        background: rgba(0, 0, 0, 0.2);
        border: none;
        border-radius: 5px;
        width: 100%;
        margin-bottom: 15px;
        min-height: 50px;
        padding: 0 15px;
        color: #ccc;
    }
    .create-post-form label {
        color: #4871c8;
    }
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;

    }
    .mt-5{
        margin-top: 5px;
    }

    .modal-content {
        background: linear-gradient(90deg, rgba(28,58,123,1) 0%, rgba(49,88,174,1) 35%, rgba(23,50,108,1) 100%);
    }
    .close {
        opacity: inherit;
    }.ui-select-container.open>.ui-select-choices{
         opacity: 1 !important;
     }
    .modal-mask[style] {
        z-index: 999 !important;
    }
    .modal-mask {
        z-index: 999 !important;
    }
  .scroll-div2{
    height: 88vh;
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
    background: transparent;
  }

  /* Handle on hover */
  .scroll-div2::-webkit-scrollbar-thumb:hover {
    background: transparent;
  }
    .scroll-div{
    height: 80vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
  /*Side Scroll*/
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
    .image {
        display: block;
        backface-visibility: hidden;
    }
    .middle {
        transition: .5s ease;
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        text-align: center;
    }
    .container:hover .middle {
        opacity: 1;
    }
    .text {
        background-color: #4CAF50;
        color: white;
        font-size: 16px;
        padding: 16px 32px;
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
