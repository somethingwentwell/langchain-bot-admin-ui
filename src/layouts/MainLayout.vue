
<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="icons/favicon-96x96.png">
          </q-avatar> -->
          InSource
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <q-item-label
        header
      >
        Navigation
      </q-item-label>
      <!-- drawer content -->
        <q-scroll-area class="fit">
          <q-list padding class="menu-list">
            <q-item clickable v-ripple @click="$router.replace('/')">
            
              <q-item-section avatar>
                <q-icon name="chat" />
              </q-item-section>

              <q-item-section>
                Test
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="$router.replace('/history')">
              <q-item-section avatar>
                <q-icon name="history" />
              </q-item-section>

              <q-item-section>
                Chat History
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="$router.replace('/log')">
              <q-item-section avatar>
                <q-icon name="summarize" />
              </q-item-section>

              <q-item-section>
                Log
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="$router.replace('/token')">
              <q-item-section avatar>
                <q-icon name="speed" />
              </q-item-section>

              <q-item-section>
                Token Counter
              </q-item-section>
            </q-item>


            <q-item clickable v-ripple @click="$router.replace('/config')">
              <q-item-section avatar>
                <q-icon name="toggle_on" />
              </q-item-section>

              <q-item-section>
                Config
              </q-item-section>
            </q-item>

          </q-list>
          <q-separator />
          <q-item-label
            header
          >
            InSource API Setting
          </q-item-label>
          <q-input v-model="adminurl" @update:model-value="updateAdminUrl" outlined label="InSource Admin API URL" class="q-pa-md"></q-input>
          <q-input v-model="chaturl" @update:model-value="updateChatUrl" outlined label="InSource Chat API URL" class="q-px-md"></q-input>
        </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'MainLayout',
    components: {},
    setup() {
        localStorage.setItem('adminurl', process.env.ADMIN_URL);
        localStorage.setItem('chaturl', process.env.CHAT_URL);
        let adminurl = ref(localStorage.getItem('adminurl'));
        let chaturl = ref(localStorage.getItem('chaturl'));
        const updateAdminUrl = () => {
            localStorage.setItem('adminurl', adminurl.value);
        };
        const updateChatUrl = () => {
            localStorage.setItem('chaturl', chaturl.value);
        };
        return {
            left: ref(false),
            adminurl,
            chaturl,
            updateAdminUrl,
            updateChatUrl
        };
    }
});
</script>