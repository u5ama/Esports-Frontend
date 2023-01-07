<template>

                        <div class="all_user_list">
                            <div class="col-12">
                                <h3 class="mb-3 pb-3 pb-md-4 mb-md-4 mt-3 mt-md-4 text-primary">Create new Game</h3>
                            </div>

                            <div class="col-12">
                                    <div class="row">
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label>Name</label>
                                                <input type="text" v-model.trim="$v.name.$model" name="name" id="name"
                                                       class="form-control">
                                                <div class="error"
                                                     v-if="$v.name.$dirty && $v.name.$error && !$v.name.required">Game
                                                    Name is required
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-6">
                                            <div class="form-group">
                                                <label>Image</label>
                                                <input type="file" name="image" id="image" class="form-control"
                                                       @change="handleFileUpload" ref="file">
                                                <!--<div class="error" v-if="$v.gameImage.$dirty && $v.gameImage.$error && !$v.gameImage.required">Game Image is required</div>-->
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-12">
                                            <label>Description</label>
                                            <textarea class="form-control" name="description" id="description"
                                                      v-model="$v.description.$model"></textarea>
                                            <div class="error"
                                                 v-if="$v.description.$dirty && $v.description.$error && !$v.description.required">
                                                Game description is required
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mt-4">
                                        <div class="col-md-1">
                                            <button type="button" @click="createGame" class="btn btn-success">Create
                                            </button>
                                        </div>

                                        <div class="col-md-1">
                                            <button type="button" class="btn btn-primary" @click="window.history.back()">cancel</button>
                                        </div>
                                    </div>
                            </div>

                        </div>
</template>
<script>
    import {required, minLength} from 'vuelidate/lib/validators';

    export default {
        names: 'GamesManagement',
        components: {required, minLength},
        data() {
            return {
                //results: [],
                name: '',
                gameImage: '',
                description: ''
            }
        },

        validations: {
            name: {
                required,
                minLength: minLength(4)
            },
            //gameImage: {required},
            description: {
                required,
                minLength: minLength(10)
            }
        },

        methods: {
            handleFileUpload() {
                this.gameImage = this.$refs.file.files[0];
            },

            createGame() {
                this.$v.$touch();
                if (this.$v.$invalid) {
                    this.submitStatus = 'ERROR'
                } else {
                    let formObj = new FormData();
                    //appending to formData Object
                    formObj.append('image', this.gameImage);
                    formObj.append('name', this.name);
                    formObj.append('description', this.description);

                    this.axios.post(this.$servername + '/games/', formObj)
                        .then((response) => {
                            console.info('response', response);
                            if(response.data.status == true) {
                                this.$router.push('/admin/games');
                            }
                        })
                        .catch((errors) => {
                            console.info('errors: ', errors)
                        });
                }
            }
        },
        beforeCreate: function () {
            if (!this.$session.exists()) {
                this.$router.push("/admin_login");
            }
        },
        mounted() {
            /*this.axios.get(this.$servername + "/users").then(response => {
                this.results = response.data;
            });*/
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