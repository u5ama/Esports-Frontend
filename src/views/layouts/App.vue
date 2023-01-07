<template>
  <div class="container-fluid py-0 px-0">
    <div class="mb-3 sticky-topbar">
      <TopBar @doSearch="searchtop"></TopBar>
    </div>
    <div class="col-12 main-feed">
      <div class="row">
        <LeftMenu></LeftMenu>
        <div :class="containerClass">
          <router-view :GlobalSearchResult="GlobalSearchResult" :search_q="search_q"></router-view>
        </div>
        <Widget></Widget>
      </div>
    </div>
  </div>
</template>

<script>
    import TopBar from "../topbar";
    import LeftMenu from "../leftmenu";
    import Widget from "../widget";
    export default {
        name: "App",
        components: {TopBar, LeftMenu, Widget},
        computed: {
            containerClass () {
                return this.$route.name == 'myposts' ? 'col-md-7' : 'col-md-7';
            }
        },
      data() {
        return {
          results: [],
          results_intact: [],
          q:'',
          GlobalSearchResult:[],
          search_q:''
        };
      },
        methods: {
            searchtop(data) {
                this.GlobalSearchResult = data.GlobalSearchResult;
                this.search_q = data.search_q;
              //console.log(this.search_q);
            },
        },
        mounted() {
        }
    }
</script>

<style scoped>

</style>