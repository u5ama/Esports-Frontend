<template>
            <div class="all_user_list">
              <div class="col-12">
                <h3 class="mb-3 pb-3 pb-md-4 mb-md-4 mt-3 mt-md-4 text-primary">All Groups</h3>
              </div>
              <div class="col-12">
                <router-link class="btn btn-success" to="/admin/groups/create">Create</router-link>
              </div>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(result, index) in results" v-bind:key="result.id">
                    <th scope="row">{{ (index + 1) }}</th>

                    <td>{{ result.name }}</td>
                    <td>{{ result.description }}</td>
                    <td>
                      <router-link :to="'/admin/groups/' + result.id "><i class="material-icons">
                        edit
                      </i>

                      </router-link>
                      <a href="#" @click.prevent="deleteGroup(result.id)"><i class="material-icons">
                        delete
                      </i></a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
</template>
<script>
export default {
  names: 'GamesManagement',
  data() {
    return {
      results: []
    };
  },
  methods: {
    fetchGroups() {
      this.axios.get(this.$servername + "/groups").then(response => {
        this.results = response.data.data;
      });
    },
      deleteGroup(id) {
      if(confirm('Are you sure, you want to delete this group?')) {
        this.axios.delete(this.$servername + '/groups/' + id)
          .then((response) => {
            console.info('response: ', response);
            if(response.data.status == true) {
              this.fetchGroups();
            }
          })
          .catch((errors) => {
            console.info('errors: ', errors);
          })
      }
    }
  },
  beforeCreate: function() {
      console.info('this.$session.exists(): ', this.$session.exists());
    if (!this.$session.exists()) {
      this.$router.push("/admin_login");
    }
  },
  mounted() {
    this.fetchGroups();
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