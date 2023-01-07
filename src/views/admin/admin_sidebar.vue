<template>
  <div class="adminMenus">
    <h2 class="text-white mb-3 mb-md-5">Logo</h2>
    <ul>
      <li>
        <router-link to="/admin/index" :class="activeClass('index')">
          <i class="material-icons float-left mr-2">dashboard</i> Dashboard
        </router-link>
      </li>
      <li>
        <router-link to="/admin/registered_users" :class="activeClass('registered_users')">
          <i class="material-icons float-left mr-2">account_circle</i> User Management
        </router-link>
      </li>
      <li>
        <router-link to="#">
          <i class="material-icons float-left mr-2">public</i> Site Manager
        </router-link>
      </li>
      <li>
        <router-link to="/admin/games">
          <i class="material-icons float-left mr-2">public</i> Games Management
        </router-link>
      </li>
      <li>
        <router-link to="/admin/groups">
          <i class="material-icons float-left mr-2">group</i> Groups
        </router-link>
      </li>
      <li>
        <router-link to="#">
          <i class="material-icons float-left mr-2">outlined_flag</i> Leagues
        </router-link>
      </li>
      <li>
        <router-link to="#">
          <i class="material-icons float-left mr-2">tune</i> Settings
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentLink: location.href
    };
  },
  computed: {
    routes() {
      return window.routes;
    }
  },
  mounted() {
    this.setCurrentLink();
  },
  methods: {
    route(url) {
      return this.routes.route(url);
    },
    activeClass(segment) {
      return segment == this.currentLink ? "active" : "";
    },
    setCurrentLink() {
      this.currentLink = new URL(location.href).pathname.split("/").pop();
    },
    menuclick(url) {
      this.$router.replace({ name: url });
    }
  }
};
</script>
<style scoped>
.adminMenus ul {
  padding: 0;
  margin: 0;
}
.adminMenus ul li {
  list-style: none;
}
.adminMenus ul li a {
  color: #6782bd;
  display: block;
  border-bottom: solid 1px #223e79;
  font-size: 16px;
  padding: 20px 0;
  text-decoration: none;
}
.adminMenus ul li a:hover,
.adminMenus ul li a.active {
  color: #fff;
}
@media all and (max-width: 767px) {
  .sticky {
    position: fixed;
    top: 0;
    height: 100% !important;
    left: -100%;
    z-index: 9;
    max-width: 100%;
    right: 0;
  }
}
</style>