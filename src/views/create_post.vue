<template>

  <div class="col-12 co border-c py-3">
    <div class="col-12">
      <div class="row mt-2 mt-md-4 justify-content-center">
        <div class="col-12 col-md-9">
          <h4 class="text-white">Create post</h4>
          <div class="create-post-form">
            <label>Post Title</label>
            <input type="text" v-model="post_title"/>
            <label>Post Description</label>
            <textarea v-model="post_details"></textarea>
            <label>Add image OR Video</label>
            <input
                    style="min-height:auto;color:#ccc"
                    @change="getMediaUrl"
                    class="p-0"
                    type="file"
                    name="fileupload"
                    id="fileupload"

            />
            <button @click="postCreate" class="btn btn-info">Save</button>
          </div>
        </div>
        <!--//Col-->
      </div>
      <!--//Row-->
    </div>
  </div>
</template>
<script>

export default {
    data() {
        return {
            post_title: "",
            post_details: "",
            post_media: ""
        };
    },
    beforeCreate: function () {
        if (!this.$session.exists()) {
            this.$router.replace({name: "login"});
        } else {
            if (!this.$session.get("user_detail")) {
                this.$router.replace({name: "login"});
            }
        }
    },
  methods: {
      getMediaUrl(event) {
          this.post_media = event.target.files[0];
      },
      postCreate(e) {
          e.preventDefault();
          let formData = new FormData();
          formData.append('post_title', this.post_title);
          formData.append('post_details', this.post_details);
          formData.append('post_media', this.post_media);

          this.axios
          .post(this.$servername + "/posts/createpost", formData)
          .then(response => {
              if (response.data.status == true) {
                  this.post_title = "";
                  this.post_details = "";
                  this.post_media = "";
                  document.getElementById("fileupload").value = "";
                  toastr.success(response.data.message);
              } else {
                  toastr.error('Unable to create post, please try again!');
              }
              return response.data;
          })
            .catch(error => {
                toastr.error(errors);
                return error;
          });
      }
  }
};
</script>

<style scoped>
  .create-post-form {
    margin-top: 50px;
  }

  .create-post-form input,
  .create-post-form textarea {
    background: rgba(0, 0, 0, 0.2);
    border: none;
    border-radius: 5px;
    width: 100%;
    margin-bottom: 15px;
    min-height: 50px;
    padding: 0 15px;
    color: #ccc;
  }

  .create-post-form textarea {
    height: 170px;
  }

  .create-post-form label {
    color: #4871c8;
  }
</style>
