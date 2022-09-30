<template>
    <div class="modal-content fm-modal-zip">
        <div class="modal-header">
            <h5 class="modal-title">{{ lang.modal.zip.title }}</h5>
            <button type="button" class="btn-close" aria-label="Close" v-on:click="hideModal"></button>
        </div>
        <div class="modal-body w-96">
            <label for="fm-zip-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                {{ lang.modal.zip.fieldName }}
            </label>
            
            <div class="input-group mb-3">
                <input 
                    type="text" 
                    id="fm-zip-name"
                    class=" bg-gray-50 border border-gray-300 !text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    v-focus
                    v-bind:class="{ 'is-invalid': archiveExist }"
                    v-model="archiveName"
                    v-on:keyup="validateArchiveName"
                >

                <div class="input-group-append">
                    <span class="input-group-text">.zip</span>
                </div>
                <div class="invalid-feedback" v-show="archiveExist">
                    {{ lang.modal.zip.fieldFeedback }}
                </div>
            </div>
            <hr />
            <selected-file-list />
        </div>
        <div class="modal-footer">
            <button 
                type="button" 
                class="text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                v-bind:disabled="!submitActive" 
                v-on:click="createArchive"   
            >
                {{ lang.btn.submit }}
            </button>

            <button 
                type="button"
                class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 " 
                v-on:click="hideModal"
            >
                {{ lang.btn.cancel }}
            </button>
        </div>
    </div>
</template>

<script>
import SelectedFileList from '../additions/SelectedFileList.vue';
import modal from '../mixins/modal';
import translate from '../../../mixins/translate';

export default {
    name: 'ZipModal',
    mixins: [modal, translate],
    components: { SelectedFileList },
    data() {
        return {
            // name for new archive
            archiveName: '',

            // archive exist
            archiveExist: false,
        };
    },
    computed: {
        /**
         * Submit button - active or no
         * @returns {string|boolean}
         */
        submitActive() {
            return this.archiveName && !this.archiveExist;
        },
    },
    methods: {
        /**
         * Check the archive name if it exists or not.
         */
        validateArchiveName() {
            if (this.archiveName) {
                this.archiveExist = this.$store.getters[`fm/${this.activeManager}/fileExist`](
                    `${this.archiveName}.zip`
                );
            } else {
                this.archiveExist = false;
            }
        },

        /**
         * Create new archive
         */
        createArchive() {
            this.$store.dispatch('fm/zip', `${this.archiveName}.zip`).then(() => {
                // close modal window
                this.hideModal();
            });
        },
    },
};
</script>
