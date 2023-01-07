<template>
  <button
          :class="'btn fs13 btn-xs btn-block mt-1 ' + btnClass "

          @click="followUser"
          style="padding: 0 5px;font-size: 11px">{{btnLabel}}</button>
</template>

<script>
    export default {
        name: "FollowButton",
        props: {
            followed_users: {
                required : true,
                type: Array
            },
            user_id: {
                required: true,
                type: String
            },
            followed_id: {
                required: true,
                type: String
            }
        },
        data() {
            return {
                btnClass: 'btn-success',
                isFollowed: false,
                buttonLabel: '',
                firstName: '',
                lastName: ''
            }
        },
        computed : {
            fullName: {
                // getter
                get: function () {
                    if(this.checkIfAlreadyFollow(this.followed_id) == true) {
                        this.firstName = 'unFollow';
                        this.lastName = 'unFollow';
                        this.isFollowed = true;
                        this.btnClass = 'btn-danger';
                    } else {
                        this.firstName = 'Follow';
                        this.lastName = 'Follow';
                        this.isFollowed = false;
                        this.btnClass = 'btn-success';
                    }
                    return this.firstName + ' ' + this.lastName
                },
                // setter
                set: function (newValue) {
                    let names = newValue.split(' ')
                    this.firstName = names[0]
                    this.lastName = names[names.length - 1]
                }
            },
            btnLabel: {
                get: function () {
                    if(this.checkIfAlreadyFollow(this.followed_id) == true) {
                        this.btnClass = 'btn-danger';
                        this.isFollowed = true;
                        this.buttonLabel = 'unFollow';
                    } else {
                        this.buttonLabel = 'Follow';
                        this.isFollowed = false;
                        this.btnClass = 'btn-success';
                    }
                    return this.buttonLabel;
                },
                // setter
                set: function (newValue) {
                    this.buttonLabel =  newValue;
                }
            }
        },
        methods:{
            checkIfAlreadyFollow(user) {
                let followed = this.followed_users.filter(value => {
                    return value.user == user
                });

                return (followed.length) ? true : false;
            },
            followUser() {
                let url = this.$servername + "/follows/";
                let slug = 'addFollower';
                this.btnClass = 'btn-danger';
                this.btnLabel = 'unFollow';
                if(this.isFollowed) {
                    slug = 'delete';
                    this.btnClass = 'btn-success';
                    this.btnLabel = 'Follow';
                    this.isFollowed = false;
                    this.fullName = 'Follow';
                } else {
                    this.fullName = 'unFollow';
                    this.isFollowed = true;
                }
                url += slug;
                this.axios.post(url, {"user_id": this.followed_id }).then(response => {
                    //this.alreayFollowed()
                    //this.followed = response.data;
                    this.$emit('btnClicked');
                });
            }
        }
    }
</script>

<style scoped>

</style>