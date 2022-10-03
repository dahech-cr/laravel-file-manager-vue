<template>
    <div class="fm flex flex-col" v-bind:class="{ 'fm-full-screen': fullScreen }">
        <navbar-block />
        <div class="fm-body flex">
            <notification-block />
            <context-menu />
            <modal-block v-if="showModal" />
            <template v-if="windowsConfig === 1">
                <left-manager class="col" manager="left" />
            </template>
            <template v-else-if="windowsConfig === 2">
                <folder-tree class="w-1/4" />
                <left-manager class="w-3/4" manager="left" />
            </template>
            <template v-else-if="windowsConfig === 3">
                <left-manager class="w-full" manager="left" v-on:click.native="selectManager('left')"
                    v-on:contextmenu.native="selectManager('left')">
                </left-manager>
                <right-manager class="w-full" manager="right" v-on:click.native="selectManager('right')"
                    v-on:contextmenu.native="selectManager('right')">
                </right-manager>
            </template>
        </div>
        <info-block />
    </div>
</template>

<script>
/* eslint-disable import/no-duplicates, no-param-reassign */
import { mapState } from 'vuex';
// Axios
import HTTP from './http/axios';
import EventBus from './emitter';
// Components
import NavbarBlock from './components/blocks/NavbarBlock.vue';
import FolderTree from './components/tree/FolderTree.vue';
import LeftManager from './components/manager/Manager.vue';
import RightManager from './components/manager/Manager.vue';
import ModalBlock from './components/modals/ModalBlock.vue';
import InfoBlock from './components/blocks/InfoBlock.vue';
import ContextMenu from './components/blocks/ContextMenu.vue';
import NotificationBlock from './components/blocks/NotificationBlock.vue';
// Mixins
import translate from './mixins/translate';

export default {
    name: 'FileManager',
    mixins: [translate],
    components: {
        NavbarBlock,
        FolderTree,
        LeftManager,
        RightManager,
        ModalBlock,
        InfoBlock,
        ContextMenu,
        NotificationBlock,
    },
    props: {
        /**
         * LFM manual settings
         */
        settings: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            interceptorIndex: {
                request: null,
                response: null,
            },
        };
    },
    created() {
        // manual settings
        this.$store.commit('fm/settings/manualSettings', this.settings);

        // initiate Axios
        this.$store.commit('fm/settings/initAxiosSettings');
        this.setAxiosConfig();
        this.requestInterceptor();
        this.responseInterceptor();

        // initialize app settings
        this.$store.dispatch('fm/initializeApp');
    },
    destroyed() {
        // reset state
        this.$store.dispatch('fm/resetState');

        // delete events
        EventBus.all.clear();

        // eject interceptors
        HTTP.interceptors.request.eject(this.interceptorIndex.request);
        HTTP.interceptors.response.eject(this.interceptorIndex.response);
    },
    computed: {
        ...mapState('fm', {
            windowsConfig: (state) => state.settings.windowsConfig,
            activeManager: (state) => state.settings.activeManager,
            showModal: (state) => state.modal.showModal,
            fullScreen: (state) => state.settings.fullScreen,
        }),
    },
    methods: {
        /**
         * Axios default config
         */
        setAxiosConfig() {
            HTTP.defaults.baseURL = this.$store.getters['fm/settings/baseUrl'];
            HTTP.defaults.headers = this.$store.getters['fm/settings/headers'];
        },

        /**
         * Add axios request interceptor
         */
        requestInterceptor() {
            this.interceptorIndex.request = HTTP.interceptors.request.use(
                (config) => {
                    // loading spinner +
                    this.$store.commit('fm/messages/addLoading');

                    return config;
                },
                (error) => {
                    // loading spinner -
                    this.$store.commit('fm/messages/subtractLoading');
                    return Promise.reject(error);
                }
            );
        },

        /**
         * Add axios response interceptor
         */
        responseInterceptor() {
            this.interceptorIndex.response = HTTP.interceptors.response.use(
                (response) => {
                    // loading spinner -
                    this.$store.commit('fm/messages/subtractLoading');

                    // create notification, if find message text
                    if (Object.prototype.hasOwnProperty.call(response.data, 'result')) {
                        if (response.data.result.message) {
                            const message = {
                                status: response.data.result.status,
                                message: Object.prototype.hasOwnProperty.call(
                                    this.lang.response,
                                    response.data.result.message
                                )
                                    ? this.lang.response[response.data.result.message]
                                    : response.data.result.message,
                            };

                            // show notification
                            EventBus.emit('addNotification', message);

                            // set action result
                            this.$store.commit('fm/messages/setActionResult', message);
                        }
                    }

                    return response;
                },
                (error) => {
                    // loading spinner -
                    this.$store.commit('fm/messages/subtractLoading');

                    const errorMessage = {
                        status: 0,
                        message: '',
                    };

                    const errorNotificationMessage = {
                        status: 'error',
                        message: '',
                    };

                    // add message
                    if (error.response) {
                        errorMessage.status = error.response.status;

                        if (error.response.data.message) {
                            const trMessage = Object.prototype.hasOwnProperty.call(
                                this.lang.response,
                                error.response.data.message
                            )
                                ? this.lang.response[error.response.data.message]
                                : error.response.data.message;

                            errorMessage.message = trMessage;
                            errorNotificationMessage.message = trMessage;
                        } else {
                            errorMessage.message = error.response.statusText;
                            errorNotificationMessage.message = error.response.statusText;
                        }
                    } else if (error.request) {
                        errorMessage.status = error.request.status;
                        errorMessage.message = error.request.statusText || 'Network error';
                        errorNotificationMessage.message = error.request.statusText || 'Network error';
                    } else {
                        errorMessage.message = error.message;
                        errorNotificationMessage.message = error.message;
                    }

                    // set error message
                    this.$store.commit('fm/messages/setError', errorMessage);

                    // show notification
                    EventBus.emit('addNotification', errorNotificationMessage);

                    return Promise.reject(error);
                }
            );
        },

        /**
         * Select manager (when shown 2 file manager windows)
         * @param managerName
         */
        selectManager(managerName) {
            if (this.activeManager !== managerName) {
                this.$store.commit('fm/setActiveManager', managerName);
            }
        },
    },
};
</script>

