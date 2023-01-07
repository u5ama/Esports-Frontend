<template>
  <div id="nav">
    <div class="container-fluid px-0">
      <div class="col-12 top-header">
        <div class="row">
          <div class="col-3 col-md-1">
            <h3>Logo</h3>
          </div>
          <div class="col-3 col-md-8">
            <div class="current-user">
                <router-link v-if="$route.name == 'myposts'" to="/">
                    <i class="material-icons">keyboard_backspace</i>
                </router-link>
              <router-link v-if="$route.name != 'myposts'" to="/myposts">
                <span>
                  <img class="user-profile-circle rounded-circle" :src="$servername + '/image/users/'+User['profileImage']" @error="useSample" />
                </span>

                <span v-if="User">{{User['username']}}</span>
              </router-link>
            </div>
            <div class="search-filter">
              <form  v-on:submit.prevent>
                <div class="search">
                  <input type="text" value placeholder="Search Here..." v-model="q" @keyup="searchApp" />
                </div>
              </form>
            </div>
            <!--//Search-fitlter-->
          </div>
          <div class="col-6 col-md-3 text-right right-menus">
            <router-link to="/addfriends" class="fs13">Add Friend</router-link>
              <!--<router-link to="/users" class="fs13">Friends</router-link>
              <router-link to="/addfriends" class="fs13">Add Friend</router-link>-->
            <router-link to="/create_post">
              <i class="material-icons">add</i>
            </router-link>
            <router-link to="#">
              <i class="material-icons">tune</i>
            </router-link>
            <router-link to="/login" v-on:click.native="logout()" replace>
              <i class="material-icons">power_settings_new</i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "TopMenu",
  data() {
    return {
      User: "",
      q: '',
      usersSearchList: {},
      groupSearchList: {},
      postsSearchList: {},
        searchResult : {
            groups:{},
            users:{},
            posts:{}
        }
    };
  },
  beforeCreate: function() {
    if (!this.$session.exists()) {
      this.$router.push("/");
    }
  },
  mounted() {
    this.User = this.$session.get("user_detail");
  },
  methods: {
    useSample(e) {
      e.target.src = "https://via.placeholder.com/300?text=Upload+Image"
    },
    searchGroups(q) {
        this.axios.post(this.$servername + '/groups/search', {q: this.q})
            .then((response) => {
                this.groupSearchList = response.data.data
            })
            .catch((err) => {
                console.info('errors got:  ', err);
            })
    },
    searchUser(q) {
        this.axios.post(this.$servername + '/users/search', {q: this.q})
            .then((response) => {
                    this.usersSearchList = response.data.data
            })
            .catch((err) => {
                console.info('errors got:  ', err);
            })
    },
    searchPost(q) {
        this.axios.post(this.$servername + '/posts/search', {q: this.q})
            .then((response) => {
                    this.postsSearchList = response.data.data
            })
            .catch((err) => {
                console.info('errors got:  ', err);
            })
    },
    searchApp() {
        if(this.q.length > 2){
            //console.info('q: ', this.q);
            this.searchGroups(this.q)
            this.searchUser(this.q);
            this.searchPost(this.q);
            //this.searchResult.groups = this.groupSearchList;
            this.searchResult.users = this.usersSearchList;
           // this.searchResult.posts = this.postsSearchList;
            this.$emit('doSearch', {
                GlobalSearchResult: this.searchResult,
                search_q: this.q,
            });
        }else{
            //this.searchResult.groups = this.groupSearchList;
            this.searchResult.users = this.usersSearchList;
            //this.searchResult.posts = this.postsSearchList;
            this.$emit('doSearch', {
                GlobalSearchResult: this.searchResult,
                search_q: this.q,
            });
        }
      /*console.info('q: ', q);
      console.info('route: ', this.$route);*/
      /*let pageName = this.$route.name;
      switch (pageName) {
        case 'groups':
            this.searchGroups(q);

      }*/
    },

    logout: function() {
      this.$session.destroy();
      this.$router.push("/login");
    }
  }
};
</script>
<style scoped>
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
</style>
