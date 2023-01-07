<template>
    <div class="row mt-2 mt-md-2 justify-content-center">
        <div class="col-12 col-md-11">
            <div class="text-white text-left post-card" v-if="mode != 'widget'">
                <div class="post-card-head" >
                    <img style="max-width:40px;padding:0" class="rounded-circle float-left" :src="$servername + '/image/users/'+ postData.User.profileImage" @error="useSample" />
                </div>
                <div class="text-white text-left post-card-info">
                    <span
                            class="text-white font-weight-bold"
                            style="width: 88%; display: inline-block;font-size: 14px;"
                    ><router-link v-if="postData.User"  :to="{ name: 'profile_view', params: {username: postData.User.username } }" >{{ postData.User.firstName }} {{ postData.User.lastName }}</router-link>
                    </span>
                    <p><router-link to="/post_details">{{ postData.post_title }}</router-link></p>
                    <p class="posted">posted on {{moment(postData.createdDate).fromNow()}}</p>
                </div>
            </div>
            <div v-else class="text-white text-left post-card" >
                <p><router-link to="/post_details">{{ postData.post_title }}</router-link></p>
                <p class="posted">posted on {{moment(postData.createdDate).fromNow()}}</p>
            </div>
            <div class="post-image">
                <img class="img-fluid" :src="postImage(postData)" @error="useSamplePost" style="width: 1600px" height="900px" />
            </div>
            <div class="post-footer">
                <social-icons
                        :postId="postData.id"
                        :numComment="numComment"
                        :likeCount="postData.likeCount"
                        :likedByUser="postData.likedByUser"
                        @commentAdded="refreshCommentList = true"
                        :mode="mode"
                        @call="getPostLikes"
                ></social-icons>
            </div>
        </div>

            <list-comment
                    :refreshList="refreshCommentList"
                    :data="{id: postData.id}"
                    @listUpdated="afterListUpdated"
                    type="post">
            </list-comment>
    </div>
</template>

<script>
    import SocialIcons from "./FooterSocialIcons";
    import ListComment from '../../views/comments/lists';
    export default {
        name: "post",
        components: { SocialIcons, ListComment },
        props: ['postData', 'mode'],
        data() {
            return {
                numComment: 0,
                refreshCommentList: false,
            }
        },

        methods: {
            postImage(post) {
                return this.$servername + '/image/posts/'+post.post_media;
            },
            useSample(e) {
                e.target.src = "https://via.placeholder.com/300?text=Upload+Image"
            },
            useSamplePost(e) {
                e.target.src = "https://via.placeholder.com/1600x900?text=Image+Not+Found"
            },
            afterListUpdated(params) {
                this.refreshCommentList = false
                this.numComment = params.numComments;
            },
            getPostLikes(){
                this.$emit('call');
            }
        }
    }
</script>

<style scoped>
    .row.justify-content-center .col-md-11 {
        border: solid 1px #223e79;
        padding: 10px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.1);
    }
    .post-card-head {
        position: absolute;
    }
    .post-card-info a {
        color: #fff;
    }
    .post-card-info {
        padding-left: 80px;
    }
    .cover-image {
        height: 250px;
        overflow: hidden;
    }
    .post-image img {
        object-fit: cover;
        width: 100%;
    }
    .cover-image img {
        object-fit: cover;
    }
</style>