<style lang="scss">
.fm {
    position: relative;
    height: 100%;
    padding: 1rem;
    background-color: white;

    &:-moz-full-screen {
        background-color: white;
    }

    &:-webkit-full-screen {
        background-color: white;
    }

    &:fullscreen {
        background-color: white;
    }

    .fm-body {
        flex: 1 1 auto;
        overflow: hidden;
        position: relative;
        padding-top: 1rem;
        padding-bottom: 1rem;
        border-top: 1px solid #6c757d;
        border-bottom: 1px solid #6c757d;
    }

    .unselectable {
        user-select: none;
    }
}

.fm-error {
    color: white;
    background-color: #dc3545;
    border-color: #dc3545;
}

.fm-danger {
    color: #dc3545;
    background-color: white;
    border-color: #dc3545;
}

.fm-warning {
    color: #ffc107;
    background-color: white;
    border-color: #ffc107;
}

.fm-success {
    color: #198754;
    background-color: white;
    border-color: #198754;
}

.fm-info {
    color: #0dcaf0;
    background-color: white;
    border-color: #0dcaf0;
}

.fm.fm-full-screen {
    width: 100%;
    height: 100%;
    padding-bottom: 0;
}
</style>

<style lang="scss">
.btn-secondary {
    --bs-btn-color: #fff;
    --bs-btn-bg: #6c757d;
    --bs-btn-border-color: #6c757d;
    --bs-btn-hover-color: #fff;
    --bs-btn-hover-bg: #5c636a;
    --bs-btn-hover-border-color: #565e64;
    --bs-btn-focus-shadow-rgb: 130, 138, 145;
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: #565e64;
    --bs-btn-active-border-color: #51585e;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: #fff;
    --bs-btn-disabled-bg: #6c757d;
    --bs-btn-disabled-border-color: #6c757d;
}

.btn {
    --bs-btn-padding-x: 0.75rem;
    --bs-btn-padding-y: 0.375rem;
    --bs-btn-font-family: ;
    --bs-btn-font-size: 1rem;
    --bs-btn-font-weight: 400;
    --bs-btn-line-height: 1.5;
    --bs-btn-color: #212529;
    --bs-btn-bg: transparent;
    --bs-btn-border-width: 1px;
    --bs-btn-border-color: transparent;
    --bs-btn-border-radius: 0.375rem;
    --bs-btn-hover-border-color: transparent;
    --bs-btn-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 1px 1px rgba(0, 0, 0, 0.075);
    --bs-btn-disabled-opacity: 0.65;
    --bs-btn-focus-box-shadow: 0 0 0 0.25rem rgba(var(--bs-btn-focus-shadow-rgb), .5);
    display: inline-block;
    padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x);
    font-family: var(--bs-btn-font-family);
    font-size: var(--bs-btn-font-size);
    font-weight: var(--bs-btn-font-weight);
    line-height: var(--bs-btn-line-height);
    color: var(--bs-btn-color);
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    border: var(--bs-btn-border-width) solid var(--bs-btn-border-color);
    border-radius: var(--bs-btn-border-radius);
    background-color: var(--bs-btn-bg);
    transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}

.modal-dialog {
    position: relative;
    width: 90%;
    pointer-events: none;
    height: 100%;
    overflow-y: auto;
    display: flex;
}

.modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    color: rgb(0, 0, 0);
    pointer-events: auto;
    background-color: rgb(255, 255, 255);
    background-clip: padding-box;
    outline: 0;
    margin: auto;
}

.modal-header {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 20px 10px;
    border-bottom: 1px solid rgb(209 213 219 );
}

.modal-body {
    position: relative;
    display: flex;
    justify-content: center;
    flex: 1 1 auto;
    padding: 20px 10px;
    flex-direction: column;
}

.modal-footer {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 0;
    background-color: white;
    border-top: 1px solid rgb(209 213 219);
}

.modal-title {
    margin-bottom: 0;
    line-height: 20px;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1111;
    display: none;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    outline: 0;
}

.badge {
    display: inline-block;
    padding: 0.25em 0.4em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
}

.btn-close {
    box-sizing: content-box;
    width: 1em;
    height: 1em;
    padding: 0.25em 0.25em;
    color: #000;
    border: 0;
    border-radius: 0.375rem;
    opacity: .5;
}

.leading-3{
    line-height: 12px;
}
.pl-2{
    padding-left: 8px;
}
</style>