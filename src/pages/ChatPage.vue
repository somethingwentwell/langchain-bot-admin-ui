<template>
    <q-page>
        <div class="q-pa-md row justify-center">
            <q-input
                style="width: 100%; max-width: 600px;"
                v-model="sid"
                label="Session ID"
                placeholder="Session ID"
            >
            </q-input>
        </div>
        <div class="q-pa-md row justify-center">
            <q-scroll-area style="height: 60vh; width: 100%; max-width: 600px;"
                ref="scrollAreaRef"
            >
                <q-chat-message
                    class="q-pa-md"
                    v-for="(message, index) in conversation"
                    :key="index"
                    :name="message.name"
                    :text="[message.text]"
                    :sent="message.sent"
                    :bg-color="message.color"
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
import { SIGCHLD } from 'constants';
import { defineComponent, ref, onMounted} from 'vue';

export default defineComponent({
    name: 'ChatPage',
    components: {},
    setup() {
        let conversation = ref([] as any[]);
        let message = ref('');
        let running = ref(false)
        const scrollAreaRef = ref(null)
        let sid = ref("1")

        const chatUrl = localStorage.getItem('chaturl')?.replace(/^(https?:\/\/)/, '');
        const ws = new WebSocket(`ws://${chatUrl}/ws`);

        const sendMessage = () => {
            const payload = {
                id: 'ws-test-' + sid.value,
                text: message.value,
            };
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(payload));
                conversation.value.push({
                    name: 'me',
                    text: message.value,
                    sent: true
                });
                message.value = '';
                running.value = true;
            } else {
                console.error('WebSocket connection is closed');
            }
        };

        onMounted(() => {
            ws.onopen = () => {
                console.log('WebSocket connected');
            };

            ws.onmessage = (event) => {
                
                let res = JSON.parse(event.data);
                console.log(event.data)
                if (res.result) {
                    conversation.value.push({
                        name: 'InSource',
                        text: res.result,
                    });
                    if (scrollAreaRef.value) {
                        (scrollAreaRef.value as any)?.setScrollPercentage('vertical', 2);
                    }
                }
                if (res.callback) {
                    if (res.callback === 'on_agent_action') {
                        conversation.value.push({
                            name: 'InSource',
                            text: res.thought[2],
                            color: 'orange'
                        });
                    }
                    if (res.callback === 'on_agent_finish') {
                        if (res.thought[1] != '') {
                            conversation.value.push({
                                name: 'InSource',
                                text: res.thought[1],
                                color: 'orange'
                            });
                        }
                        running.value = false;
                    }

                    if (scrollAreaRef.value) {
                        (scrollAreaRef.value as any)?.setScrollPercentage('vertical', 2);
                    }
                }
                if (res.error) {
                    conversation.value.push({
                        name: 'InSource',
                        text: res.error,
                        color: 'red'
                    });
                    if (scrollAreaRef.value) {
                        (scrollAreaRef.value as any)?.setScrollPercentage('vertical', 2);
                    }
                    running.value = false;
                }
                
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
            };
        });

        return {
            conversation,
            message,
            sendMessage,
            running,
            scrollAreaRef,
            sid
        };
    }
});
</script>
