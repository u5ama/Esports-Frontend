<template>
  <div class="col-12 col-md-12 widgets">
    <div class="widget-inner pt-5" style="overflow: hidden !important;">
        <h3 style="color: white;">Games</h3>
      <div class="col-12">
        <div class="row pb-10" v-for="(game,index) in games" :key="index">
          <div class="col-5 col-md-5 pl-0">
              <img
                  style="height: 66px;width: 100%;padding:0"
                  class="img-fluid float-left"
                  :src="$servername + '/image/games/' + getImage(game)" @error="useSampleCover"
              />
          </div>
          <!--//Col-->
          <div class="col-7 col-md-7 p-0">
            <div class="bgdark" style="padding: 8px;height:100%">
                <span
                    class="text-white font-weight-bold"
                    style="width: 88%; display: inline-block;font-size: 14px;" >{{ getname(game) }}</span>
                <span
                    class="text-white font-weight-bold"
                    style="width: 88%; display: inline-block;font-size: 14px;" >Level: {{ game.level }}</span>
            </div>
          </div>
          <!--//Col-->
        </div>
        <!--//Row-->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Widgetl",
  data() {
    return {
      games:[],
      gameList:[]
    };
  },
  mounted() {
    this.axios.get(this.$servername + "/games").then(response => {
      this.gameList = response.data;
    });

    this.User = this.$session.get("user_detail");
    let user_id = this.User._id;
    this.axios.get(this.$servername + "/users/" + user_id).then(response => {
      let data = response.data;
      this.games = data.games?data.games:[];
    });
  },
  methods:{
    getname(game) {
        let game__id = game.game_id?game.game_id:game._id;
        let obj = this.gameList.find(o => o.id === game__id);
      // let obj = this.gameList.find(o => o._id === game.game_id?game.game_id:game._id);
      return obj.name;
    },
    getImage(game) {
        let game_id = game.game_id?game.game_id:game._id;
        let obj = this.gameList.find(o => o.id === game_id);
      // let obj = this.gameList.find(o => o._id === game.game_id?game.game_id:game._id);
      return obj.image;
    },
      useSampleCover(e) {
          e.target.src = "https://via.placeholder.com/300?text=Upload++Cover+Image"
      },
  }
};
</script>
<style scoped>
    .pb-10{
        padding-bottom: 10px;
    }
@media all and (max-width: 767px) {
  .widgets {
    margin-top: 10px;
  }
    .row.m-t-20 {
        margin-top: 20px;
    }
  .m-t-20 {
    margin-top: 20px !important;
  }
  .widget-inner .col-12.col-md-5.pl-0 {
    padding-right: 0;
  }
  .widgets .widget-inner {
    height: auto;

  }
  .bgdark {
    padding: 8px;
    height: 100% !important;
  }

}
</style>
