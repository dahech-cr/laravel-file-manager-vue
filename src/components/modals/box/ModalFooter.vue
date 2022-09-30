<template>
  <div class="modal-footer">
    <button 
        type="button" 
        class="text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
        :disabled="disabled" 
        @click="submitAction"   
    >
        {{submitTitle}}
    </button>

    <button 
        type="button"
        class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 " 
        @click="hideModal"
    >
        Cancel
    </button>
</div>
</template>

<script setup>
defineProps({
  submitTitle : {type: String, default: 'Submit' },
  disabled : {type: [Boolean, Number]},
  hideModal: {type: Function},
  submitAction: {type: Function}
})
</script>

<style lang="scss" scoped>

</style>