<template>
    <div class="modal-content fm-modal-zip">
        <ModalHeader :title="lang.modal.zip.title" @hideModal="hideModal" />
        <div class="modal-body">            
            <ModalInput 
                class="mb-3"
                id="fm-zip-name"
                :label="lang.modal.zip.fieldName"
                :invalid="archiveExist"
                v-model="archiveName"
                @keyup="validateArchiveName"
            />

            <div class="input-group-append">
                <span class="input-group-text">.zip</span>
            </div>
            <div class="invalid-feedback" v-show="archiveExist">
                {{ lang.modal.zip.fieldFeedback }}
            </div>
           
            <hr />
            <selected-file-list />
        </div>
        <ModalFooter
            :disabled="!submitActive"
            :hideModal="hideModal"
            :submitAction="createArchive"
        />
    </div>
</template>

<script>
import SelectedFileList from '../additions/SelectedFileList.vue';
import modal from '../mixins/modal';
import translate from '../../../mixins/translate';
import ModalInput from '../box/ModalInput.vue';
import ModalHeader from '../box/ModalHeader.vue';
import ModalFooter from '../box/ModalFooter.vue';

export default {
    name: 'ZipModal',
    mixins: [modal, translate],
    components: { SelectedFileList, ModalInput, ModalHeader, ModalFooter },
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
