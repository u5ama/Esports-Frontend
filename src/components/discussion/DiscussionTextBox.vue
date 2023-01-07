<template>
    <div class="row">
        <div class="col-md-12" id="chat-box">
            <div class="row">
                <div class="col-md-1" id="options-icon">
                    <i class="material-icons app-emoji" @click="showEmoji = !showEmoji">add_circle_outline</i>
                </div>
                <div class="col-md-8">
                    <picker
                        title="Pick an Emoji" emoji="point_up"
                        v-show="showEmoji"
                        :showPreview=false
                        @select="handleEmoji"
                        @mouseleave="handleMouseLeave"
                        :style="{ position: 'absolute', 'z-index': 1, top: '-260px', height: '260px', width: '325px' }"
                        set="facebook"
                    ></picker>
                    <textarea v-model="message" class="form-control" placeholder="Enter message...."></textarea>
                </div>
                <div class="col-md-3 submit-btn">
                    <button @click.prevent="submitMsg" class="btn btn-success">Send</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {Picker} from 'emoji-mart-vue';

    export default {
        name: "DiscussionTextBox",
        props: ['currThread'],
        components: {Picker},
        data() {
            return {
                message: '',
                showEmoji: false,
                selectedEmoji: [],
                User : {}
            }
        },
        methods: {
            handleEmoji(params){
                this.selectedEmoji.push(params.colons);
                this.message = this.message + ' ' + params.native;
            },
            handleMouseLeave(params) {
                console.info('handling mouse leave', params);
            },
            submitMsg() {
                this.User = this.$session.get("user_detail");
                //this.message = this.$refs.textarea.innerHTML;
                if(this.message) {
                    let msgBody = {
                        user_id: this.User._id,
                        comment: this.message,
                        emoji: this.selectedEmoji,
                        related_to: 'thread',
                        id: this.currThread.threadId
                    }

                    this.axios.post(this.$servername + '/comments', msgBody)
                        .then(response => {
                            this.$emit('msgSent', this.message);
                            this.message = '';
                            this.selectedEmoji = [];
                            //this.$refs.textarea.innerHTML = '';
                        })
                        .catch(err => console.info('erro got: ', err))
                }
            }
        },

        mounted() {
            let self = this;
            $(document).on('click', function (e) {
                if($('.emoji-mart').is(':visible') &&
                    (
                        $(e.target).hasClass('app-emoji') ||
                        $(e.target).parents('.app-emoji'
                        ).length
                    )
                ) {
                    //console.info('inside if');
                } else {
                    self.showEmoji = false;
                }
            })
        }
    }
</script>

<style scoped>
    .submit-btn {
        margin-top: 10px;
    }

#chat-box {
    border-top: solid 1px #223e79;
    /*border-bottom: solid 1px #223e79;*/
    padding: 10px;
    margin-top: 5px;
}

    #options-icon {
        margin-top: 15px;
    }
    .app-emoji {
        cursor: pointer;
    }
    .app-emoji:hover {
            color: #d3c626;
        }

    .emoji-mart-preview-emoji {
        display: none !important;
    }
</style>