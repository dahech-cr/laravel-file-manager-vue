<template>
    <div class="modal-content fm-modal-properties">
        <div class="modal-header">
            <h5 class="modal-title">{{ lang.modal.properties.title }}</h5>
            <button type="button" class="btn-close" aria-label="Close" v-on:click="hideModal"></button>
        </div>
        <div class="modal-body">
            <div class="flex mb-2 items-center gap-x-2">
                <div class="w-2/12">{{ lang.modal.properties.disk }}:</div>
                <div class="w-9/12">{{ selectedDisk }}</div>
                <div class="w-1/12 relative mb-1 text-right">
                    <i
                        v-on:click="copyToClipboard(selectedDisk)"
                        v-bind:title="lang.clipboard.copy"
                        class="bi bi-files"
                    />
                </div>
            </div>
            <div class="flex mb-2 items-center gap-x-2">
                <div class="w-2/12">{{ lang.modal.properties.name }}:</div>
                <div class="w-9/12 ">{{ selectedItem.basename }}</div>
                <div class="w-1/12 relative text-right">
                    <i
                        v-on:click="copyToClipboard(selectedItem.basename)"
                        v-bind:title="lang.clipboard.copy"
                        class="bi bi-files"
                    />
                </div>
            </div>
            <div class="flex mb-2 items-center gap-x-2">
                <div class="w-2/12">{{ lang.modal.properties.path }}:</div>
                <div class="w-9/12">{{ selectedItem.path }}</div>
                <div class="w-1/12 relative mb-1 text-right">
                    <i
                        v-on:click="copyToClipboard(selectedItem.path)"
                        v-bind:title="lang.clipboard.copy"
                        class="bi bi-files"
                    />
                </div>
            </div>
            <template v-if="selectedItem.type === 'file'">
                <div class="flex mb-2 items-center gap-x-2">
                    <div class="w-2/12">{{ lang.modal.properties.size }}:</div>
                    <div class="w-9/12">{{ bytesToHuman(selectedItem.size) }}</div>
                    <div class="w-1/12 relative mb-1 text-right">
                        <i
                            v-on:click="copyToClipboard(bytesToHuman(selectedItem.size))"
                            v-bind:title="lang.clipboard.copy"
                            class="bi bi-files"
                        />
                    </div>
                </div>
                <div class="flex mb-2 items-center gap-x-2">
                    <div class="w-2/12">{{ lang.modal.properties.url }}:</div>
                    <div class="w-9/12">
                        <span v-if="url">{{ url }}</span>
                        <span v-else>
                            <button v-on:click="getUrl" type="button" class="btn btn-sm btn-light">
                                <i class="bi bi-link-45deg" /> Get URL
                            </button>
                        </span>
                    </div>
                    <div v-if="url" class="w-1/12 relative mb-1 text-right">
                        <i v-on:click="copyToClipboard(url)" v-bind:title="lang.clipboard.copy" class="bi bi-files" />
                    </div>
                </div>
            </template>
            <template v-if="selectedItem.hasOwnProperty('timestamp')">
                <div class="flex mb-2 items-center gap-x-2">
                    <div class="w-2/12">{{ lang.modal.properties.modified }}:</div>
                    <div class="w-9/12">{{ timestampToDate(selectedItem.timestamp) }}</div>
                    <div class="w-1/12 relative mb-1 text-right">
                        <i
                            v-on:click="copyToClipboard(timestampToDate(selectedItem.timestamp))"
                            v-bind:title="lang.clipboard.copy"
                            class="bi bi-files"
                        />
                    </div>
                </div>
            </template>
            <template v-if="selectedItem.hasOwnProperty('acl')">
                <div class="flex mb-2 items-center gap-x-2">
                    <div class="w-2/12">{{ lang.modal.properties.access }}:</div>
                    <div class="w-9/12">{{ lang.modal.properties['access_' + selectedItem.acl] }}</div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import modal from '../mixins/modal';
import translate from '../../../mixins/translate';
import helper from '../../../mixins/helper';
import EventBus from '../../../emitter';

export default {
    name: 'PropertiesModal',
    mixins: [modal, translate, helper],
    data() {
        return {
            url: null,
        };
    },
    computed: {
        /**
         * Selected disk
         * @returns {*}
         */
        selectedDisk() {
            return this.$store.getters['fm/selectedDisk'];
        },

        /**
         * Selected file
         * @returns {*}
         */
        selectedItem() {
            return this.$store.getters['fm/selectedItems'][0];
        },
    },
    methods: {
        /**
         * Get URL
         */
        getUrl() {
            this.$store
                .dispatch('fm/url', {
                    disk: this.selectedDisk,
                    path: this.selectedItem.path,
                })
                .then((response) => {
                    if (response.data.result.status === 'success') {
                        this.url = response.data.url;
                    }
                });
        },

        /**
         * Copy text to clipboard
         * @param text
         */
        copyToClipboard(text) {
            // create input
            const copyInputHelper = document.createElement('input');
            copyInputHelper.className = 'copyInputHelper';
            document.body.appendChild(copyInputHelper);
            // add text
            copyInputHelper.value = text;
            copyInputHelper.select();
            // copy text to clipboard
            document.execCommand('copy');
            // clear
            document.body.removeChild(copyInputHelper);

            // Notification
            EventBus.emit('addNotification', {
                status: 'success',
                message: this.lang.notifications.copyToClipboard,
            });
        },
    },
};
</script>

<style lang="scss">
.fm-modal-properties .modal-body {
    .flex mb-2 items-center gap-x-2 {
        margin-bottom: 0.3rem;
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;

        .bi-files {
            display: none;
            cursor: pointer;
        }

        &:hover {
            background-color: #f8f9fa;

            & .bi-files {
                display: block;
            }
        }
    }

    .w-2\12 {
        font-weight: bold;
    }

    .w-9\12 {
        word-wrap: break-word;
    }
}
</style>
