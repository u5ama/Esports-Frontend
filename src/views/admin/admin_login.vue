<template>
  <div class="container">
    <div id="login">
      <h1 class="logo-text text-center mb-3 mb-md-5">LOGO</h1>
      <div class="clearfix">
        <span>email or login name</span>
        <input class type="email" name="username" v-model="email" placeholder="Email" />
      </div>
      <div class="clearfix mt-3">
        <span>password</span>
        <input class type="password" name="password" v-model="password" placeholder="Password" />
      </div>
      <div class="text-center clearfix mt-3">
        <div v-if="isError" class="text-warning text-center d-block">Incorrect Login Details!</div>
      </div>
      <div class="text-center">
        <button type="submit" @click="submitEntry" class="btn btn-success">Login</button>
        <!-- <router-link to="/admin/index" class="btn btn-success">Login</router-link> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      isError: false
    };
  },
  beforeCreate: function() {

      console.info('this.$session.exists(): ', this.$session.exists());
    /*if (this.$session.exists()) {
      this.$router.push("/admin/registered_users");
    }*/
  },
  methods: {
    submitEntry(e) {
      e.preventDefault();
      if (this.email == "" && this.password == "") {
        this.isError = true;
      }
      this.axios
        .post(this.$servername + "/users/authenticate", {
          email: this.email,
          password: this.password
        })
        .then(response => {
          console.log(response.data.length);
          if (response.data.length !== 0) {
            // console.log("login successfully");
            this.$session.start();
            this.$session.set("isLogin", true);
            this.$session.set("user_detail", response.data);
            this.$router.replace({ name: "admin_users" });
          } else {
            console.log("login faild");
          }
          return response.data;
        })
        .catch(error => {
          return error;
        });
    }
  }
};
</script>

<style scoped>
#login {
  width: 500px;
  margin: auto;
  margin-top: 100px;
  padding: 20px;
}
#login input,
#login input:focus,
#login input:active {
  margin-bottom: 15px;
  background: #172c5f;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  color: #ccc;
}
#login span {
  color: #788bb5;
  font-size: 22px;
  width: 150px;
  display: inline-block;
  float: left;
}
#login input {
  display: inline-block;
  float: left;
}
.btn-link {
  font-size: 22px;
  color: #638add !important;
}
.logo-text {
  font-size: 48px;
  color: #8b96af;
}
@media all and (max-width: 600px) {
  #login {
    width: 200px;
    padding: 100px 0;
  }
}
</style>