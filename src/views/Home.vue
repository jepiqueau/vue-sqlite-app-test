<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>
      <div id="container">
        <div id="text-app">
          <strong>Ready to create an app?</strong>
          <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
        </div>
        <div id="users">
          <ul id="user-with-index">
            <li v-for="(user, index) in users" :key="user.id">
              {{ index }} - {{ user.name }}
            </li>
          </ul>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { defineComponent, onMounted, getCurrentInstance, ref } from 'vue';
import { importTwoUsers } from '@/utils/utils-db-no-encryption'; 
import { SQLiteDBConnection} from 'vue-sqlite-hook/dist';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
  },
  setup() {
    console.log('in Home setup');
    const initUser: any[] = [];
    const users = ref(initUser);

    const app = getCurrentInstance()
    const db: SQLiteDBConnection = app?.appContext.config.globalProperties.$db;
    let errMess = "";
    const setUsers = async (): Promise<boolean>  => {
        try {
            let res = await db.execute(importTwoUsers);
            if (res.changes && res.changes.changes !== 2) {
                errMess = `Execute importTwoUsers changes != 2`;
                return false;
            }
            return true;
        } catch (err) {
            errMess = `${err}`;
            return false;
        }
    };
    const getUsers = async (): Promise<any[]> => {
        let users: any[] = [];
        try {
            const res = await db.query("SELECT * FROM users");
            if (res.values) {
                users = res.values;
                console.log(`${JSON.stringify(users)}`)
                return users;
            } else {
                return [];
            }
        } catch (err) {
            errMess = `${err}`;
            return [];
        }
    } 

    onMounted(async () => {
      console.log(' in Home on Mounted')
        console.log('$$$ Start setUsers on Mounted $$$')
        const retSetUsers: boolean = await setUsers();
        console.log(`retSetUsers ${retSetUsers}`);


        if(!retSetUsers) {
            console.log(`setUsers failed: ${errMess}`);
        } else {
            const userList = await getUsers();
            if(userList.length === 2) { 
                for( const user of userList) {
                    console.log(`name : ${user.name}`)
                }
                console.log("setUsers was successful");
                users.value = userList
            } else {
                console.log("setUsers failed");
            }
        }
    });
    return { errMess, users };
  }

});
</script>

<style scoped>
#container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
#text-app {
  text-align: center;
  
  position: relative;
  left: 0;
  right: 0;
  top: 10%;
  bottom: 30%;
}
#text-app strong {
  font-size: 20px;
  line-height: 26px;
}
#text-app p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#text-app a {
  text-decoration: none;
}
#users {
  position: relative;
  left: 5%;
  top: 10%;
}
</style>
