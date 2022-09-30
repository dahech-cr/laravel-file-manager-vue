<template>
    <div class="modal-content fm-modal-delete">
        <ModalHeader :title="lang.modal.delete.title" @hideModal="hideModal"  />
        <div class="modal-body flex flex-col">
            <div v-if="selectedItems.length">
                <selected-file-list />
            </div>
            <div v-else>
                <span class="text-danger">{{ lang.modal.delete.noSelected }}</span>
            </div>
        </div>
        <ModalFooter 
            :disabled="false"
            :submit-title="lang.modal.delete.title"
            :hideModal="hideModal"
            :submitAction="deleteItems"
        />
    </div>
</template>

<script>
import SelectedFileList from '../additions/SelectedFileList.vue';
import modal from '../mixins/modal';
import translate from '../../../mixins/translate';
import ModalHeader from '../box/ModalHeader.vue';
import ModalFooter from '../box/ModalFooter.vue';

export default {
    name: 'DeleteModal',
    mixins: [modal, translate],
    components: { SelectedFileList, ModalHeader, ModalFooter },
    computed: {
        /**
         * Files and folders for deleting
         * @returns {*}
         */
        selectedItems() {
            return this.$store.getters['fm/selectedItems'];
        },
    },
    methods: {
        /**
         * Delete selected directories and files
         */
        deleteItems() {
            // create items list for delete
            const items = this.selectedItems.map((item) => ({
                path: item.path,
                type: item.type,
            }));

            this.$store.dispatch('fm/delete', items).then(() => {
                this.hideModal();
            });
        },
    },
};
</script>
