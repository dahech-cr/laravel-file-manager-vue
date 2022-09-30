<template>
    <div class="modal-content fm-modal-rename">
        <ModalHeader :title="lang.modal.rename.title" @hideModal="hideModal" />

        <div class="modal-body">
            <div class="flex flex-col">
                <ModalInput
                    id="fm-input-rename"              
                    :label="lang.modal.rename.fieldName"
                    v-model="name"
                    :invalid="checkName"
                    v-on:keyup="validateName"
                />

                <div class="invalid-feedback" v-show="checkName">
                    {{ lang.modal.rename.fieldFeedback }}
                    {{ directoryExist ? ` - ${lang.modal.rename.directoryExist}` : '' }}
                    {{ fileExist ? ` - ${lang.modal.rename.fileExist}` : '' }}
                </div>
            </div>
        </div>

        <ModalFooter 
            :disabled="!submitDisable"
            :hideModal="hideModal"
            :submitAction="rename"
        />
    </div>
</template>

<script>
import modal from '../mixins/modal';
import translate from '../../../mixins/translate';
import ModalInput from '../box/ModalInput.vue';
import ModalHeader from '../box/ModalHeader.vue';
import ModalFooter from '../box/ModalFooter.vue';

export default {
    name: "RenameModal",
    mixins: [modal, translate],
    data() {
        return {
            name: "",
            directoryExist: false,
            fileExist: false,
        };
    },
    computed: {
        /**
         * Selected item
         * @returns {*}
         */
        selectedItem() {
            return this.$store.getters[`fm/${this.activeManager}/selectedList`][0];
        },
        /**
         * Check new name
         * @returns {boolean}
         */
        checkName() {
            return this.directoryExist || this.fileExist || !this.name;
        },
        /**
         * Submit button disable
         * @returns {*|boolean}
         */
        submitDisable() {
            return this.checkName || this.name === this.selectedItem.basename;
        },
    },
    mounted() {
        // initiate item name
        this.name = this.selectedItem.basename;
    },
    methods: {
        /**
         * Validate item name
         */
        validateName() {
            if (this.name !== this.selectedItem.basename) {
                // if item - folder
                if (this.selectedItem.type === "dir") {
                    // check folder name matches
                    this.directoryExist = this.$store.getters[`fm/${this.activeManager}/directoryExist`](this.name);
                }
                else {
                    // check file name matches
                    this.fileExist = this.$store.getters[`fm/${this.activeManager}/fileExist`](this.name);
                }
            }
        },
        /**
         * Rename item
         */
        rename() {
            // create new name with path
            const newName = this.selectedItem.dirname ? `${this.selectedItem.dirname}/${this.name}` : this.name;
            this.$store
                .dispatch("fm/rename", {
                type: this.selectedItem.type,
                newName,
                oldName: this.selectedItem.path,
            })
                .then(() => {
                // close modal window
                this.hideModal();
            });
        },
    },
    components: { ModalInput, ModalHeader, ModalFooter }
};
</script>
