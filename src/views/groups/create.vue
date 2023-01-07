<template>
    <div class="row mb-3">
        <div class="col-md-12">
            <button class="btn btn-success" @click="handleModal"> New Group</button>

            <!-- Modal -->
            <div class="modal fade" id="groupModal" tabindex="-1" role="dialog" aria-labelledby="groupModalLabel" aria-hidden="true" >
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="groupModalLabel">Create Group</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <ajax-loader :isLoading="isLoading"></ajax-loader>

                            <div class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label>Name</label>
                                            <input type="text" v-model.trim="$v.name.$model" name="name" id="name"
                                                   class="form-control">
                                            <div class="error"
                                                 v-if="$v.name.$dirty && $v.name.$error && !$v.name.required">Group
                                                Name is required
                                            </div>
                                            <div class="error"
                                                 v-if="$v.name.$dirty && $v.name.$error && !$v.name.minLength">Group
                                                Name must contain at least 1 character!
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
                                        <div class="form-group">
                                            <label>Description</label>
                                            <textarea class="form-control" name="description" id="description"
                                                      v-model="$v.description.$model"></textarea>
                                            <div class="error"
                                                 v-if="$v.description.$dirty && $v.description.$error && !$v.description.required">
                                                Group description is required
                                            </div>

                                            <div class="error"
                                                 v-if="$v.description.$dirty && $v.description.$error && !$v.description.minLength">
                                                Group description must be at least 5 characters!
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" >Close</button>
                            <button type="button" @click="createGroup" id="btn-create-grp" class="btn btn-success">Create
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import {required, minLength} from 'vuelidate/lib/validators';
    import {EventBus} from '../../eventbus';
    import AjaxLoader from "../../components/AjaxLoader";

    export default {
        name: "createGroup",
        components: {required, minLength, AjaxLoader},
        data() {
            return {
                //results: [],
                name: '',
                groupImage: '',
                description: '',
                user : '',

                isLoading: false,
            }
        },

        validations: {
            name: {
                required,
                minLength: minLength(1)
            },
            //gameImage: {required},
            description: {
                required,
                minLength: minLength(5)
            }
        },

        mounted() {
            this.user = this.$session.get("user_detail");
        },

        methods: {
            handleModal() {
                $('#groupModal').modal('show')
            },
            handleFileUpload() {
                this.groupImage = this.$refs.file.files[0];
            },

            createGroup() {
                this.$v.$touch();
                if (this.$v.$invalid) {
                    console.info('is invalid');
                    this.submitStatus = 'ERROR'
                } else {
                    // showing loader.
                    this.isLoading = true;

                    let formObj = new FormData();
                    //appending to formData Object
                    formObj.append('image', this.groupImage);
                    formObj.append('name', this.name);
                    formObj.append('description', this.description);
                    formObj.append('user_id', this.user._id);

                    this.axios.post(this.$servername + '/groups/', formObj)
                        .then((response) => {
                            if(response.data.status == true) {

                                this.name = '';
                                this.description = '';

                                toastr.success(response.data.message);
                                $('#groupModal').modal('hide')
                                this.$emit('groupCreated');
                                EventBus.$emit('groupCreated');

                                // this works even better - using Vue.nextTick method
                                this.$nextTick(() => { this.$v.$reset() })

                                //hiding the loader.
                                this.isLoading = false
                            }
                        })
                        .catch((errors) => {
                            console.info('errors:: ', errors, errors.code, errors.message)
                            toastr.error(errors);

                            $('#btn-create-grp').prop("disabled", false);
                            // add spinner to button
                            $('#btn-create-grp').html('Create');
                        });
                }
            }
        }
    }
</script>

<style scoped>
.form-group .error {
    color: #ff0507;
}
</style>