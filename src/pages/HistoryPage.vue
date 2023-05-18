<template>
    <q-page>
        <div class="q-pa-md row justify-center">
            <q-select class="col-10 q-pa-md" v-model="session_id" :options="session_ids" label="Session ID"
            @update:model-value="getHistory()" />

            <q-scroll-area style="height: 70vh; width: 100%; max-width: 600px;">
                <q-chat-message
                    class="q-pa-md"
                    v-for="(message, index) in conversation"
                    :key="index"
                    :name="message[0].type === 'human' ? 'me' : 'InSource'"
                    :text="[message[0].data.content]"
                    :sent="message[0].type === 'human'"
                />
            </q-scroll-area>
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
        let conversation = ref([] as any[]);
        const getSessionIds = async () => {
            const response = await fetch(`${localStorage.getItem('chaturl')}/session_ids`, {
              method: 'GET'
            });
            const data = await response.json();
            session_ids.value = data;
        };

        const getHistory = async () => {
            const response = await fetch(`${localStorage.getItem('chaturl')}/message_store/${session_id.value}`, {
              method: 'GET'
            });
            conversation.value = await response.json();
        };

        getSessionIds();

        return {
            session_id,
            session_ids,
            conversation,
            getHistory
        };
    }
});
</script>
