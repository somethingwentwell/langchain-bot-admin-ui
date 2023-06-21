<template>
  <q-page class="row justify-evenly">
    <div class="q-pa-md">
      <q-stepper
        v-model="step"
        ref="stepper"
        alternative-labels
        color="primary"
        animated
      >
        <q-step
          :name="1"
          title="Edit Configuration"
          icon="settings"
          :done="step > 1"
        >
          <q-form @submit.prevent="submitForm">
          <q-list bordered>
            <q-expansion-item
              group="somegroup"
              icon="smart_toy"
              label="SYSTEM PROMPT"
              default-opened
              header-class="text-primary"
            >
              <div class="q-pa-xs">
                <q-input
                  v-model="lc.envVar['CHAT_SYSTEM_PROMPT']"
                  outlined
                  autogrow
                />
              </div>
            </q-expansion-item>
            <q-separator />

            <q-expansion-item group="somegroup" icon="settings" label="ADVANCED SETTINGS" header-class="text-teal">
              <div v-for="(value, key) in lc.envVar" :key="key">
                <q-input
                  v-model="lc.envVar[key]"
                  :label="key"
                  :value="lc.envVar[key]"
                  type="text"
                  outlined
                  class="q-pa-xs"
                />
              </div>
            </q-expansion-item>
          </q-list>
          <q-btn type="submit" label="Save" class="q-mt-md" />
          </q-form>
        </q-step>

        <q-step
          :name="2"
          title="Add Tool(s) & Document(s)"
          caption="Optional"
          icon="create_new_folder"
          :done="step > 2"
        >
          <div class="q-pa-md q-gutter-y-sm column">
            <div v-for="(value, key) in lc.toolsVar" :key="key">
              <q-toggle v-model="lc.toolsVar[key]" :label="key"></q-toggle>
            </div>
          </div>
          

             <div v-if="lc.toolsVar['aoaiondatatool']" class="q-pa-md">
                <q-input
                  class="q-pa-xs"
                  label="AZURE COGNITIVE SEARCH URL"
                  v-model="lc.envVar['AZURE_COGNITIVE_SEARCH_URL']"
                  outlined
                />
                <q-input
                  class="q-pa-xs"
                  label="AZURE COGNITIVE SEARCH KEY"
                  v-model="lc.envVar['AZURE_COGNITIVE_SEARCH_KEY']"
                  outlined
                />
                <q-input
                  class="q-pa-xs"
                  label="AZURE COGNITIVE SEARCH DESCRIPTION"
                  v-model="lc.envVar['AZURE_COGNITIVE_SEARCH_DESC']"
                  outlined
                />
                <q-input
                  class="q-pa-xs"
                  label="AZURE COGNITIVE SEARCH INDEX NAME"
                  v-model="lc.envVar['AZURE_COGNITIVE_SEARCH_INDEX_NAME']"
                  outlined
                />
            </div>

            <div v-if="lc.toolsVar['docsimport']" class="q-pa-md">
              <q-table
                flat bordered
                title="Upload docs"
                :rows="rows"
                :columns="columns"
                row-key="name"
              >

                <template v-slot:header="props">
                  <q-tr :props="props">
                    <q-th auto-width />
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>

                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td auto-width>
                      <q-btn size="sm" color="primary" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
                    </q-td>
                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      {{ col.value }}
                    </q-td>
                  </q-tr>
                  <q-tr v-show="props.expand" :props="props">
                    <q-td colspan="100%">
                      <div class="text-left">
                        <div v-for="folder in lc.getFolderData(props.row.name)"
                          :key="folder.subfolder"
                          :props="props"
                          class="q-pa-xs"
                        >
                          <q-list bordered separator>
                            <q-item-label header>{{ folder.subfolder }}</q-item-label>
                            <q-item 
                            v-for="file in folder.files"
                              :key="file"
                               v-ripple >
                              <q-item-section>{{ file }}</q-item-section>
                              <q-item-section side>
                                <q-btn dense flat icon="delete" @click="deleteFile(props.row.name, folder.subfolder, file)" />
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </div>
                          <q-input class="q-pa-md" v-model="subfolder" outlined label="Subfolder Name">
                            
                          </q-input>
                          <q-file class="q-px-md" outlined bottom-slots v-model="uploadfile[props.row.name]" label="Upload File" counter max-files="1">
                            <template v-slot:before>
                              <q-icon name="folder_open" />
                            </template>

                            <template v-slot:append>
                              <q-btn round dense flat icon="add" @click="upload(uploadfile[props.row.name], props.row.name)" />
                            </template>
                          </q-file>
                      </div>
                    </q-td>
                  </q-tr>
                </template>

              </q-table>
            </div>
            <div class="q-pa-md" v-if="lc.toolsVar['zapiertool']">
              <q-btn
                color="secondary"
                label="Open Zapier NLA"
                @click="openZapier"
              />
            </div>
            <div class="q-pa-md" v-if="lc.toolsVar['chatgptplugins']">
              <q-input
                label="ChatGPT Plugins"
                class="q-py-md"
                v-model="chatgptPlugins"
                outlined
                autogrow
              />

              <q-btn
                color="secondary"
                label="Save Plugins"
                @click="saveChatGPTPlugins(chatgptPlugins)"
              />
            </div>
            <q-btn label="Save" @click="saveTools();" class="q-mt-md" />
        </q-step>

        <q-step
          :name="3"
          title="Start InSource"
          icon="add_comment"
        >
          <!-- <q-btn-group spread>
            <q-btn color="primary" label="Start" icon="start" @click="ops('start')" />
            <q-btn color="secondary" label="Restart" icon="restart_alt" @click="ops('restart')" />
            <q-btn color="red" label="Stop" icon="stop" @click="ops('stop')" />
          </q-btn-group> -->
          <q-btn-group spread>
            <q-btn color="primary" label="Restart InSource Server" icon="restart_alt" @click="restart()" />
          </q-btn-group>
          <!-- <q-input
            class="q-pa-md"
            type="textarea"
            rows="15"
            v-model="logs"
            outlined
            label="Logs"
          /> -->
          <!-- <q-btn label="Refresh Log" icon="refresh"  @click="getLogs()" /> -->
          <div class="q-py-md">
            <q-input bottom-slots v-model="chatUrl" label="Chat API URL">
              <template v-slot:after>
                <q-btn round dense flat @click="refreshStatus" icon="refresh" />
              </template>
            </q-input>
            <q-chip v-if="serverStatus" color="teal" text-color="white" icon="done">
              Server Status: Ready
            </q-chip>
            <q-chip v-if="!serverStatus" color="orange" text-color="white" icon="close">
              Server Status: Not Ready
            </q-chip>
          </div>
          <div v-if="serverStatus" class="q-py-md">
            <q-toolbar class="bg-primary text-white shadow-2">
              <q-toolbar-title>Enabled Tools</q-toolbar-title>
            </q-toolbar>
            <q-list bordered separator>
              <q-item clickable v-ripple v-for="(tool, index) in availableTools" :key="index">
                <q-item-section>
                  <q-item-label overline>{{ tool.name }}</q-item-label>
                  <q-item-label caption>{{ tool.description }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 3 ? 'Finish' : 'Continue'" />
            <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useLcStore } from '../stores/lc-store';
