import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* SQLite imports */
import { defineCustomElements as jeepSqlite, applyPolyfills } from "jeep-sqlite/loader";
import { useSQLite, SQLiteDBConnection} from 'vue-sqlite-hook/dist';
import { Capacitor } from '@capacitor/core';
import { createTablesNoEncryption, dropTablesTablesNoEncryption} from '@/utils/utils-db-no-encryption'; 
import { schemaToImport179 } from '@/utils/utils-db-importFromJson';

applyPolyfills().then(() => {
    jeepSqlite(window);
});
window.addEventListener('DOMContentLoaded', async () => {
  const platform = Capacitor.getPlatform();

  const app = createApp(App)
    .use(IonicVue)
    .use(router);
  
  // Initialize the sqlite hook
  app.config.globalProperties.$sqlite = useSQLite();
  const sqlite = app.config.globalProperties.$sqlite;
  
  try {  
    if(platform === "web") {
      const jeepSqlite = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepSqlite);
      await customElements.whenDefined('jeep-sqlite');
      await sqlite.initWebStore();
    }

    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection("test_vue")).result;
    let db: SQLiteDBConnection
    if (ret.result && isConn) {
      db = await sqlite.retrieveConnection("test_vue");
  
    } else {
      db = await sqlite.createConnection("test_vue");
    }
    console.log("> createConnection " +
                                " 'test_vue' successful\n");
    app.config.globalProperties.$db = db;

    // open NoEncryption database
    await db.open();
    // Drop tables if exists
    let res = await db.execute(dropTablesTablesNoEncryption);
    if(res.changes && res.changes.changes !== 0 &&
              res.changes.changes !== 1){
      console.log(`Execute dropTablesTablesNoEncryption changes < 0`);
      return;
    } 
    // Create tables
    res = await db.execute(createTablesNoEncryption);
    console.log(`Create Table ${JSON.stringify(res)}`);

    if(platform === "web") {
      await sqlite.saveToStore("test_vue");
    }
    // test issue#179
    const result = await sqlite.isJsonValid(JSON.stringify(schemaToImport179));
    if(!result.result) {
      console.log(`isJsonValid: "schemaToImport179" is not valid`);
      return;
    }
    console.log(`isJsonValid: "schemaToImport179" is valid`);

    // full import
    res = await sqlite.importFromJson(JSON.stringify(schemaToImport179));    
    if(res.changes && res.changes.changes === -1 ) {
      console.log("ImportFromJson 'full' failed");
      return;
    }
  } catch (err) {
    console.log(`App Error: ${err}`);
  }
  router.isReady().then(() => {
    app.mount('#app');
  });
});
