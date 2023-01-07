<template>
    <div :id="'collapse' + id" :class="'collapse '  + collapseClass(id)" aria-labelledby="headingOne"
         data-parent="#accordionExample">
        <div class="card-body">
            <ul class="list-group">
                <li class="list-group-item" v-for="(thread, index) in data.thread">
                    <a href="#" class="text-white" :id="'thread-' + index + '-' + id " @click.prevent="handleThreadClick(thread, $event.target)"> - {{thread.title}}</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AccordionBody",
        props: ['id', 'data', 'groupId'],
        data() {
            return {
                threads: {},
            }
        },
        watch : {
            threads(value) {
                if(this.id < 1) {
                    setTimeout(() => {
                        document.getElementById('thread-1-0').click();
                    }, 100)
                }
            }
        },
        methods: {
            handleThreadClick(thread, target) {
                //console.info('target: ', target);
                $('.accordion').find('.active').each((i, v) => {
                    //console.info('i, v: ', i, v);
                    $(v).removeClass('active');
                });
                $(target).addClass('active');
                this.$emit('threadClicked', {threadId:thread._id, title: thread.title});
            },
            collapseClass(index) {
                if(index == 0) {
                    return 'show';
                }
                return '';
            },
        },
        mounted() {
            if(this.id < 1) {
                setTimeout(() => {
                    /*console.info('inside mounted: ', this.groupId, document.querySelector('#left-pane' + this.groupId
                    + ' #thread-0-0'));*/
                    let firstThread = document.querySelector('#left-pane' + this.groupId + ' #thread-0-0');
                    firstThread.click();
                    $(firstThread).addClass('active');
                }, 500)
            }
        }
    }
</script>

<style scoped>
    .list-group-item a{
        text-decoration: none;
    }

    .list-group-item .active {
        background-color: #e6dddd29;
        border-radius: 20px;
        padding: 5px;
        display: block;
    }

    .list-group-item {
        background-color: transparent;
        border: 0px;
        padding: 5px 15px;
    }
    .card-body {
        padding: 0 1.25rem;
    }

</style>