<template>
  <div class="container-fluid py-0 px-0">
    <div class="row">
      <div class="col-md-12">
        <div class="adminBody">
          <div class="container-fluid">
            <div class="col-12 p-md-0">
              <div class="row">
                <div class="col-3 p-md-0 sticky">
                  <SideMenus></SideMenus>
                </div>
                <div class="col-12 col-md-9">
                  <adminTopBar></adminTopBar>
                  <router-view/>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
    import SideMenus from "../admin/admin_sidebar";
    import adminTopBar from "../admin/admin_top_bar";
    export default {
        name: "Admin",
        components: { SideMenus, adminTopBar },
    }
</script>

<style scoped>

</style>