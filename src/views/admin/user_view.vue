<template>
  <div class="adminBody">
    <div class="container-fluid">
      <div class="col-12 p-md-0">
        <div class="row">
          <div class="col-3 p-md-0 sticky">
            <SideMenus></SideMenus>
          </div>
          <div class="col-12 col-md-9">
            <adminTopBar></adminTopBar>
            <div class="p-2 mt-2 mt-md-4">
              <div class="col-12">
                <div class="row">
                  <div class="col-12 col-md-4">
                    <img src="../../assets/images/user-profile.jpg" />
                  </div>
                  <!--Col-->
                  <div class="col-12 col-md-8">
                    <h3>Dino Bartolome</h3>
                    <h3 class="text-gray since">Member Since: Aug 21, 2016</h3>
                    <div class="user-infos">
                      <p>
                        <strong>Email:</strong> testexample@gmail.com
                      </p>
                      <p>
                        <strong>Call:</strong> +134 134 1344
                      </p>
                      <p>
                        <strong>Address:</strong> xYz, street number, near by, Uk Wasingtone 632222
                      </p>
                    </div>
                  </div>
                  <!--Col-->
                </div>
                <!--//Row-->
                <div class="row mt-2 mt-sm-3 mt-md-4">
                  <div class="col-12">
                    <div class="card">
                      <div class="card-header">
                        <h4 class="font-weight-bold">About him</h4>
                      </div>
                      <div class="card-body">
                        <h5 class="card-title">Special title treatment</h5>
                        <p
                          class="card-text"
                        >Lorem Ipsum: usage Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <!--Row-->
                <div class="row mt-2 mt-sm-3 mt-md-4">
                  <div class="col-12">
                    <div class="card">
                      <div class="card-header">
                        <h4 class="font-weight-bold">Recent Posts</h4>
                      </div>
                      <div class="card-body">
                        <div class="row">
                          <div class="col-12 col-md-4">
                            <div class="card" style="width: 18rem;">
                              <img
                                class="card-img-top"
                                src="../../assets/images/league-logo.jpg"
                                alt="Card image cap"
                              />
                              <div class="card-body">
                                <h5 class="card-title">Post title</h5>
                                <h3 class="text-gray since">Aug 21, 2016</h3>
                              </div>
                            </div>
                          </div>
                          <!--Col-->
                          <div class="col-12 col-md-4">
                            <div class="card" style="width: 18rem;">
                              <img
                                class="card-img-top"
                                src="../../assets/images/league-logo.jpg"
                                alt="Card image cap"
                              />
                              <div class="card-body">
                                <h5 class="card-title">Post title</h5>
                                <h3 class="text-gray since">Aug 21, 2016</h3>
                              </div>
                            </div>
                          </div>
                          <!--Col-->
                          <div class="col-12 col-md-4">
                            <div class="card" style="width: 18rem;">
                              <img
                                class="card-img-top"
                                src="../../assets/images/league-logo.jpg"
                                alt="Card image cap"
                              />
                              <div class="card-body">
                                <h5 class="card-title">Post title</h5>
                                <h3 class="text-gray since">Aug 21, 2016</h3>
                              </div>
                            </div>
                          </div>
                          <!--Col-->
                        </div>
                        <!--Row-->
                      </div>
                    </div>
                  </div>
                </div>
                <!--Row-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SideMenus from "./admin_sidebar";
import adminTopBar from "./admin_top_bar";
export default {
  components: { SideMenus, adminTopBar },
  data() {
    return {
      // results: []
    };
  },

  beforeCreate: function() {
    if (!this.$session.exists()) {
      this.$router.push("/admin_login");
    }
  }
  // mounted() {
  //   this.axios.get("http://localhost:50000/Register").then(response => {
  //     this.results = response.data;
  //   });
  // }
};
</script>
<style scoped>
.since {
  font-size: 13px;
}
@media all and (max-width: 767px) {
  .col-md-4 img {
    width: 80%;
  }
}
</style>