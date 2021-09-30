<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent, getCurrentInstance, onUnmounted} from 'vue';
import { SQLiteHook } from 'vue-sqlite-hook/dist';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
  setup() {
    const app = getCurrentInstance()
    const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;

    onUnmounted(async () => {
      console.log(' in App on UnMounted');
      try {
        await sqlite.closeConnection("test_vue");
      } catch (err) {
        console.log(`${err.message}`);
      }
    });
    return;
  }
});
</script>
