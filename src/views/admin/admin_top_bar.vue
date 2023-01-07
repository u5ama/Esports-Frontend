<template>
  <div class="adminTopBar">
    <div class="col-12">
      <div class="row justify-content-end">
        <div class="col-8 col-md-4">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown text-right">
              <a
                class="nav-link dropdown-toggle ml-auto text-right text-dark"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i
                  style="position: relative;top: 5px;left: -7px;"
                  class="material-icons d-inline-block"
                >account_circle</i>
                <span class="d-inline-block">Hello {{Admin['username']}}</span>
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="#">Account</a>
                <a class="dropdown-item" href="#">Settings</a>
                <div class="dropdown-divider"></div>
                <button @click="logout()" class="dropdown-item">Logout</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      Admin: ""
    };
  },
  beforeCreate: function() {
    if (!this.$session.exists()) {
      this.$router.push("/admin/login");
    }
  },
  mounted() {
    this.Admin = this.$session.get("user_detail");
  },
  methods: {
    logout: function() {
      this.$session.destroy();
      this.$router.push("/admin/login");
    }
  }
};
</script>
<style scoped>
.adminTopBar {
  padding: 15px;
  margin: 0px -15px;
  background: #eee;
  box-shadow: 0 5px 2px -2px #ccc;
  -o-box-shadow: 0 5px 2px -2px #ccc;
  -moz-box-shadow: 0 5px 2px -2px #ccc;
  -ms-box-shadow: 0 5px 2px -2px #ccc;
}
.dropdown-menu {
  left: unset !important;
  right: 0 !important;
  max-width: 150px;
}
</style>