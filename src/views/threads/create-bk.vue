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
                        <div class="row mt-2 mt-md-4 justify-content-center">
                            <div class="col-12 col-md-9">
                                <h4 class="text-white">Create Thread</h4>
                                <div class="create-post-form">
                                    <label>Title</label>
                                    <input type="text" v-model="thread_title" />
                                    <label>Description</label>
                                    <textarea v-model="thread_details"></textarea>
                                    <label>Add image OR Video</label>
                                    <input
                                            style="min-height:auto;color:#ccc"
                                            @change="getMediaUrl"
                                            class="p-0"
                                            type="file"
                                            name="fileupload"
                                    />
                                    <input style="display:none" type="text" v-model="thread_media" class="link" />
                                    <button @click="threadCreate" class="btn btn-info">Save</button>
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
    import TopBar from "../topbar.vue";
    import LeftMenu from "../leftmenu.vue";
    import Widget from "../widget.vue";

    export default {
        name: "createThread",
        components: { LeftMenu, TopBar, Widget },
        data() {
            return {
                thread_title: "",
                thread_details: "",
                thread_media: "img/league-of-legends.c77e2337.jpg",
                User: {}
            };
        },
        beforeCreate: function() {
            if (!this.$session.exists()) {
                this.$router.replace({ name: "login" });
            }
        },
        mounted() {
            this.User = this.$session.get("user_detail");
            //console.log(this.User);
        },
        methods: {
            getMediaUrl(event) {
                var file = event.target.files[0];
                var reader = new FileReader();
                reader.onload = function() {
                    this.thread_media = reader.result;
                    return reader.result;
                };

                reader.readAsDataURL(file);
            },

            threadCreate(e) {
                //alert(this.$session.get("token"));
                const auth = {
                    headers: {
                        Authorization: "Bearer " + this.$session.get("token")
                    }
                };
                e.preventDefault();
                this.axios
                    .post(
                        this.$servername + "/threads", {
                            group_id: this.$route.params.id,
                            user_id: this.User._id,
                            thread_title: this.thread_title,
                            thread_details: this.thread_details,
                            thread_media: this.thread_media
                        },
                        auth
                    )
                    .then(response => {
                        if (response.data.length !== 0) {
                            this.thread_title = "";
                            this.thread_details = "";
                            this.thread_media = "";

                            toastr.success('Thread created successfully!');
                            this.$router.push('/groups/' + this.$route.params.id);

                        } else {
                            console.log("Thread failed");
                        }
                        return response.data;
                    })
                    .catch(error => {
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