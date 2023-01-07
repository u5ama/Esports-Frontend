<template>
  <div id="app">

    <div class="container-fluid py-0 px-0" v-if="$route.name != 'login' && $route.name != 'signup1' && !isAdmin">
      <div class="mb-3 sticky-topbar">
        <TopBar @doSearch="searchtop"></TopBar>
      </div>
      <div class="col-12 main-feed">
        <div class="row">
          <LeftMenu></LeftMenu>

          <div class="col-md-7">
            <router-view></router-view>
          </div>
          <Widget></Widget>
        </div>
      </div>
    </div>
    <div class="container-fluid py-0 px-0" v-else>
        <div class="row">
          <div class="col-md-12">
            <router-view></router-view>
          </div>
        </div>
    </div>
    <FlashMessage :position="'right bottom'"/>

  </div>
</template>

<script>
    import TopBar from "./views/topbar";
    import LeftMenu from "./views/leftmenu";
    import Widget from "./views/widget";
export default {
  name: "App",
  components: {TopBar, LeftMenu, Widget},

  data() {
    return {};
  },

  computed: {
    isAdmin() {
        return window.location.href.indexOf('admin') > 0 ? true : false;
    }
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
      searchtop(data) {
          this.GlobalSearchResult = data.GlobalSearchResult;
          this.search_q = data.search_q;
      },
  },
   mounted() {
     console.info('is admin: ',  window.location.href.indexOf('admin'));
  },

  // methods: {
  //   setAuthenticated(status) {
  //     this.authenticated = status;
  //   },
  //   logout() {
  //     this.authenticated = false;
  //   }
  // }
};
</script>

<style>
html {
  background: radial-gradient(#325ab1 0%, #011237 100%);
  height: 100%;
  background-attachment: fixed;
}
body {
  background: none;
}
.text-gray {
  color: #c6c6c6;
}
#app {
  height: 100%;
}
button {
  border: none;
  background: none;
  outline: none !important;
}
h1 {
  padding: 0;
  margin-top: 0;
}
p {
  font-size: 12px;
}
.right-menus a {
  margin-left: 7px;
}
.border-c {
  border: solid 1px #223e79;
}
.league-head img {
  max-width: 50px;
  padding: 5px;
}
.league-head span {
  width: 87% !important;
}
.bgdark {
  background: rgba(0, 0, 0, 0.1);
  border: solid 1px #223e79;
  padding: 15px;
}
.widgets .widget-inner {
  border: solid 1px #223e79;
  padding: 10px;
  position: sticky;
  top: 72px;
}
.widget-head {
  padding: 10px 3px;
  border-bottom: solid 1px #223e79;
  margin-bottom: 10px;
  margin-left: -10px;
  margin-right: -10px;
}
.widget-head * {
  color: #fff;
}
.sticky-topbar {
  position: sticky;
  top: 0;
  background: #132c63;
  padding: 6px 0;
  border-bottom: solid 1px #223e79;
  z-index: 99;
  box-shadow: 0 20px 50px -20px #000;
  -o-box-shadow: 0 20px 50px -20px #000;
  -ms-box-shadow: 0 20px 50px -20px #000;
  -moz-box-shadow: 0 20px 50px -20px #000;
}
.adminBody {
  background: #ffffff !important;
  height: 100%;
}
.adminMenus {
  padding: 10px;
  background: linear-gradient(#325ab1 0%, #011237 100%);
}
.adminBody .container-fluid,
.adminBody .col-12,
.adminBody .row,
.adminBody .col-3,
.adminBody .adminMenus {
  height: 100%;
}
.sticky {
  position: sticky;
  top: 0;
  height: 100vh !important;
}

.post-image {
  max-height: 170px;
  overflow: hidden;
}
.widget-card-head {
  position: absolute;
}
.widget-card-info {
  padding-left: 50px;
}
.widget-card-info p {
  margin: 0;
}
.fs13 {
  font-size: 13px !important;
}
.post-footer button {
  opacity: 0.7;
  cursor: pointer;
}
.post-footer button:hover {
  opacity: 1;
}
.posted {
  color: #3e78f5;
  font-size: 13px;
}
@media all and (max-width: 767px) {
  .main-feed {
    padding-top: 70px;
  }
  .adminBody .container-fluid,
  .adminBody .col-12,
  .adminBody .row,
  .adminBody .col-3,
  .adminBody .adminMenus {
    height: auto;
  }
  .left-icon-menus {
    position: fixed;
    top: 46px;
    background: #000611;
    z-index: 9;
    padding: 0 !important;
  }
  .left-icon-menus ul {
    border: none !important;
    width: 100% !important;
  }
  .left-icon-menus ul li {
    padding: 8px 20px !important;
  }
  .right-menus {
    padding: 5px 0;
  }
  .right-menus a {
    margin-right: 3px;
    font-size: 13px;
  }
  .right-menus a i {
    font-size: 15px;
  }
  .left-icon-menus ul {
    height: auto;
    width: calc(100% + 30px);
    border-radius: 0;
    margin-bottom: 0;
    border-left: 0;
    border-right: 0;
  }
  .top-header .right-menus a i {
    top: 3px !important;
  }
  .post-footer button span {
    display: none;
  }
  .sticky {
    position: fixed;
    top: 0;
    height: 100% !important;
    left: -100%;
    z-index: 9;
    max-width: 100%;
    right: 0;
  }
  .all_user_list {
    padding: 0 !important;
    overflow-x: scroll;
  }
}
</style>
