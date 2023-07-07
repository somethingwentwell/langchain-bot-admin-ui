<template>
    <q-page>
        <div class="q-pa-md row justify-center">
            <!-- <div class="col-12 q-pa-md">
                <q-btn
                color="red"
                label="Reset Token Count"
                @click="resetTokenCount"/>
            </div> -->
            <div class="col-12 q-pa-md">
                <q-table
                :title="'Tokens Used: ' + (totalTokens.all_token_used as string)"
                :rows="tokenCount"
                row-key="session_id"
                :rows-per-page-options="[10, 20, 50]"
                />
            </div>


        </div>
        
        
    </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'TokenPage',
    components: {},
    setup() {
        const totalTokens = ref('');
        const tokenCount = ref([]);


        const getTotalTokens = async () => {
            const response = await fetch(`${localStorage.getItem('adminurl')}/all_token_used/month`, {
              method: 'GET'
            });
            const data = await response.json();
            totalTokens.value = data;
        };

        const getTotalCount = async () => {
            const response = await fetch(`${localStorage.getItem('adminurl')}/token_count/month`, {
              method: 'GET'
            });
            const data = await response.json();
            tokenCount.value = data;
        };

        // const resetTokenCount = async () => {
        //     const response = await fetch(`${localStorage.getItem('adminurl')}/reset_token`, {
        //       method: 'PUT'
        //     });
        //     const data = await response.json();
        //     console.log(data)
        //     getTotalTokens();
        //     getTotalCount();
        // };

        getTotalTokens();
        getTotalCount();

        return {
            totalTokens,
            tokenCount,
            // resetTokenCount
        };
    }
});
</script>
