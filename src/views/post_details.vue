<template>
  <div class="container-fluid py-0 px-0">
    <div class="mb-3 sticky-topbar">
      <TopBar></TopBar>
    </div>
    <div class="col-12 main-feed">
      <div class="row">
        <LeftMenu></LeftMenu>
        <div class="col-12 col-md-7 border-c py-3">
          <div class="col-12">
            <div class="row">
              <div class="col-12">
                <img class="img-fluid" src="@/assets/images/league-of-legends.jpg" />
              </div>
              <!--//Col-->
            </div>
            <!--//Row-->
            <div class="row main-legend">
              <div class="col-3">
                <img
                  style="max-width:100%"
                  class="rounded-circle img-fluid"
                  src="@/assets/images/league-logo.jpg"
                />
              </div>
              <!--//Col-->
              <div class="col-9 text-white">
                <p
                  class="lead"
                >Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator/p></p>
                <div class="post-footer">
                  <div class="row">
                    <div class="col-4 text-white">
                      <button class="text-white pt-3">
                        <i class="material-icons float-left mr-3">favorite_border</i> Like
                      </button>
                    </div>
                    <div class="col-4 text-center">
                      <button class="text-white pt-3">
                        <i class="material-icons float-left mr-3">mode_comment</i> Comment
                      </button>
                    </div>
                    <div class="col-4 text-right">
                      <button class="text-white pt-3">
                        <i class="material-icons float-left mr-3">share</i> Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!--//Col-->
            </div>
            <!--//Row-->
            <div class="row mt-2 mt-md-4 justify-content-center">
              <div class="col-12 col-md-9">
                <div class="text-white text-left post-card">
                  <div class="post-card-head">
                    <img
                      style="max-width:40px;padding:0"
                      class="rounded-circle float-left"
                      src="@/assets/images/league-logo.jpg"
                    />
                  </div>
                  <div class="text-white text-left post-card-info">
                    <span
                      class="text-white font-weight-bold"
                      style="width: 88%; display: inline-block;font-size: 14px;"
                    >League of Lagends</span>
                    <p>Lorem ipsum, or lipsum as it is sometimes knownt...</p>
                    <p class="posted">posted on Aug 21, 2019</p>
                  </div>
                </div>
                <div class="post-image">
                  <img class="img-fluid" src="@/assets/images/league-of-legends.jpg" />
                </div>
              </div>
              <!--//Col-->
            </div>
            <!--//Row-->
            <div class="row mt-2 mt-md-4 justify-content-center">
              <div class="col-12 col-md-9">
                <div class="text-white text-left post-card">
                  <div class="post-card-head">
                    <img
                      style="max-width:40px;padding:0"
                      class="rounded-circle float-left"
                      src="@/assets/images/league-logo.jpg"
                    />
                  </div>
                  <div class="text-white text-left post-card-info">
                    <span
                      class="text-white font-weight-bold"
                      style="width: 88%; display: inline-block;font-size: 14px;"
                    >League of Lagends</span>
                    <p>Lorem ipsum, or lipsum as it is sometimes knownt...</p>
                    <p class="posted">posted on Aug 21, 2019</p>
                  </div>
                </div>
                <div class="post-image">
                  <img class="img-fluid" src="@/assets/images/league-of-legends.jpg" />
                </div>
              </div>
              <!--//Col-->
            </div>
            <!--//Row-->
            <div class="row mt-2 mt-md-4 justify-content-center">
              <div class="col-12 col-md-9">
                <div class="text-white text-left post-card">
                  <div class="post-card-head">
                    <img
                      style="max-width:40px;padding:0"
                      class="rounded-circle float-left"
                      src="@/assets/images/league-logo.jpg"
                    />
                  </div>
                  <div class="text-white text-left post-card-info">
                    <span
                      class="text-white font-weight-bold"
                      style="width: 88%; display: inline-block;font-size: 14px;"
                    >League of Lagends</span>
                    <p>Lorem ipsum, or lipsum as it is sometimes knownt...</p>
                    <p class="posted">posted on Aug 21, 2019</p>
                  </div>
                </div>
                <div class="post-image">
                  <img class="img-fluid" src="@/assets/images/league-of-legends.jpg" />
                </div>
              </div>
              <!--//Col-->
            </div>
            <!--//Row-->
          </div>
        </div>
        <Widget></Widget>
      </div>
    </div>
  </div>
</template>
<script>
import TopBar from "./topbar.vue";
import LeftMenu from "./leftmenu.vue";
import Widget from "./widget.vue";

export default {
  components: { LeftMenu, TopBar, Widget }
};
</script>

<style scoped>
.lead {
  font-size: 18px;
}
.main-legend {
  margin-bottom: 50px;
}
.main-legend img {
  margin-top: -50px;
}
.row.justify-content-center .col-md-9 {
  border: solid 1px #223e79;
  padding: 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.1);
}
.post-card-head {
  position: absolute;
}
.post-card-info {
  padding-left: 80px;
}
</style>