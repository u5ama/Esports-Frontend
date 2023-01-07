<template>
    <div class="row">
        <div class="col-12">
            <div class="row">
                <div class="col-12">
                    <h3 class="text-white">Live Streaming</h3>
                    <br>
                    <vplayer v-if="LiveStream" :playerOptions="vOption" @onplay="play" @onerror="errorPlay" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { vplayer } from 'vue-hls-player'
    export default {
    components: { vplayer },
data() {
    return {
        id:'',
        streamid:'',
        LiveStream:false,
        vOption:{
            preload: false,
            type: "application/x-mpegURL",
            //src: 'https://wowzaprod225-i.akamaihd.net/hls/live/1006166/5538ebf0/playlist.m3u8',
            //preload: false,
            autoplay: false,
            isLoop: false,
            playsinline: false,
           // poster: 'https://oimdztrab.qnssl.com/Frp4SyVe5PosdkUKRaE-krjK7B5z',
            controls: 'progress,current,duration,volume',
            crossOrigin: false //设置视频的 CORS 设置。
        }
    };
},
    beforeCreate: function() {
        if (!this.$session.exists()) {
            this.$router.replace({ name: "login" });
        }else{
            if(!this.$session.get("user_detail")){
                this.$router.replace({ name: "login" });
            }
        }
    },
    mounted() {
        this.getByID();
    },
    methods:{
        getByID(){
            this.id = this.$route.params.id;
            this.axios.get(this.$servername + '/streams/getStreamById/' + this.id)
                .then((response) => {
                    this.vOption.src = response.data.live_stream.player_hls_playback_url;
                    this.streamid = response.data.live_stream.id;
                    this.LiveStream = true;
                    this.getThumbnail();
                })
                .catch(err => console.info('err: ', err));
        },
        getThumbnail(){
            this.axios.get(this.$servername + '/streams/getThumbnails/' + this.streamid)
                .then((response) => {
                    this.vOption.poster = response.data.live_stream.thumbnail_url;
                })
                .catch(err => console.info('err: ', err));
        },
        play(e){
            //console.log(e)
            //console.log(this.vOption)
        },
        errorPlay(e){
           // console.log('errorPlay')
            //console.log(e)
        }
    }
};

</script>
