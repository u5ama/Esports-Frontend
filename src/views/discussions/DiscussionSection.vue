<template>
    <div :class="'col-12 border-c ' + containerClass">
        <div class="row ">
            <div class="col-md-4 border-c pt-2" id="thread-btn-container">
                <div class="row">
                    <div class="col-md-6">
                        <router-link v-if="mode != 'widget'" :to="backUrl" class="text-white"><i class="material-icons">keyboard_backspace</i></router-link>
                        <a href="#" @click.prevent="handleClick" v-else><i class="material-icons text-white">keyboard_backspace</i></a>
                    </div>

                    <div class="col-md-6">
                        <create-thread v-if="mode != 'widget'"></create-thread>
                    </div>
                </div>
            </div>
            <div class="col-md-8 pt-2">
                <h3 class="text-white">{{threadTitle}}</h3>
            </div>
        </div>
        <div class="row">
            <div id="left-pane-container" :class="((mode == 'widget') ? 'col-md-0' : 'col-md-4') ">
                <threads-navbar
                        :mode="mode"
                        :groupId="uid"
                        :id="'left-pane' + uid"
                        @threadClicked="handleThreadClick"
                        :class="navbarClass" />
            </div>
            <div :class="chatContainerClass + ' text-white pr-3 pl-3'">
                <discussions :mode="mode" :currThread="currThread" :needRefresh="needRefresh" @discussionRefreshed="handleDiscussionRefreshed"/>
                <discussion-text-box @msgSent="needRefresh = true" :currThread="currThread"/>
            </div>
        </div>
    </div>

</template>

<script>
    import ThreadsNavbar from "./ThreadsNavbar";
    import Discussions from "../../components/discussion/Discussions";
    import DiscussionTextBox from "../../components/discussion/DiscussionTextBox";
    import createThread from '../threads/create';

    export default {
        name: "DiscussionSection",
        components: {ThreadsNavbar, Discussions, DiscussionTextBox, createThread},
        props: ['mode', 'uid'],
        data() {
            return {
                currThread : null,
                threadTitle: '',
                needRefresh : false
            }
        },
        computed: {
            backUrl() {
                return '/groups/';
            },

            containerClass() {
                return this.mode == 'widget' ? 'col-md-12' : 'col-md-12';
            },

            navbarClass() {
                return this.mode == 'widget' ? 'left-panel' : '';
            },
            chatContainerClass() {
                return this.mode == 'widget' ? 'col-md-12' : 'col-md-8';
            }
        },
        methods: {
            handleClick() {
                let value = $('#left-pane' + this.uid).css('width') === '250px' ? 0 : '250px';
                document.getElementById("left-pane" + this.uid).style.width = value;
            },
            handleDiscussionRefreshed(val) {
                this.needRefresh = !val;
            },
            handleThreadClick(params) {
                this.currThread = params;
                this.threadTitle = params.title;
            },
        },
        mounted() {
            let self = this;
            if(this.$route.name != 'start_discussion') {
                $(document).on('click', function (e) {
                    $('.left-panel').each((index, elem) => {
                        if($(elem).width() == '250' && self.$route.name != 'start_discussion') {
                            document.getElementById($(elem).attr('id')).style.width = 0;
                        }
                    });
                })
            }
        }
    }
</script>

<style scoped>
    #left-page {
        position: relative;
    }

    #thread-btn-container {
        border-top: 0;
        border-right: solid 1px #223e79;
        border-bottom: solid 1px #223e79;
        border-left: 0;
    }

    #left-pane-container {
        border-right: solid 1px #223e79;
    }

    .left-panel {
        height: 80%;
        width: 0;
        position: absolute;
        z-index: 1;
        left: 15px;
        background-color: #223e79;
        overflow-x: hidden;
        transition: 0.5s;
        height: 290px;
    }


    .left-panel {
        background-color: rgba(255, 255, 255, 0.95);
        border-radius: 5px;
        color: #333;
        font-family: sans-serif;
        line-height: 1.5;
        padding: 1rem 0rem;
    }


    .left-panel a {
        color: #bf0222;
    }

    @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
        .left-panel {
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
            background-color: rgba(255, 255, 255, -0.8);
        }
    }
</style>