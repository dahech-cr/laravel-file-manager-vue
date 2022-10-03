<template>
    <div class="fm-table">
        <table class="table-sm">
            <thead>
                <tr class="py-2 border-b border-gray-400">
                    <th class="w-1/2 text-left" v-on:click="sortBy('name')">
                        {{ lang.manager.table.name }}
                        <template v-if="sortSettings.field === 'name'">
                            <i class="bi bi-sort-down" v-show="sortSettings.direction === 'down'" />
                            <i class="bi bi-sort-up" v-show="sortSettings.direction === 'up'" />
                        </template>
                    </th>
                    <th class="w-1/4 text-left" v-on:click="sortBy('size')">
                        {{ lang.manager.table.size }}
                        <template v-if="sortSettings.field === 'size'">
                            <i class="bi bi-sort-down" v-show="sortSettings.direction === 'down'" />
                            <i class="bi bi-sort-up" v-show="sortSettings.direction === 'up'" />
                        </template>
                    </th>
                    <th class="w-1/4 text-left" v-on:click="sortBy('type')">
                        {{ lang.manager.table.type }}
                        <template v-if="sortSettings.field === 'type'">
                            <i class="bi bi-sort-down" v-show="sortSettings.direction === 'down'" />
                            <i class="bi bi-sort-up" v-show="sortSettings.direction === 'up'" />
                        </template>
                    </th>
                    <th class="w-auto text-left" v-on:click="sortBy('date')">
                        {{ lang.manager.table.date }}
                        <template v-if="sortSettings.field === 'date'">
                            <i class="bi bi-sort-down" v-show="sortSettings.direction === 'down'" />
                            <i class="bi bi-sort-up" v-show="sortSettings.direction === 'up'" />
                        </template>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!isRootPath">
                    <td colspan="4" class="fm-content-item" v-on:click="levelUp">
                        <i class="bi bi-arrow-90deg-up" />
                    </td>
                </tr>
                <tr
                    v-for="(directory, index) in directories"
                    v-bind:key="`d-${index}`"
                    v-bind:class="{ 'table-info': checkSelect('directories', directory.path) }"
                    v-on:click="selectItem('directories', directory.path, $event)"
                    v-on:contextmenu.prevent="contextMenu(directory, $event)"
                    class=" border-b border-gray-400"
                >
                    <td
                        class="fm-content-item unselectable py-2 pl-2"
                        v-bind:class="acl && directory.acl === 0 ? 'text-hidden' : ''"
                        v-on:dblclick="selectDirectory(directory.path)"
                    >   
                        <p class="flex items-center gap-x-2">
                            <i class="bi bi-folder leading-3"></i> {{ directory.basename }}
                        </p>
                    </td>

                    <td class="py-2"></td>
                    <td class="py-2">{{ lang.manager.table.folder }}</td>
                    <td class="py-2 pr-2">{{ timestampToDate(directory.timestamp)}}</td>
                </tr>
                <tr
                    v-for="(file, index) in files"
                    v-bind:key="`f-${index}`"
                    v-bind:class="{ 'table-info': checkSelect('files', file.path) }"
                    v-on:click="selectItem('files', file.path, $event)"
                    v-on:dblclick="selectAction(file.path, file.extension)"
                    v-on:contextmenu.prevent="contextMenu(file, $event)"
                >
                    <td class="fm-content-item unselectable py-2 pl-2" v-bind:class="acl && file.acl === 0 ? 'text-hidden' : ''">
                        <p class="flex items-center gap-x-2">
                            <i class="bi leading-3" v-bind:class="extensionToIcon(file.extension)" />
                            {{ file.filename ? file.filename : file.basename }}
                        </p>
                    </td>

                    <td class="py-2">{{ bytesToHuman(file.size) }}</td>
                    <td class="py-2">{{ file.extension }}</td>
                    <td class="py-2 pr-2">{{ timestampToDate(file.timestamp)}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import translate from '../../mixins/translate';
import helper from '../../mixins/helper';
import managerHelper from './mixins/manager';

export default {
    name: 'table-view',
    mixins: [translate, helper, managerHelper],
    props: {
        manager: { type: String, required: true },
    },
    computed: {
        /**
         * Sort settings
         * @returns {*}
         */
        sortSettings() {
            return this.$store.state.fm[this.manager].sort;
        },
    },
    methods: {
        /**
         * Sort by field
         * @param field
         */
        sortBy(field) {
            this.$store.dispatch(`fm/${this.manager}/sortBy`, { field, direction: null });
        },
    },
};
</script>

<style lang="scss">
.fm-table {
    thead th {
        background: white;
        position: sticky;
        top: 0;
        z-index: 10;
        cursor: pointer;
        border-top: none;

        &:hover {
            background-color: #f8f9fa;
        }

        & > i {
            padding-left: 0.5rem;
        }
    }

    td {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    tr:hover {
        background-color: #f8f9fa;
    }

    .fm-content-item {
        cursor: pointer;
        max-width: 1px;
    }

    .text-hidden {
        color: #cdcdcd;
    }
}
</style>
