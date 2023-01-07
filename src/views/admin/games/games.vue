<template>
            <div class="all_user_list">
              <div class="col-12">
                <h3 class="mb-3 pb-3 pb-md-4 mb-md-4 mt-3 mt-md-4 text-primary">All Games</h3>
              </div>
              <div class="col-12">
                <router-link class="btn btn-success" to="/admin/games/create">Create</router-link>
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
                      <router-link :to="'/admin/games/edit/' + result.id "><i class="material-icons">
                        edit
                      </i>

                      </router-link>
                      <a href="#" @click.prevent="deleteGame(result.id)"><i class="material-icons">
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
    fetchGames() {
      this.axios.get(this.$servername + "/games").then(response => {
        this.results = response.data;
      });
    },
    deleteGame(id) {
      if(confirm('Are you sure, you want to delte this game?')) {
        this.axios.delete(this.$servername + '/games/' + id)
                .then((response) => {
                  console.info('response: ', response);
                  if(response.data.status == true) {
                    this.fetchGames();
                  }
                })
                .catch((errors) => {
                  console.info('errors: ', errors);
                })
      }
    }
  },
  beforeCreate: function() {
    if (!this.$session.exists()) {
      this.$router.push("/admin_login");
    }
  },
  mounted() {
    this.fetchGames();
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