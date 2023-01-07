<template>
    <div class="col-12 col-md-11" v-if="comments.length">
        <div class="row">
            <div class="col-md-12 text-white">
                <div class="row" v-for="comment in comments">
                    <div class="col-md-2 pr-0">
<!--                        <pre>-->
<!--                            {{comment}}-->
<!--                        </pre>-->
                        <img :src="$servername + '/image/users/'+ comment.user_id.profileImage"
                             @error="defaultImage"
                             class="rounded-circle float-left" style="max-width:40px;padding:0">

<!--                        <img-->
<!--                                style="max-width:40px;padding:0"-->
<!--                                class="rounded-circle float-left"-->
<!--                                src="@/assets/images/league-logo.jpg"-->
<!--                        />-->

                    </div>
                    <div class="col-md-10 pl-0">
                        <div class="row">

                            <div class="col-md-12 text-right">{{moment(comment.createdDate).fromNow()}}</div>
                            <div class="col-md-12" v-text="comment.comment"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        name: "lists",
        props: ['type', 'data', 'refreshList','postData'],
        data() {
            return {
                comments: {},
                img : false
            }
        },
        filters : {
            commentDate(date) {
                return moment(date).format('YY-MM-DD');
            }
        },
        watch: {
            refreshList(value) {
                if(value) {
                    this.listComments();
                }
            }
        },
        methods: {
            defaultImage(e) {
                e.target.src = "https://via.placeholder.com/64?text=No+Image"
            },
            listComments() {
                this.axios.get(this.$servername + '/comments/all/' + this.type + '/' + this.data.id)
                    .then((response) => {
                        this.comments = response.data.data;
                        this.$emit('listUpdated', {numComments: this.comments.length});
                    })
                    .catch((err) => {
                        console.info('errors:: ', err);
                    });
            }
        },
        mounted() {
            this.listComments();
        }
    }
</script>

<style scoped>

</style>
