<template>
    <div class="col-12 co border-c py-3" style="height: 88vh;">
        <div class="col-12">
            <div class="row mt-2 mt-md-4 justify-content-center border-c py-3">
                <div class="col-12 col-md-6">
                    <button @click="start()" class="btn btn-success">Start Stream</button>
                </div>
                <div class="col-12 col-md-6">
                    <button @click="stop()" class="btn btn-danger">Stop Stream</button>
                </div>
            </div>
            <div class="row mt-5 mt-md-5 border-c py-3">
                <div class="col-12 col-md-12">
                    <h4 class="text-white">Use these credentials to connect with OBS</h4>
                </div>
                <div class="col-12 col-md-12 mt-5">
                    <p class="text-white fnt">Server: &nbsp; rtmp://{{stream_server}}</p>
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
    </div>
</template>
<script>
    export default{
        data() {
            return{
                streamid:'',
                createdBy:'',
                id:'',
                stream_server:'',
                stream_name:'',
                stream_username:'',
                stream_password:'',
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
        mounted() {
            this.user = this.$session.get("user_detail")
            this.getId();
        },
        methods:{
            getId(){
                this.axios.get(this.$servername + '/streams/getId')
                    .then((response) => {
                        const arr = response.data;
                        let st_id='';
                        arr.forEach(function(part) {
                             st_id = part.stream_id
                        });
                        this.streamid = st_id;
                        this.getData();
                    })
                    .catch(err => console.info('err: ', err));
            },
            getData(){
                this.id = this.streamid;
                this.axios.get(this.$servername + '/streams/getById/' + this.id)
                    .then((response) => {
                        this.stream_server = response.data.live_stream.source_connection_information.primary_server;
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
                        if (response.data.live_stream.state == 'starting') {
                            toastr.success('Your Stream is starting');
                        } else {
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
            delete(){

            }
        }
    }
</script>

<style scoped>
.fnt{
    font-size: 14px !important;
}
</style>