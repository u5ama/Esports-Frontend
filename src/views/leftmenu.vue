<template>
  <div class="col-12 col-md-1 left-icon-menus">
    <ul>
      <li>
        <router-link to="/posts" :class="activeClass('posts')">
          <i class="material-icons">dashboard</i>
        </router-link>
      </li>
      <li>
        <router-link to="/users" :class="activeClass('friends')" v-on:click="menuclick('friends')">
          <i class="material-icons">perm_identity</i>
        </router-link>
      </li>
      <li>
        <router-link to="/live" :class="activeClass('live')">
          <i class="material-icons">play_circle_outline</i>
        </router-link>
      </li>
      <li>
        <router-link to="/groups" :class="activeClass('groups')">
          <i class="material-icons">tab</i>
        </router-link>
      </li>
      <li>
        <router-link to="/notifications" :class="activeClass('notifications')">
          <i class="material-icons" v-if="!notificationCount">notifications_none</i>
          <i class="material-icons" v-if="notificationCount">notifications_active</i>
          <span class="badge badge-success" id="notify-badge" v-text="notificationCount"></span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
    import {EventBus} from '../eventbus';

    export default {
        name: "Leftmenu",
        data() {
            return {
                currentLink: location.href,
                notificationCount: 0
            };
        },
        computed: {
            routes() {
                return window.routes;
            },

        },
        mounted() {
            this.setCurrentLink();
            EventBus.$on('update-notifications', this.updateNotificationCount);

        },
        methods: {
            updateNotificationCount(params) {
                //console.info('updateNotificationCount: ', params);
                this.notificationCount = params.data.length;
            },
            route(url) {
                return this.routes.route(url);
            },
            activeClass(segment) {
                this.setCurrentLink();
                return segment == this.currentLink ? "active" : "";
            },
            setCurrentLink() {
                this.currentLink = this.$route.name;
            },
            menuclick(url) {
                this.$router.replace({name: url});
            }
        }
    };
</script>

<style scoped>
  #notify-badge {
    position: absolute;
  }

  .left-icon-menus ul {
    padding: 0;
    list-style: none;
    border: solid 1px #223e79;
    text-align: center;
    border-radius: 10px;
    height: calc(100vh - 100px);
    position: sticky;
    top: 72px;
  }

  .left-icon-menus ul li {
    padding: 8px;
  }

  .left-icon-menus ul li a {
    color: #223e79;
    display: block;
    padding: 3.3vh 0;
  }

  .left-icon-menus ul li a:hover,
  .left-icon-menus ul li a.active {
    color: #fff;
  }

  .left-icon-menus ul li a i {
    font-size: 45px;
  }

  @media all and (max-width: 767px) {
    .left-icon-menus ul {
      height: auto;
    }

    .left-icon-menus ul li {
      display: inline-block;
    }

    .left-icon-menus ul li a {
      padding: 2px;
    }

    .left-icon-menus ul li a i {
      font-size: 20px;
    }
  }
</style>
