<template>
    <div
         :id="id"
         :class="'col-12  ' + containerClass  + ' ' + getClass "
         :draggable="draggable"
         @dragstart="dragStart"
         @dragover.stop
    >
        <div class="bgdark">
            <div class="row remove-group" v-if="mode == 'widget'">
                <div class="col-md-12">
                    <i class="material-icons" aria-hidden="true" :id="group._id"
                       @click="removeGroup($event.target)">clear</i>
                </div>
            </div>

            <div class="row py-3">
                <div class="col-4">
                    <img :src="$servername + '/image/groups/thumb-' + group.image" @error="defaultImage">
                </div>
                <div class="col-8">
                    <p class="text-white lead" v-text="group.name"></p>
                </div>
            </div>
            <div v-if="mode != 'widget'" class="group-stats">
                <div class="row py-3">
                    <div class="col-6 text-center">
                        <button class="btn-outline" v-text="membersCount">0 Members</button>
                    </div>
                    <div class="col-6 text-center">
                        <router-link :to="groupLink" class="btn-outline">View</router-link>
                    </div>
                </div>
                <div class="row py-3">
                    <div class="col-6 text-center">
                        <button class="btn-outline" v-text="group.emoji.length + ' Emotes'"></button>
                    </div>
                    <div class="col-6 text-center" id="view-group-btn">
                        <button class="btn-outline" @click="joinGroup(group._id)" v-text="joinBtn"></button>
                    </div>
                </div>
            </div>

            <div v-if="mode == 'widget'">
                <discussion-section
                        v-if="$route.name != 'start_discussion'"
                        mode="widget" :uid="group._id"></discussion-section>
            </div>
        </div>
    </div>
</template>

<script>
    import DiscussionSection from '../views/discussions/DiscussionSection';
    import {EventBus} from '../eventbus';
    import VuejsDialog from 'vuejs-dialog';// include the default style
    import 'vuejs-dialog/dist/vuejs-dialog.min.css';

    export default {
        name: "group",
        props: ['group', 'iterator', 'id', 'draggable', 'containerClass', 'mode'],
        components: {DiscussionSection, VuejsDialog},
        data() {
            return {
                user: {},
                label: '',
                hasJoined: 0
            }
        },

        computed: {
            groupLink() {
                return '/groups/' + this.group._id + '/thread/' + this.group.thread[0]._id + '/start-discussion' ;
            },

            membersCount() {
                return this.group.members.length + ' Members';
            },
            getClass() {
                return this.iterator > 2 ? ' mt-3' : '';
            },
            joinBtn() {
                this.label = 'Join';
                if (this.group.members.length) {
                    let member = this.group.members.filter((member) => {
                        return member.user_id == this.user._id;
                    });
                    if (member.length > 0) {
                        this.label = 'Leave Group';
                        this.hasJoined = 1;
                    } else {
                        this.label = 'Join';
                        this.hasJoined = 0;
                    }
                }
                return this.label;
            }
        },
        methods: {
            defaultImage(e) {
                e.target.src = "https://via.placeholder.com/64?text=No+Image"
            },
            removeGroup(element) {
                let user = this.$session.get("user_detail");
                this.axios.post(this.$servername + '/groups/remove-from-widget', {
                    group_id: element.id,
                    user_id: user._id
                })
                .then((response) => {
                    let group = document.getElementById('group-' + element.id).remove();
                    //group.getElementsByClassName('remove-group')[0].remove();
                    /*group.classList.remove('col-md-12');
                    group.classList.remove('widget-group');
                    group.classList.add('col-md-6');
                    group.classList.add('mt-3');*/
                    //document.getElementById('groups-listing').append(group);
                    EventBus.$emit('groupWidgetized', {groupId: element.id});

                })
                .catch((err) => {});

            },
            dragStart(event) {
                let target = event.target;
                let  obje = {group_id: target.id, target_type:'group'};
                event.dataTransfer.setData("text" ,JSON.stringify(obje));
            },
            joinGroup(groupId) {

                // Trigger a confirmation dialog
                this.$dialog
                        .confirm('Are you sure, you want to leave this group?')
                        .then(function(dialog) {
                            console.log('Clicked on proceed');

                            let auth = {
                                headers: {
                                    Authorization: "Bearer " + this.$session.get("token")
                                }
                            };
                            let user = this.$session.get("user_detail");
                            this.axios.post(this.$servername + '/groups/join', {
                                        groupId,
                                        userId: user._id
                                    },
                                    auth
                            )
                                    .then(() => {
                                        let message = 'You joined group successfully!';
                                        if (this.hasJoined == 1) {
                                            message = 'You left group successfully!'
                                        }

                                        toastr.success(message);
                                        this.hasJoined = !this.hasJoined;
                                        this.$emit('groupSubscription', {});
                                    })
                                    .catch(() => {});
                        })
                        .catch(function() {
                            console.log('Clicked on cancel');
                        });


            }
        },
        mounted() {
            this.user = this.$session.get("user_detail");
        }
    }
</script>

<style scoped>

    .remove-group {
        position: absolute;
        color: #fff;
        cursor: pointer;
        right: 2%;
    }
    .btn-outline {
        background: none;
        color: #fff;
        border: solid 1px #223e79;
        border-radius: 4px;
        display: block;
        width: 100%;
        text-align: center;
        font-size: 12px;
    }

    .btn-outline:hover {
        text-decoration: none;
    }

    #view-group-btn button {
        cursor: pointer;
    }
</style>
