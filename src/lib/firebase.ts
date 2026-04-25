import { getAnalytics, isSupported } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBEJE-TQ6aAv4zeqcZ3m331NQjEWAzuviY',
  authDomain: 'startup-2c9aa.firebaseapp.com',
  projectId: 'startup-2c9aa',
  storageBucket: 'startup-2c9aa.firebasestorage.app',
  messagingSenderId: '510296065947',
  appId: '1:510296065947:web:333a5eb8c35720acba433e',
  measurementId: 'G-84LMXNR4QL',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

if (typeof window !== 'undefined') {
  void isSupported()
    .then((supported) => {
      if (supported) {
        getAnalytics(app)
      }
    })
    .catch(() => {
      // Analytics is optional and should not block authentication.
    })
}

export { app, auth, googleProvider }