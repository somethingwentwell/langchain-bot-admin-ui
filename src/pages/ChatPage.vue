<template>
    <q-page>
        <div class="q-pa-md row justify-center">
            <q-scroll-area style="height: 70vh; width: 100%; max-width: 600px;"
                ref="scrollAreaRef"
            >
                <q-chat-message
                    class="q-pa-md"
                    v-for="(message, index) in conversation"
                    :key="index"
                    :name="message.name"
                    :text="[message.text]"
                    :sent="message.sent"
                />
                <q-chat-message name="InSource" v-if="running">
                    <q-spinner-dots size="2rem" />
                </q-chat-message>
            </q-scroll-area>
        </div>
        <div class="q-pa-md row justify-center">
            <q-input
                style="width: 100%; max-width: 600px;"
                filled
                v-model="message"
                @keyup.enter="sendMessage"
                placeholder="Type your message here"
            >
                <template v-slot:after>
                    <q-btn round dense flat icon="send" @click="sendMessage" />
                </template>
            </q-input>
        </div>
        
    </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'ChatPage',
    components: {},
    setup() {
        let conversation = ref([] as any[]);
        let message = ref('');
        let running = ref(false)
        const scrollAreaRef = ref(null)
        const sendMessage = async () => {
            conversation.value.push({
                name: 'me',
                text: message.value,
                sent: true
            });
            running.value = true;
            if (scrollAreaRef.value) {
                (scrollAreaRef.value as any)?.setScrollPercentage('vertical', 2)
            }
            const response = await fetch(`${localStorage.getItem('chaturl')}/run`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({
                    'text': message.value,
                    'id': 'admin-ui-test'
                })
            });
            const data = await response.json();
            message.value = '';
            conversation.value.push({
                name: 'InSource',
                text: data.result,
            });
            if (scrollAreaRef.value) {
                (scrollAreaRef.value as any)?.setScrollPercentage('vertical', 2)
            }
            running.value = false;
        };
        return {
            conversation,
            message,
            sendMessage,
            running,
            scrollAreaRef
        };
    }
});
</script>
