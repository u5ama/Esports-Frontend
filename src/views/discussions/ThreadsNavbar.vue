<template>
    <div class="row">
        <div class="col-md-12">
            <div class="accordion" id="accordionExample">
                <div class="card" v-for="(group, index) in groups">
                    <accordion-heading :id="index" :data="group" :groupId="groupId"></accordion-heading>
                    <accordion-body :id="index" :data="group" :groupId="groupId" @threadClicked="handleThreadClick"></accordion-body>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AccordionHeading from "./AccordionHeading";
    import AccordionBody from "./AccordionBody";
    import {EventBus} from '../../eventbus';

    export default {
        name: "ThreadsNavbar",
        components: {AccordionBody, AccordionHeading},
        props: ['groupId', 'mode'],
        data() {
            return {
                groups: {},
                User: {}
            }
        },
        computed : {
        },
        methods: {
            handleThreadClick(params) {
                this.$emit('threadClicked', params);
            },
            getGroupsAndThreads() {
                let self = this;
                let url = self.$servername + '/groups/';

                url += self.groupId != undefined ? self.groupId : '';

                if(this.mode != 'widget' && this.$route.name == 'start_discussion') {
                    url += 'all-by-user/' + this.User._id;
                } else if(this.mode != 'widget') {
                    url += 'by-user/' + this.User._id;
                }
                self.axios.get(url)
                    .then((response) => {
                        if(self.mode == 'widget') {
                            self.groups = response.data.data;
                        } else {
                            self.groups = response.data.data;
                        }
                    })
                    .catch(() => {});
            }
        },
        created() {
            let self = this;
            EventBus.$on('groupCreated', function(){
                self.groups = {};
                self.getGroupsAndThreads();
            });
        },
        mounted() {
            this.User = this.$session.get("user_detail");

            this.getGroupsAndThreads()
        }
    }
</script>

<style scoped>

    .card {
        background-color: transparent !important;
        border: 0px;
    }
    /* width */
    ::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #051b4a;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }










</style>