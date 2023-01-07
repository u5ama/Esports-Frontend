<template>
    <div v-drag-and-drop:options="options" class="drag-wrapper">
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </ul>
        <ul>
            <li>Item 4</li>
            <li>Item 5</li>
            <li>Item 6</li>
        </ul>
        <ul>
            <li>Item 7</li>
            <li>Item 8</li>
            <li>Item 9</li>
        </ul>
    </div>
</template>

<script>

    export default {
        name: 'draggable',
        data() {
            const componentInstance = this;
            return {
                options: {
                     dropzoneSelector: 'ul',
                     draggableSelector: 'li',
                     showDropzoneAreas: true,
                     multipleDropzonesItemsDraggingEnabled: true,
                     onDrop(event) {
                       console.log('OnDrop Event: ', event);
                     },
                    // onDragstart(event) {
                    //   event.stop();
                    // },
                    onDragend(event) {
                        // if you need to stop d&d
                        // event.stop();

                        // you can call component methods, just don't forget
                        // that here `this` will not reference component scope,
                        // so out from this returned data object make reference
                        // to component instance
                        componentInstance.someDummyMethod();

                        // to detect if draggable element is dropped out
                        console.info('event.droptarget: ', event, event.droptarget);
                        if (!event.droptarget) {
                            console.log('event is dropped out');
                        }
                    }
                }
            }
        },
        methods: {
            someDummyMethod() {
                console.log('Hello from someDummyMethod');
            }
        }
    }
</script>

<style>
    .drag-wrapper {
        display: flex;
        justify-content: center;
    }

    ul {
        display: flex;
        flex-direction: column;
        padding: 3px !important;
        min-height: 70vh;
        width: 100px;
        float:left;
        list-style-type:none;
        overflow-y:auto;
        border:2px solid #888;
        border-radius:0.2em;
        background:#8adccc;
        color:#555;
        margin-right: 5px;
    }

    /* drop target state */
    ul[aria-dropeffect="move"] {
        border-color:#68b;
        background:#fff;
    }

    /* drop target focus and dragover state */
    ul[aria-dropeffect="move"]:focus,
    ul[aria-dropeffect="move"].dragover
    {
        outline:none;
        box-shadow:0 0 0 1px #fff, 0 0 0 3px #68b;
    }

    /* draggable items */
    li {
        display:block;
        list-style-type:none;
        margin:0 0 2px 0;
        padding:0.2em 0.4em;
        border-radius:0.2em;
        line-height:1.3;
    }

    li:hover {
        box-shadow:0 0 0 2px #68b, inset 0 0 0 1px #ddd;
    }

    /* items focus state */
    li:focus
    {
        outline:none;
        box-shadow:0 0 0 2px #68b, inset 0 0 0 1px #ddd;
    }

    /* items grabbed state */
    li[aria-grabbed="true"]
    {
        background:#5cc1a6;
        color:#fff;
    }

    @keyframes nodeInserted {
        from { opacity: 0.2; }
        to { opacity: 0.8; }
    }

    .item-dropzone-area {
        height: 2rem;
        background: #888;
        opacity: 0.8;
        animation-duration: 0.5s;
        animation-name: nodeInserted;
    }
</style>