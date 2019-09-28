import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/messaging'

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

// eslint-disable-next-line import/prefer-default-export
export const firebaseApp = firebase.initializeApp(config)
const messaging = firebase.messaging()

askForPermissioToReceiveNotifications()

async function askForPermissioToReceiveNotifications() {
  try {
    messaging.usePublicVapidKey(
      'BPM-jydpjCMoSFi9Am_Q4hxun7Bfma9UrlAqawnQTcqHiohWpiAXeEPlA8MNQvsvEemTgug9Mk1QsbneFqjIXyw',
    )
    await messaging.requestPermission()
    const token = await messaging.getToken()
    console.log('token do usuário:', token)

    return token
  } catch (error) {
    console.error(error)
  }
}

messaging.onMessage(payload => {
  console.log('Message received. ', payload)
})
