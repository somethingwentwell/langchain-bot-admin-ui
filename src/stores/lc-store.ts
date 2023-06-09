import { defineStore } from 'pinia';

type Env = {
  MicrosoftAppType: string,
  MicrosoftAppId: string,
  MicrosoftAppPassword: string,
  MicrosoftAppTenantId: string,
  OPENAI_API_TYPE: string,
  OPENAI_API_VERSION: string,
  OPENAI_API_BASE: string,
  OPENAI_API_KEY: string,
  COMPLETION_DEPLOYMENT_NAME: string
  COMPLETION_MODEL_NAME: string,
  EMBEDDING_DEPLOYMENT_NAME: string,
  CHAT_DEPLOYMENT_NAME: string,
  CHAT_MODEL_NAME: string,
  CHAT_SYSTEM_PROMPT: string,
  TOOLS_CATEGORY: string
  ZAPIER_NLA_API_KEY: string,
  LC_API_URL: string
}

type Doc = {
  folder: string,
  subfolder: string,
  files: string[]
}

type Docs = {
  files: Doc[]
}

export const useLcStore = defineStore('lcadmin', {
  state: () => ({
    envVar: {} as Env,
    toolsVar: {} as Record<string, any>,
    docsVar: {} as Docs
  }),
  getters: {
    getFolderData: (state) => (folder: string) => {
      return state.docsVar.files.filter((doc) => doc.folder === folder);
    }

  },
  actions: {
    async getEnv () {
      try {
        const response = await fetch(`${localStorage.getItem('adminurl')}/env`, {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        });
        const data = await response.json();
        this.envVar = data;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async putEnv () {
      try {
        const response = await fetch(`${localStorage.getItem('adminurl')}/env`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(this.envVar)
        });
        const data = await response.json();
        console.log('Success:', data);
        return data;
      } catch (error) {
        console.error('Error:', error);
        return error;
      }
    },
    async getTools () {
      try {
        const response1 = await fetch(`${localStorage.getItem('adminurl')}/toggle_tools`, {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        });
        const toggle_tools = await response1.json();
        const response2 = await fetch(`${localStorage.getItem('adminurl')}/all_tools`, {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        });
        const all_tools = await response2.json();
        for (const tool of all_tools) {
          this.toolsVar[tool] = false;
          if (toggle_tools.tools.includes(tool)) {
            this.toolsVar[tool] = true;
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async updateTools () {
      await fetch(`${localStorage.getItem('adminurl')}/disable_all_tools`, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
      const tools = Object.entries(this.toolsVar);
      for (const [toolName, toolValue] of tools) {
        if (toolValue) {
          try {
            const response = await fetch(`${localStorage.getItem('adminurl')}/toggle_tools`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({ name: toolName })
            });
            const data = await response.json();
            console.log('Success:', data);
          } catch (error) {
            console.error('Error:', error);
          }
        }
      }
    },
    async getFiles () {
      try {
        const response = await fetch(`${localStorage.getItem('adminurl')}/readall`, {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        });
        const data = await response.json();
        this.docsVar = data;
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    }

  },
});
