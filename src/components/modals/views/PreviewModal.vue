<template>
    <div class="modal-content w-fit fm-modal-preview">
        <div class="modal-body text-center">
            <img
                :src="imgSrc"
                :alt="selectedItem.basename"
                :style="{ 'max-height': maxHeight + 'px' }"
                class="mx-auto"
            />
        </div>
    </div>
</template>

<script>
import CropperModule from '../additions/CropperModule.vue';
import modal from '../mixins/modal';
import translate from '../../../mixins/translate';
import helper from '../../../mixins/helper';
import GET from '../../../http/get';

export default {
    name: 'PreviewModal',
    mixins: [modal, translate, helper],
    components: { CropperModule },
    data() {
        return {
            showCropperModule: false,
            imgSrc: null,
        };
    },
    mounted() {
        this.loadImage();
    },
    computed: {
        /**
         * Authorization required
         * @return {*}
         */
        auth() {
            return this.$store.getters['fm/settings/authHeader'];
        },

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

        /**
         * Show modal footer
         * @return boolean
         */
        showFooter() {
            return this.canCrop(this.selectedItem.extension) && !this.showCropperModule;
        },

        /**
         * Calculate the max height for image
         * @returns {number}
         */
        maxHeight() {
            if (this.$store.state.fm.modal.modalBlockHeight) {
                return this.$store.state.fm.modal.modalBlockHeight - 170;
            }

            return 300;
        },
    },
    methods: {
        /**
         * Can we crop this image?
         * @param extension
         * @returns {boolean}
         */
        canCrop(extension) {
            return this.$store.state.fm.settings.cropExtensions.includes(extension.toLowerCase());
        },

        /**
         * Close cropper
         */
        closeCropper() {
            this.showCropperModule = false;
            this.loadImage();
        },

        /**
         * Load image
         */
        loadImage() {
            // if authorization required
            if (this.auth) {
                GET.preview(this.selectedDisk, this.selectedItem.path).then((response) => {
                    const mimeType = response.headers['content-type'].toLowerCase();
                    const imgBase64 = Buffer.from(response.data, 'binary').toString('base64');

                    this.imgSrc = `data:${mimeType};base64,${imgBase64}`;
                });
            } else {
                this.imgSrc = `${this.$store.getters['fm/settings/baseUrl']}preview?disk=${
                    this.selectedDisk
                }&path=${encodeURIComponent(this.selectedItem.path)}&v=${this.selectedItem.timestamp}`;
            }
        },
    },
};
</script>

<style lang="scss">
.fm-modal-preview {
    .modal-body {
        padding: 0;

        img {
            max-width: 100%;
        }
    }

    & > .flex {
        padding: 1rem;
        border-top: 1px solid #e9ecef;
    }
}
</style>
