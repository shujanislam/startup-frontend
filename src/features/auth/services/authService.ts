import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { auth, googleProvider } from '../../../lib/firebase.ts'

const loginWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

const loginWithEmailPassword = async (
  email: string,
  password: string,
): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

const signupWithEmailPassword = async (
  email: string,
  password: string,
): Promise<User> => {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  return result.user
}

const logoutUser = async (): Promise<void> => {
  await signOut(auth)
}

const observeAuthState = (
  callback: (user: User | null) => void,
): (() => void) => {
  return onAuthStateChanged(auth, callback)
}

export {
  loginWithGoogle,
  loginWithEmailPassword,
  logoutUser,
  observeAuthState,
  signupWithEmailPassword,
}