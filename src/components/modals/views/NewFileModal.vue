<template>
    <div class="modal-content fm-modal-folder">
        <ModalHeader :title="lang.modal.newFile.title" @hideModal="hideModal" />
        <div class="modal-body">
            <div class="form-group flex flex-col">
                <ModalInput
                    id="fm-file-name"              
                    :label="lang?.modal?.newFile?.fieldName"
                    v-model="fileName"
                    :invalid="fileExist"
                    v-on:keyup="validateFileName"
                />
                <div class="invalid-feedback" v-show="fileExist">
                    {{ lang.modal.newFile.fieldFeedback }}
                </div>
            </div>
        </div>
        <ModalFooter 
            :disabled="!submitActive"
            :hideModal="hideModal"
            :submitAction="addFile"
        />
    </div>
</template>

<script>
import modal from '../mixins/modal';
import translate from '../../../mixins/translate';
import ModalHeader from '../box/ModalHeader.vue';
import ModalFooter from '../box/ModalFooter.vue';
import ModalInput from '../box/ModalInput.vue';

export default {
    name: "NewFileModal",
    mixins: [modal, translate],
    data() {
        return {
            // name for new file
            fileName: "",
            // file exist
            fileExist: false,
        };
    },
    computed: {
        /**
         * Submit button - active or no
         * @returns {string|boolean}
         */
        submitActive() {
            return this.fileName && !this.fileExist;
        },
    },
    methods: {
        /**
         * Check the file name if it exists or not.
         */
        validateFileName() {
            if (this.fileName) {
                this.fileExist = this.$store.getters[`fm/${this.activeManager}/fileExist`](this.fileName);
            }
            else {
                this.fileExist = false;
            }
        },
        /**
         * Create new file
         */
        addFile() {
            this.$store.dispatch("fm/createFile", this.fileName).then((response) => {
                if (response.data.result.status === "success") {
                    this.hideModal();
                }
            });
        },
    },
    components: { ModalHeader, ModalFooter, ModalInput }
};
</script>
