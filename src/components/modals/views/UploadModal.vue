<template>
    <div class="modal-content fm-modal-upload">
        <ModalHeader :title="lang.modal.upload.title" @hideModal="hideModal" />

        <div class="modal-body">
            <div class="fm-btn-wrapper" v-show="!progressBar">
                <button type="button" class="text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                    {{ lang.btn.uploadSelect }}
                </button>
                <input 
                    type="file" 
                    multiple 
                    name="myfile" 
                    v-on:change="selectFiles($event)" 
                />
            </div>
            <div class="fm-upload-list flex flex-col gap-y-1" v-if="countFiles">
                <div class="flex justify-between" v-for="(item, index) in newFiles" v-bind:key="index">
                    <div class="w-75 text-truncate">
                        <i class="bi" v-bind:class="mimeToIcon(item.type)" />
                        {{ item.name }}
                    </div>
                    <div class="text-right">
                        {{ bytesToHuman(item.size) }}
                    </div>
                </div>
                <hr />
                <div class="flex justify-between py-4">
                    <div>
                        <strong>{{ lang.modal.upload.selected }}</strong>
                        {{ newFiles.length }}
                    </div>
                    <div class="text-right">
                        <strong>{{ lang.modal.upload.size }}</strong>
                        {{ allFilesSize }}
                    </div>
                </div>
                <hr />
                <div class="flex justify-between pt-4">
                    <div>
                        <strong>{{ lang.modal.upload.ifExist }}</strong>
                    </div>
                    <div class="flex items-center">
                        <input 
                            id="uploadRadio1" 
                            type="checkbox"
                            class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                            name="uploadOptions"
                            v-bind:checked="!overwrite"
                            v-on:change="overwrite = 0"
                        >
                        <label for="uploadRadio1" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {{ lang.modal.upload.skip }}
                        </label>
                    </div>
                    <div class="flex items-center">
                        <input 
                            id="uploadRadio2" 
                            type="checkbox"
                            class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                            name="uploadOptions"
                            v-bind:checked="overwrite"
                            v-on:change="overwrite = 1"
                        >
                        <label for="uploadRadio2" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {{ lang.modal.upload.overwrite }}
                        </label>
                    </div>
                </div>
            </div>
            <div v-else>
                <p class="pl-2">{{ lang.modal.upload.noSelected }}</p>
            </div>
        </div>
        <ModalFooter 
            :disabled="!countFiles"
            :hideModal="hideModal"
            :submitAction="uploadFiles"
        />
    </div>
</template>

<script>
import modal from '../mixins/modal';
import translate from '../../../mixins/translate';
import helper from '../../../mixins/helper';
import ModalHeader from '../box/ModalHeader.vue';
import ModalFooter from '../box/ModalFooter.vue';

export default {
    name: "UploadModal",
    mixins: [modal, translate, helper],
    data() {
        return {
            newFiles: [],
            overwrite: 0,
        };
    },
    computed: {
        /**
         * Progress bar value - %
         * @returns {number}
         */
        progressBar() {
            return this.$store.state.fm.messages.actionProgress;
        },
        /**
         * Count of files selected for upload
         * @returns {number}
         */
        countFiles() {
            return this.newFiles.length;
        },
        /**
         * Calculate the size of all files
         * @returns {*|string}
         */
        allFilesSize() {
            let size = 0;
            for (let i = 0; i < this.newFiles.length; i += 1) {
                size += this.newFiles[i].size;
            }
            return this.bytesToHuman(size);
        },
    },
    methods: {
        /**
         * Select file or files
         * @param event
         */
        selectFiles(event) {
            // files selected?
            if (event.target.files.length === 0) {
                // no file selected
                this.newFiles = [];
            }
            else {
                // we have file or files
                this.newFiles = event.target.files;
            }
        },
        /**
         * Upload new files
         */
        uploadFiles() {
            // if files exists
            if (this.countFiles) {
                // upload files
                this.$store
                    .dispatch("fm/upload", {
                    files: this.newFiles,
                    overwrite: this.overwrite,
                })
                    .then((response) => {
                    if (response.data.result.status === "success") {
                        this.hideModal();
                    }
                });
            }
        },
    },
    components: { ModalHeader, ModalFooter }
};
</script>

<style lang="scss">
.fm-modal-upload {
    .fm-btn-wrapper {
        position: relative;
        overflow: hidden;
        padding-bottom: 6px;
        margin-bottom: 0.6rem;
    }

    .fm-btn-wrapper input[type='file'] {
        font-size: 100px;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }

    .fm-upload-list .bi {
        padding-right: 0.5rem;
    }

    .fm-upload-list .form-check-inline {
        margin-right: 0;
    }

    .fm-upload-info > .progress {
        margin-bottom: 1rem;
    }
}
</style>
