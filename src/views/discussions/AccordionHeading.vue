<template>
    <div class="card-header" :id="'group' + id">
            <div :class="'btn btn-link thread-headings text-white ' + btnClass(id)" data-toggle="collapse" :data-target="'#collapse' + id" aria-expanded="true" :aria-controls="'collapse' + id">
                <div class="row">
                    <div class="arrow-icon col-md-1">
                        <span class="left-bar"></span>
                        <span class="right-bar"></span>
                    </div>
                    <div class="col-md-11" style="margin-left: 25px;">{{data.name}}</div>
                </div>
            </div>
    </div>
</template>

<script>
    export default {
        name: "AccordionHeading",
        props: ['id', 'data', 'groupId'],
        methods: {
            btnClass(index) {
                if(index == 0) {
                    return '';
                }
                return 'collapsed';
            },
        },

        mounted() {
            $( ".thread-headings" ).click(function() {
                $(this).toggleClass("open");
            });
        }
    }
</script>

<style scoped>
    .thread-headings {
        white-space: normal;
        padding: 0px;
        text-decoration: none;
    }
    .card-header {
        padding: 8px;
        border: 0px;
        background: border-box;
    }

    .arrow-icon {

    }

    .left-bar {
        position: absolute;
        background-color: transparent;
        top: 0;
        left: 0;
        width: 40px;
        height: 10px;
        display: block;
        transform: rotate(35deg);
        float: right;
        border-radius: 2px;
    }
    .left-bar:after {
        content: "";
        background-color: white;
        width: 10px;
        height: 2px;
        display: block;
        float: right;
        border-radius: 6px 10px 10px 6px;
        transition: all 0.5s cubic-bezier(0.25, 1.7, 0.35, 0.8);
        z-index: -1;
    }

    .right-bar {
        position: absolute;
        background-color: transparent;
        top: 17px;
        left: 11px;
        width: 40px;
        height: 10px;
        display: block;
        transform: rotate(-35deg);
        float: right;
        border-radius: 2px;
    }
    .right-bar:after {
        content: "";
        background-color: white;
        width: 10px;
        height: 2px;
        display: block;
        float: right;
        border-radius: 10px 6px 6px 10px;
        transition: all 0.5s cubic-bezier(0.25, 1.7, 0.35, 0.8);
        z-index: -1;
    }

    .open .left-bar:after {
        transform-origin: center center;
        transform: rotate(-70deg);
    }
    .open .right-bar:after {
        transform-origin: center center;
        transform: rotate(70deg);
    }
</style>