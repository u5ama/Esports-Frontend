<template>
  <div class="all_user_list">
    <div class="col-12">
      <h3 class="mb-3 pb-3 pb-md-4 mb-md-4 mt-3 mt-md-4 text-primary">All Registered User</h3>
    </div>
    <table class="table table-striped">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">User Name</th>
        <th scope="col">Email</th>
        <th scope="col">Password</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="result in results" v-bind:key="result.id">
        <th scope="row">{{ result.id }}</th>
        <td>
          <router-link to="/admin/user_view">{{ result.username }}</router-link>
        </td>
        <td>{{ result.email }}</td>
        <td>{{ result.hash }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                results: []
            };
        },
        beforeCreate: function () {
            if (!this.$session.exists()) {
                this.$router.push("/admin/login");
            }
        },
        mounted() {
            this.axios.get(this.$servername + "/users").then(response => {
                this.results = response.data;
            });
        }
    };
</script>
<style scoped>
  .all_user_list {
    padding: 15px;
  }

  .view-btn i {
    float: left;
    margin-right: 5px;
  }

  td {
    word-break: break-all;
  }
</style>