<template>
    <div class="modal-content fm-modal-folder">
        <ModalHeader :title="lang.modal.newFolder.title" @hideModal="hideModal" />

        <div class="modal-body">
            <div class="form-group flex flex-col">
                <ModalInput
                    id="fm-folder-name"              
                    :label="lang.modal.newFolder.fieldName"
                    v-model="directoryName"
                    :invalid="directoryExist"
                    @keyup="validateDirName"
                />
                <div class="invalid-feedback" v-show="directoryExist">
                    {{ lang.modal.newFolder.fieldFeedback }}
                </div>
            </div>
        </div>
        <ModalFooter 
            :disabled="!submitActive"
            :hideModal="hideModal"
            :submitAction="addFolder"
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
    name: "NewFolderModal",
    mixins: [modal, translate],
    data() {
        return {
            // name for new directory
            directoryName: "",
            // directory exist
            directoryExist: false,
        };
    },
    computed: {
        /**
         * Submit button - active or no
         * @returns {string|boolean}
         */
        submitActive() {
            return this.directoryName && !this.directoryExist;
        },
    },
    methods: {
        /**
         * Check the folder name if it exists or not.
         */
        validateDirName() {
            if (this.directoryName) {
                this.directoryExist = this.$store.getters[`fm/${this.activeManager}/directoryExist`](this.directoryName);
            }
            else {
                this.directoryExist = false;
            }
        },
        /**
         * Create new directory
         */
        addFolder() {
            this.$store.dispatch("fm/createDirectory", this.directoryName).then((response) => {
                if (response.data.result.status === "success") {
                    this.hideModal();
                }
            });
        },
    },
    components: { ModalHeader, ModalFooter, ModalInput }
};
</script>
