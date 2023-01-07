<template>
  <div class="container">
    <div id="signup">
      <h1 class="logo-text text-center mb-3 mb-md-5">LOGO</h1>
      <h3 class="text-center text-white">Welcome to Peep!</h3>
      <h3 class="text-center text-white mb-3 mb-md-4">Tell us about yourself</h3>
      <h3 class="text-center text-white mb-3 mb-md-4">I am a(n)</h3>
      <div class="text-center mt-2 tags">
        <a href="/signup2" class>Player</a>
        <a href="/signup2" class>Team</a>
        <a href="/signup2" class>Group/Club</a>
        <a href="/signup2" class>Event</a>
        <a href="/signup2" class>Game</a>
        <a href="/signup2" class>Company</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      input: {
        username: "",
        password: ""
      }
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
    login() {
      if (this.input.username != "" && this.input.password != "") {
        if (
          this.input.username == this.$parent.mockAccount.username &&
          this.input.password == this.$parent.mockAccount.password
        ) {
          this.$emit("authenticated", true);
          this.$router.replace({ name: "posts" });
        } else {
          console.log("The username and / or password is incorrect");
        }
      } else {
        console.log("A username and password must be present");
      }
    }
  }
};
</script>
<style scoped>
#signup {
  width: 700px;
  margin: auto;
  margin-top: 100px;
  padding: 20px;
}
#signup h3 {
  font-size: 45px;
}
#signup input,
#signup input:focus,
#signup input:active {
  margin-bottom: 15px;
  background: none;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  border: solid 1px #788bb5;
}
.text-gray {
  color: #788bb5;
}
#signup span {
  color: #788bb5;
  font-size: 22px;
  width: 100px;
  display: inline-block;
  float: left;
}
#signup input {
  display: inline-block;
  float: left;
}
.btn-link {
  font-size: 22px;
  color: #638add;
}
.logo-text {
  font-size: 48px;
  color: #8b96af;
}
.tags a {
  color: #8b96af;
  text-align: center;
  padding: 5px;
  font-size: 24px;
  margin: 0 3px;
}
@media all and (max-width: 600px) {
  #signup {
    width: 60%;
  }
}
</style>
