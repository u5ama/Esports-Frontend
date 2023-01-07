<template>
    <div class="row">
        <div class="col-12">
            <div class="form-group">
                <label for="comment" class="text-white">Add Comments</label>
                <textarea name="comment" v-model="content" id="comment" class="form-control"></textarea>
            </div>
        </div>

        <div class="col-12">
            <button type="button" @click="addComment" class="btn btn-success mr-2">Send</button>
            <button type="button" class="btn btn-danger" @click="$emit('commentCancel')">Cancel</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "createComment",
        props: ['type', 'data'],
        data() {
            return {
                content: '',
                user: ''
            }
        },

        methods: {
            addComment() {
                this.user = this.$session.get("user_detail");
                if (this.content != '') {
                    let post = {
                        user_id: this.user._id,
                        comment: this.content,
                        related_to : this.type,
                        id: this.data.id
                    };

                    this.axios.post(this.$servername + '/comments/', post)
                        .then((response) => {
                            if (response.data.status == true) {
                                toastr.success(response.data.message);
                                this.content = '';
                                this.$emit('commentAdded');
                            } else {
                                toastr.error('Unable to add comment, please try again!');
                            }

                        })
                        .catch((err) => {
                            console.info('we got error: ', err);
                        })
                }
            }
        }
    }
</script>

<style scoped>

</style>