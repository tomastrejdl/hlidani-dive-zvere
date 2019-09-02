import firebase from 'firebase/app'
import 'firebase/auth'

// The configuration below is not sensitive data. You can serenely add your config here
const config = {
  apiKey: 'AIzaSyD9CSlILhlDWvOWEalX5rBIrhdpPaQQRB4',
  authDomain: 'hlidani-dive-zvere.firebaseapp.com',
  databaseURL: 'https://hlidani-dive-zvere.firebaseio.com',
  projectId: 'hlidani-dive-zvere',
  storageBucket: '',
  messagingSenderId: '1022167472847',
  appId: '1:1022167472847:web:7dfd1a9433e035ac',
}

firebase.initializeApp(config)
