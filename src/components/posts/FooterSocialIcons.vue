<template>
    <div class="post-footer">
        <div class="row">
            <div v-if="!likedByUser" class="col-4 text-white">
                <button @click="postLike" class="text-white pt-3">
                    <i class="material-icons float-left mr-3">favorite_border</i>
                    <span v-if="mode != 'widget'"><span v-if="likeCount">{{ likeCount }}</span> Like</span>
                    <span v-else="mode == 'widget'"><span v-if="likeCount">{{ likeCount }}</span></span>
                </button>
            </div>

            <div v-if="likedByUser" class="col-4 text-white">
                <button @click="postDisLike" class="text-white pt-3 text-danger">
                    <i class="material-icons float-left mr-3">favorite_border</i>
                    <span v-if="mode != 'widget'"><span v-if="likeCount">{{ likeCount }}</span> Like</span>
                    <span v-else="mode == 'widget'"><span v-if="likeCount">{{ likeCount }}</span></span>
                </button>
            </div>

            <div class="col-4 text-center">
                <button class="text-white pt-3" @click="addComment">
                    <i class="material-icons float-left mr-1">mode_comment</i>
                    <span v-if="mode != 'widget'">Comment (<span class="float-none" v-text="numComment"></span>)</span>
                    <span v-else="mode == 'widget'">(<span class="float-none" v-text="numComment"></span>)
                    </span>
                </button>
            </div>
            <div class="col-4 text-right">
                <button class="text-white pt-3">
                    <i class="material-icons float-left mr-3">share</i>
                    <span v-if="mode != 'widget'">Share</span>
                </button>
            </div>
        </div>
        <!-- comment component -->

        <comment
                v-if="showCommentForm"
                type="post"
                :data="{id: postId}"
                @commentAdded="handleCommentAdd"
                @commentCancel="showCommentForm = false"
        ></comment>
    </div>
</template>

<script>
    import comment from '../../views/comments/comment';
    export default {
        name: "FooterSocialIcons",
        props: ['postId', 'numComment', 'likeCount', 'likedByUser', 'widget', 'mode'],
        components: {comment},
        data() {
            return {
                showCommentForm: false,
            }
        },
        methods: {
            handleCommentAdd() {
                this.$emit('commentAdded');
            },
            addComment() {
                console.info('function called to add comments.');
                this.showCommentForm = !this.showCommentForm;
            },
            postDisLike(post) {
                this.axios.post(this.$servername + "/likes/deletepostlike", {post: this.postId}).then(response => {
                    this.$emit('call');
                    //this.getPosts()
                    //this.searchFilter()
                }).catch(error => {
                    console.log("error")
                    console.log(error)
                    this.isError = true;
                    return error;
                });
            },
            getPosts(){
                this.$session.start();
                var user_detail = this.$session.get("user_detail");
                //console.log(user_detail);
                this.axios.get(this.$servername + "/posts").then(response => {
                    var arr = response.data;
                    //console.log(arr);
                    arr.forEach(function(part, index) {
                        if(part.likes.length){
                            //console.log(part.likes);
                            let obj = part.likes.find(x => x.user === user_detail._id);
                            // console.log(obj);
                            this[index].likedByUser = obj;
                        }else{
                            this[index].likedByUser = false;
                        }
                    }, arr);
                    this.results = arr;
                    this.results_intact = arr;
                    //this.searchFilter(this.sort_by)
                });
            },
            postLike(post) {
                this.axios.post(this.$servername + "/likes/createpostlike", {post: this.postId}).then(response => {
                    //this.getPosts()
                    this.$emit('call');
                    //this.$emit('getPosts')
                    // this.$emit('click', {
                    //     GlobalSearchResult: this.searchResult,
                    //     search_q: this.q,
                    // });
                    //this.searchFilter()
                    // this.likedByUser = true;
                }).catch(error => {
                    console.log("error")
                    console.log(error)
                    this.isError = true;
                    return error;
                });
            }
        }
    }
</script>

<style scoped>

</style>
