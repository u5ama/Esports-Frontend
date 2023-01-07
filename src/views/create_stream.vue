<template>
    <div class="col-12 co border-c py-3">
        <div class="col-12">
            <div class="row mt-2 mt-md-4 justify-content-center scroll-div">
                <div class="col-12" v-show="streamContent">
                    <div class="row mt-2 mt-md-4 justify-content-center border-c py-3">
                        <div class="col-12 col-md-4">
                            <button @click="start()" class="btn btn-success">Start Stream</button>
                        </div>
                        <div class="col-12 col-md-4">
                            <button @click="editStream()" class="btn btn-info">Edit Stream</button>
                        </div>
                        <div class="col-12 col-md-4">
                            <button @click="stop()" class="btn btn-danger">Stop Stream</button>
                        </div>
                    </div>
                    <div class="row mt-5 mt-md-5 border-c py-3" v-show="txt">
                        <div class="col-12 col-md-12">
                            <h4 class="text-white">Use these credentials to connect with OBS</h4>
                        </div>
                        <div class="col-12 col-md-12 mt-5">
                            <p class="text-white fnt">Server: &nbsp; rtmp://{{stream_server}}/{{stream_app}}</p>
                        </div>
                        <div class="col-12 col-md-12">
                            <p class="text-white fnt">Stream Name: &nbsp; {{stream_name}}</p>
                        </div>
                        <div class="col-12 col-md-12">
                            <p class="text-white fnt">Username: &nbsp; {{stream_username}}</p>
                        </div>
                        <div class="col-12 col-md-12">
                            <p class="text-white fnt">Password: &nbsp; {{stream_password}}</p>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-9 mt-2" v-show="form">
                    <h4 class="text-white">{{title}} Live Stream</h4>
                    <div class="create-post-form">
                        <label>Stream Title</label>
                        <input type="text" v-model.trim="$v.st_title.$model"/>
                        <div class="error" v-if="$v.st_title.$dirty && $v.st_title.$error && !$v.st_title.required">Stream Title is required</div>

                        <label>Stream Username</label>
                        <input type="text" v-model.trim="$v.st_user.$model"/>
                        <div class="error" v-if="$v.st_user.$dirty && $v.st_user.$error && !$v.st_user.required">Stream Username is required</div>

                        <label>Stream Password</label>
                        <input type="password" v-model.trim="$v.st_password.$model"/>
                        <div class="error" v-if="$v.st_password.$dirty && $v.st_password.$error && !$v.st_password.required">Stream Password is required</div>
                        <div v-show="host">
                        <label>Hosted Page Title</label>
                        <input type="text" v-model.trim="$v.st_pg_title.$model"/>
                        <div class="error" v-if="$v.st_pg_title.$dirty && $v.st_pg_title.$error && !$v.st_pg_title.required">Hosted Page Title is required</div>
                        </div>
                        <div v-if="butn">
                            <button v-on:click="postCreate" class="btn btn-info">Create</button>
                        </div>
                        <div v-else>
                            <button v-on:click="updatePost" class="btn btn-info">Update</button>
                        </div>
                    </div>
                </div>
                <!--//Col-->
            </div>
            <!--//Row-->
        </div>
    </div>
</template>
<script>
    import {alphaNum, email, minLength, required} from "vuelidate/lib/validators";

