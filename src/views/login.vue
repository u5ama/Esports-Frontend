<template>
  <div class="">
    <div id="login">
      <h1 class="logo-text text-center mb-3 mb-md-5">LOGO</h1>
      <div class="clearfix">
        <span>Email or Username</span>
        <input class type="email" name="email" v-model="email" placeholder="Email" />
      </div>
      <div class="clearfix mt-3">
        <span>Password</span>
        <input class type="password" name="password" v-model="password" placeholder="Password" />
      </div>
      <div class="text-center text-warning clearfix mt-3">
        <div v-if="isError">Please Enter Valid Login Credentials!!!</div>
      </div>
     <!-- <div class="text-center">-->
        <div class="row">
          <div class="col-6 text-right">
            <button type="submit" v-on:click="login" class="btn btn-link"><b>Login</b></button>
          </div>
          <div class="col-6">
            <router-link to="/signup1" class="btn btn-link"><b>Sign Up</b></router-link>
          </div>
          </div>
      <!--</div>-->
    </div>
    <div class="text-center pt-2 pt-sm-3 pt-md-5">
      <router-link to="/admin/login">Login to Admin</router-link>
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
    if (this.$session.exists()) {
        if(this.$session.get("user_detail")){
            this.$router.push("/posts");
        }
    }
  },
  methods: {
    login(e) {
      e.preventDefault();
      this.axios
        .post(this.$servername + "/users/authenticate", {
          email: this.email,
          password: this.password
        })
        .then(response => {
          if (response.data.length !== 0) {
            // this.isError = true;
            this.$session.start();
            this.$session.set("isLogin", true);
            this.$session.set("user_detail", response.data);
            window.location.replace("/posts");
              //this.$router.push({ name: "posts" });
          } else {
            //console.log("login faild");
            this.isError = true;
          }
          return response.data;
        })
        .catch(error => {
            // console.log("error")
            // console.log(error)
            this.isError = true;
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
  padding: 100px 20px 20px;
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
