import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyDp_DFAqT9lP0wMO7FxYf3qE1Rg832i5e4',
  authDomain: 'realtime-database-5fbd9.firebaseapp.com',
  databaseURL: 'https://realtime-database-5fbd9-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'realtime-database-5fbd9',
  storageBucket: 'realtime-database-5fbd9.appspot.com',
  messagingSenderId: '882456508633',
  appId: '1:882456508633:web:8dbf5a779ab41ad66366c8'
}

const app = initializeApp(firebaseConfig, 'client')
const auth = getAuth(app)
const database = getDatabase(app)

export { auth, database }
