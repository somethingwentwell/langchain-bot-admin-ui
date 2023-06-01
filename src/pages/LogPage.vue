<template>
    <q-page>
        <div class="q-pa-md row justify-center">
            <q-select class="col-10 q-pa-md" v-model="session_id" :options="session_ids" label="Session ID"
            @update:model-value="getLog()" />

        <div class="q-pa-md">
            <q-list>
            <q-item v-for="(log, index) in logs" :key="index">
                <q-item-section top>
                <q-item-label lines="1">
                    <span class="text-weight-medium">{{ log[0] }}</span>
                    <span class="text-grey-8"> - {{ log[1] }}</span>
                </q-item-label>
                <q-item-label caption>
                    {{ log[2] }}
                </q-item-label>
                </q-item-section>
            </q-item>
            </q-list>
        </div>

        </div>
        
        
    </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'HistoryPage',
    components: {},
    setup() {
        const session_id = ref('');
        const session_ids = ref([] as any[]);
        let logs = ref([] as any[]);
        const getSessionIds = async () => {
            const response = await fetch(`${localStorage.getItem('adminurl')}/session_ids`, {
              method: 'GET'
            });
            const data = await response.json();
            session_ids.value = data;
        };

        const getLog = async () => {
            const response = await fetch(`${localStorage.getItem('adminurl')}/agent_log/${session_id.value}`, {
              method: 'GET'
            });
            logs.value = await response.json();
        };

        getSessionIds();

        return {
            session_id,
            session_ids,
            logs,
            getLog
        };
    }
});
</script>
