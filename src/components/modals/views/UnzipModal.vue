<template>
    <div class="modal-content fm-modal-unzip">

        <ModalHeader :title="lang.modal.unzip.title" @hideModal="hideModal" />
        <div class="modal-body">
            <div class="flex justify-between py-2 mb-4">
                <div>
                    <strong>{{ lang.modal.unzip.fieldRadioName }}</strong>
                </div>
                <div class="flex items-center">
                    <input 
                        id="unzipRadio1" 
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                        v-bind:checked="!createFolder"
                        v-on:change="createFolder = false"
                    >
                    <label for="unzipRadio1" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {{ lang.modal.unzip.fieldRadio1 }}
                    </label>
                </div>
                <div class="flex items-center">
                    <input 
                        id="unzipRadio2" 
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                        v-bind:checked="createFolder"
                        v-on:change="createFolder = true"
                    >
                    <label for="unzipRadio1" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {{ lang.modal.unzip.fieldRadio2 }}
                    </label>
                </div>
            </div>
            <hr />
            <div v-if="createFolder" class="form-group flex flex-col pt-3">
                <ModalInput 
                    class="mb-3"
                    id="fm-folder-name"
                    :label="lang.modal.unzip.fieldName"
                    :invalid="directoryExist"
                    v-model="directoryName"
                    @keyup="validateDirName"
                />

                <div class="invalid-feedback" v-show="directoryExist">
                    {{ lang.modal.unzip.fieldFeedback }}
                </div>
            </div>
            <span v-else class="text-danger mt-3">{{ lang.modal.unzip.warning }}</span>
        </div>
        <ModalFooter
            :disabled="!submitActive"
            :hideModal="hideModal"
            :submitAction="unpackArchive"
        />
    </div>
</template>

<script>
import modal from '../mixins/modal';
import translate from '../../../mixins/translate';
import ModalInput from '../box/ModalInput.vue';
import ModalFooter from '../box/ModalFooter.vue';
import ModalHeader from '../box/ModalHeader.vue';

export default {
    name: "UnzipModal",
    mixins: [modal, translate],
    data() {
        return {
            createFolder: false,
            directoryName: "",
            directoryExist: false,
        };
    },
    computed: {
        /**
         * Submit button - active or no
         * @returns {string|boolean}
         */
        submitActive() {
            if (this.createFolder) {
                return this.directoryName && !this.directoryExist;
            }
            return true;
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
         * Unpack selected archive
         */
        unpackArchive() {
            this.$store.dispatch("fm/unzip", this.createFolder ? this.directoryName : null).then(() => {
                this.hideModal();
            });
        },
    },
    components: { ModalInput, ModalFooter, ModalHeader }
};
</script>
