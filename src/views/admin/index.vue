<template>

  <div class="p-3">
    <div class="col-12">
      <h3 class="mb-3 pb-3 pb-md-4 mb-md-4 mt-3 mt-md-4 text-primary">DashBoard</h3>
    </div>
    <div class="clearfix"></div>
    <div class="col-12">
      <div class="row">
        <div class="col-12 col-md-4">
          <div class="status-box blue">
            <h5 class="mb-2 mb-sm-3 mb-md-4">Current Online Users</h5>
            <div class="currentData">
              <i class="material-icons float-left mr-2">account_circle</i> 2000
            </div>
          </div>
        </div>
        <!--Col-->
        <div class="col-12 col-md-4">
          <div class="status-box red">
            <h5 class="mb-2 mb-sm-3 mb-md-4">New Pending Users</h5>
            <div class="currentData">
              <i class="material-icons float-left mr-2">account_circle</i> 1500
            </div>
          </div>
        </div>
        <!--Col-->
        <div class="col-12 col-md-4">
          <div class="status-box green">
            <h5 class="mb-2 mb-sm-3 mb-md-4">Total Users</h5>
            <div class="currentData">
              <i class="material-icons float-left mr-2">account_circle</i> 3000
            </div>
          </div>
        </div>
        <!--Col-->
      </div>
      <!--//Row-->
    </div>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                // results: []
            };
        },
        beforeCreate: function () {
            if (!this.$session.exists()) {
                this.$router.push("/admin/login");
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
  .status-box {
    padding: 35px;
    border-radius: 8px;
    color: #fff;
    box-shadow: 0 0 20px 0px #777;
    -o-box-shadow: 0 0 20px 0px #777;
    -ms-box-shadow: 0 0 20px 0px #777;
    -moz-box-shadow: 0 0 20px 0px #777;
  }

  .status-box.blue {
    background: linear-gradient(#325ab1 0%, #082157 100%);
  }

  .status-box.red {
    background: linear-gradient(#b13232 0%, #570808 100%);
  }

  .status-box.green {
    background: linear-gradient(#32b163 0%, #085719 100%);
  }

  .currentData {
    font-size: 50px;
  }

  .currentData i {
    position: absolute;
    opacity: 0.2;
    font-size: 80px;
    right: 6px;
    bottom: 0px;
  }

  @media all and (max-width: 767px) {
    .status-box {
      margin-bottom: 20px;
    }
  }
</style>