export default {
    data() {
        return {
            st_title: '',
            st_user: '',
            st_password: '',
            st_pg_title:'',
            streamid:'',
            title:'',
            butn:true,
            host:true,
            streamContent:false,
            form:false,
            txt:true,
            stream_server:'',
            stream_name:'',
            stream_username:'',
            stream_password:'',
            stream_app:'',
        }
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
    validations: {
        st_title: {
            required,
            minLength: minLength(4)
        },
        st_user: {
            required,
            minLength: minLength(4),
            alphaNum:alphaNum
        },
        st_password: {
            required
        },
        st_pg_title: {
            required,
            minLength: minLength(4),
        }
    },
    mounted(){
        this.getId();
    },
    methods:{
        editStream(){
            this.form = true;
            this.txt = false;
        },
    getId(){
        this.axios.get(this.$servername + '/streams/getId')
        .then((response) => {
            const arr = response.data;
            let st_id ='';
            let userid = '';
            arr.forEach(function(part) {
                st_id = part.stream_id,
                    userid = part._id
            });
            if(userid !== ''){
                this.title = 'Edit';
                this.butn = false;
                this.streamid = st_id;
                this.id = this.streamid;
                this.host = false;
                this.streamContent = true;
                this.getData();
                this.axios.get(this.$servername + '/streams/getById/' + this.id)
                    .then((response) => {
                        response.data.live_stream
                        this.st_title = response.data.live_stream.name;
                        this.st_user = response.data.live_stream.source_connection_information.username;
                        this.st_password = response.data.live_stream.source_connection_information.password;
                        this.st_pg_title = "";
                    })
                    .catch(err => console.info('err: ', err));
            }else{
                this.title = 'Create';
                this.btntitle = 'Create';
                this.form = true;
            }
        })
        .catch(err => console.info('err: ', err));
    },
    getData(){
        this.id = this.streamid;
        this.axios.get(this.$servername + '/streams/getById/' + this.id)
            .then((response) => {
                this.stream_server = response.data.live_stream.source_connection_information.primary_server;
                this.stream_app = response.data.live_stream.source_connection_information.application;
                this.stream_name = response.data.live_stream.source_connection_information.stream_name;
                this.stream_username = response.data.live_stream.source_connection_information.username;
                this.stream_password = response.data.live_stream.source_connection_information.password;
            })
            .catch(err => console.info('err: ', err));
    },
    start(){
        this.axios
            .put(this.$servername + '/streams/start/' + this.streamid)
            .then(response => {
                if (response.data.live_stream.state === 'starting') {
                    toastr.success('Your Stream is starting');

                } else {
                    //console.log(response.data)
                    toastr.error('Unable to create post, please try again!');
                }
                return response.data.live_stream;
            })
    },
    stop(){
        this.axios
            .put(this.$servername + '/streams/stop/' + this.streamid)
            .then(response => {
                if (response.data.live_stream.state == 'stopped') {
                    toastr.success('Your stream is stopped');
                } else {
                    toastr.error('Unable to create post, please try again!');
                }
                return response.data.live_stream;
            })
    },
    postCreate() {
        this.$v.$touch()
        if (this.$v.$invalid) {
            this.submitStatus = 'ERROR'
        }else{
            this.axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            this.axios
            .post(this.$servername + "/streams/createstream", {st_title: this.st_title, st_user: this.st_user,st_password: this.st_password, st_pg_title: this.st_pg_title})
            .then(response => {
                if (response.data.status == true) {
                    this.st_title = "";
                    this.st_user = "";
                    this.st_password = "";
                    this.st_pg_title = "";
                    toastr.success(response.data.message);
                } else {
                    toastr.error('Unable to create stream, please try again!');
                }
                return response.data;
            })
            .catch(error => {
                toastr.error(errors);
                return error;
            });
        }
    },
    updatePost(){
        this.$v.$touch()
        if (this.$v.$invalid) {
            this.submitStatus = 'ERROR'
        }else{
            this.axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            this.axios
                .post(this.$servername + "/streams/updatestream" + this.streamid, {st_title: this.st_title, st_user: this.st_user,st_password: this.st_password, st_pg_title: this.st_title})
                .then(response => {
                    if (response.data.status == true) {
                        this.st_title = "";
                        this.st_user = "";
                        this.st_password = "";
                        this.st_pg_title = "";
                        toastr.success(response.data.message);
                    } else {
                        toastr.error('Unable to create stream, please try again!');
                    }
                    return response.data;
                })
                .catch(error => {
                    toastr.error(errors);
                    return error;
                });
            }
        }
    }
}
</script>

<style scoped>
    .scroll-div{
        height: 79vh;
        overflow-y: auto;
        overflow-x: hidden;
    }
    /* width */
    .scroll-div::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    .scroll-div::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Handle */
    .scroll-div::-webkit-scrollbar-thumb {
        background: transparent;
    }

    /* Handle on hover */
    .scroll-div::-webkit-scrollbar-thumb:hover {
        background: transparent;
    }
    .create-post-form {
        margin-top: 50px;
    }
    .create-post-form input {
        background: rgba(0, 0, 0, 0.2);
        border: none;
        border-radius: 5px;
        width: 100%;
        margin-bottom: 15px;
        min-height: 50px;
        padding: 0 15px;
        color: #ccc;
    }
    .create-post-form label {
        color: #4871c8;
    }
</style>