<template>
    <div class="row mb-3">
        <div class="col-md-12">
            <button class="btn btn-success pr-2 btn-sm" @click="handleModal"> New Thread</button>

            <!-- Modal -->
            <div class="modal fade" id="threadModal" tabindex="-1" role="dialog" aria-labelledby="threadModalLabel" aria-hidden="true" >
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="groupModalLabel">Create Thread</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <ajax-loader :isLoading="isLoading" />

                            <div class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label>Name</label>
                                            <input type="text" v-model.trim="$v.name.$model" name="name" id="name"
                                                   class="form-control">
                                            <div class="error"
                                                 v-if="$v.name.$dirty && $v.name.$error && !$v.name.required">Thread Name is required
                                            </div>
                                            <div class="error"
                                                 v-if="$v.name.$dirty && $v.name.$error && !$v.name.minLength">Thread Name must contain at least 1 character!
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-6">
                                        <div class="form-group">
                                            <label>Group Name</label>
                                            <!--<input type="text" v-model.trim="$v.name.$model" name="groupName"
                                                   id="group-name"
                                                   class="form-control">-->
                                            <select
                                                    class="form-control"
                                                    v-model.trim="$v.groupName.$model"
                                                    name="groupName"
                                                    id="group-name">
                                                <option value="">Select a Group</option>
                                                <option v-for="group in groups" :value="group._id" >
                                                    {{group.name}}
                                                </option>
                                            </select>
                                            <div class="error"
                                                 v-if="$v.groupName.$dirty && $v.groupName.$error && !$v.groupName.required">Group
                                                                                                              Name is required
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-12">
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
                                                Thread description is required
                                            </div>

                                            <div class="error"
                                                 v-if="$v.description.$dirty && $v.description.$error && !$v.description.minLength">
                                                Thread description must be at least 5 characters!
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" >Close</button>
                            <button type="button" @click="createThread" id="btn-create-grp" class="btn btn-success">Create
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
        name: "createThread",
        components: {required, minLength, AjaxLoader},
        data() {
            return {
                groups: [],
                name: '',
                groupName: '',
                threadImage: '',
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
            groupName: {
                required
            },
            description: {
                required,
                minLength: minLength(5)
            }
        },

        mounted() {
            this.user = this.$session.get("user_detail");

            this.getGroupsList();
        },

        methods: {
            getGroupsList() {
                this.axios.get(this.$servername + '/groups/all-by-user/' + this.user._id)
                        .then(response => {
                            this.groups = response.data.data;
                        })
                        .catch(error => {
                            console.info('error got:: ', error);
                        });
            },
            handleModal() {
                $('#threadModal').modal('show')
            },
            handleFileUpload() {
                this.threadImage = this.$refs.file.files[0];
            },

            createThread() {
                this.$v.$touch();

                if (this.$v.$invalid) {
                    console.info('is invalid');
                    this.submitStatus = 'ERROR'
                } else {
                    // showing loader.
                    this.isLoading = true;
                    let formObj = new FormData();
                    //appending to formData Object

                    formObj.append('image', this.threadImage);
                    formObj.append('name', this.name);
                    formObj.append('description', this.description);
                    formObj.append('user_id', this.user._id);
                    formObj.append('group_id', this.groupName);

                    this.axios.post(this.$servername + '/threads', formObj)
                        .then((response) => {
                            if(response.data.status == true) {
                                this.name = '';
                                this.description = '';

                                toastr.success(response.data.message);
                                $('#threadModal').modal('hide');

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