import {
  Loading
} from 'quasar'

const columns = [
  {
    name: 'File Type',
    required: true,
    label: 'filetype',
    align: 'left',
    field: (row: { name: string }) => row.name,
    format: (val: any) => `${val}`,
    sortable: true
  }
]

const rows = [
  {
    name: 'txts',
  },
  {
    name: 'csvs',
  },
  {
    name: 'words',
  },
  {
    name: 'pdfs',
  },
  {
    name: 'htmls',
  },
  {
    name: 'markdowns',
  }
]

export default defineComponent({
  name: 'ConfigPage',
  components: { },
  setup() {
    const lc = ref(useLcStore());
    const logs = ref('');
    const chatUrl = ref('');
    let serverStatus = ref(false)
    let intervalId: any;
    chatUrl.value = localStorage.getItem('chaturl') || '';
    lc.value.getEnv();
    lc.value.getTools();
    lc.value.getFiles();

    const step = ref(1);
    const uploadfile = ref({});
    const subfolder = ref(null);

    const submitForm = () => {
      Loading.show()
      lc.value.putEnv();
      Loading.hide()
      alert('Env Saved')
    };

    const upload = async (file: any, folder: string) => {
      let formdata = new FormData();
      formdata.append('file', file);
      const response = await fetch(`${localStorage.getItem('adminurl')}/upload/${folder}/${subfolder.value}`, {
        method: 'POST',
        body: formdata,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
      uploadfile.value = {};
      subfolder.value = null;
      lc.value.getFiles();
    }

    const openZapier = () => {
      window.open('https://nla.zapier.com/get-started/', '_blank')
    }

    // const getLogs = async () => {
    //   const response = await fetch(`${localStorage.getItem('adminurl')}/service-ops/`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Access-Control-Allow-Origin': '*'
    //     },
    //     body: '{"action": "logs"}'
    //   });
    //   let res = await response.json();
    //   let logsArr = res.result.stdout.split('\n');
    //   let lastTenLogs = logsArr.slice(-10).join('\n');
    //   logs.value = lastTenLogs;
      
    //   return lastTenLogs;
    // }

    // const ops = async (action: string) => {
    //   const response = await fetch(`${localStorage.getItem('adminurl')}/service-ops/`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Access-Control-Allow-Origin': '*'
    //     },
    //     body: `{"action": "${action}"}`
    //   });
    //   alert(action + 'Completed');
    //   return;
    // }

    const restart = async () => {
      const response = await fetch(`${localStorage.getItem('adminurl')}/restart_chat_server/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const data = await response.json();
      alert(data.status);
      serverStatus.value = false;
      startInterval();
      return;
    }

    let chatgptPlugins = ref('');

    let getGhatgptPlugins = async () => {
      const response = await fetch(`${localStorage.getItem('adminurl')}/chatgptplugins/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      chatgptPlugins.value = await response.json();

    }

    getGhatgptPlugins();

    const saveChatGPTPlugins = async (plugins: string) => {
      Loading.show()
      plugins = plugins.replace(/\n/g, '\\n');
      const response = await fetch(`${localStorage.getItem('adminurl')}/chatgptplugins/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: `{"plugins": "${plugins}"}`
      });
      Loading.hide()
      alert('ChatGPTPlugins Saved')
    }

    const saveTools = async () => {
      Loading.show()
      lc.value.updateTools();
      lc.value.putEnv();
      Loading.hide()
      serverStatus.value = false;
      startInterval();
      alert('Tool Saved')
    }

    const deleteFile = async (filetype: string, subfoler: string, filename: string) => {
      console.log(filetype, subfoler, filename);
      const response = await fetch(`${localStorage.getItem('adminurl')}/delete/${filetype}/${subfoler}/${filename}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      if (response.status === 200) {
        alert('Deleted');
      }
      lc.value.getFiles();
    }

    const availableTools = ref([])

    const getTools = async () => {
      const response = await fetch(`${localStorage.getItem('chaturl')}/tools/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      let res = await response.json();
      availableTools.value = res.tools;
    }

    getTools();

    // getLogs();

    const startInterval = () => {
      intervalId = setInterval(async () => {
        const response = await fetch(`${localStorage.getItem('adminurl')}/chat_server_status/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            url: chatUrl.value
          })
        });
        const data = await response.json();
        console.log(data.status);
        if (data.status === 'Ready') {
          serverStatus.value = true;
          getTools();
          stopInterval();
        }
      }, 5000);
    }

    const stopInterval = () => {
      let intervalId = window.setInterval(() => {return}, 9999);
      for (let i = intervalId; i > 0; i--) {
        window.clearInterval(i);
      }
    }

    const refreshStatus = () => {
      console.log('Refreshing: ' + chatUrl.value);
      clearInterval(intervalId);
      startInterval();
    }

    startInterval();

    return { 
      step,
      lc,
      submitForm,
      columns,
      rows,
      uploadfile,
      upload,
      subfolder,
      openZapier,
      logs,
      saveTools,
      restart,
      chatgptPlugins,
      saveChatGPTPlugins,
      serverStatus,
      availableTools,
      chatUrl,
      refreshStatus,
      deleteFile
    };
  }
});
</script>
