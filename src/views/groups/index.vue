<template>
  <div class="row">

        <div v-if="search_q.length >= 3" class="col-12 border-c py-3">
            <p class="text-white" v-if="GlobalSearchResult.users">Found Result: User {{GlobalSearchResult.users.length}}, Post {{GlobalSearchResult.posts.length}}, Group {{GlobalSearchResult.groups.length}}</p>
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
        <div v-if="search_q.length < 3" class="col-12 border-c py-3">
            <div class="row" style="height: 60px">
                <div class="col col-4 col-md-4 col-sm-12" >
                    <div class="search" v-if="false">
                        <select v-model="sort_by" @change="searchFilter" >
                            <option value="created_time">Sort by</option>
                            <option value="max_trophies">Trophies</option>
                            <option value="max_following">Following</option>
                            <option value="max_posts">Posts</option>
                        </select>
                    </div>

                    <create-group v-if="$route.name == 'groups'" @groupCreated="getList"></create-group>
                </div>
                <div class="col col-4 col-md-4 col-sm-12" >
                    <div class="search-filter">
                        <form>
                            <div class="search">
                                <input type="text" class="text-white" value placeholder="Type Search Keywords" v-model="q" />
                            </div>
                        </form>
                    </div>
                    <!--//Search-fitlter-->
                </div>
                <div class="col col-4 col-md-4 col-sm-12" >
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="row" v-if="groups.length" id="groups-listing">
                        <div class="col-12 text-white" v-if="searchQuery">Search Results for "<span v-text="searchQuery"></span>"</div>

                        <group v-for="(grp, index) in filterItems(groups)" :group="grp"
                               :id="'group-' + grp._id"
                               draggable="true"
                               :iterator="index + 1"
                               container-class="col-md-4"
                               @groupSubscription="getList"></group>
                    </div>
                    <p v-else class="text-white">No Groups Available yet!</p>
                </div>
            </div>
        </div>
  </div>
</template>
<script>
import Group from '../../components/group';
import User from "../../components/user";
import PostComponent from '../../components/posts/post';
import createGroup from './create';
import {EventBus} from '../../eventbus';

export default {
  name: "GroupsLanding",
  components: { Group, createGroup,PostComponent,User},
    props:['GlobalSearchResult','search_q'],
  data() {
    return {
      groups: [],
      q: [],
      user: {},
      searchQuery : '',
      sort_by:'created_time',
    }
  },
  methods : {
      search(q) {
          this.axios.post(this.$servername + '/groups/search', {q: this.q})
              .then((response) => {
                  console.info('response got:  ', response);
              })
              .catch((err) => {
                  console.info('errors got:  ', err);
              })
      },
      searchFilter: function() {
          if(this.sort_by == 'created_time_desc'){
              this.results = this.groups.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate) );
          }
          if(this.sort_by == 'created_time_asc'){
              this.results = this.groups.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime() );
          }
          if(this.sort_by == 'most_like'){
              this.groups = this.groups.sort((a, b) => b.likeCount - a.likeCount );
          }
      },
      filterItems: function(presets) {
          let searchQuery = this.q;
          if (searchQuery === '') {
              return presets;
          }
          return presets.filter(function(preset) {
              return preset.name.indexOf(searchQuery) >= 0;
          })
      },
    searchtop(data) {
        console.info('q: ', data);
        this.GlobalSearchResult = data.GlobalSearchResult;
        this.search_q = data.search_q;
    },
    searchGroups(data) {
        console.info('data searched: ',data);

        /*this.$emit('doSearch', {
            groupSearchList: this.groupSearchList
        });*/
      /*if(data.q != '') {
          this.search(data.q);
        this.searchQuery = data.q;
        this.groups = data.results;
      } else {
        this.searchQuery = '';
        this.getList();
      }*/
    },
    getList() {
      this.axios.get(this.$servername + '/groups/by-user/' + this.user._id)
        .then(response => {
          this.groups = response.data.data;
        })
        .catch(error => {
          console.info('error got:: ', error);
        });
    }
  },
    beforeCreate: function() {
        if (!this.$session.exists()) {
            this.$router.replace({ name: "login" });
        } else {
            if(!this.$session.get("user_detail")){
                this.$router.replace({ name: "login" });
            }
        }
    },
  mounted() {
    if(this.$session.get("user_detail")){
      this.user = this.$session.get("user_detail");
    }

    this.getList();

    EventBus.$on('groupWidgetized', this.getList)
  }
};
</script>

<style scoped>
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
