import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

// Sign-Up Function
export async function signUp(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save additional user info in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      createdAt: new Date(),
    });

    console.log('User signed up and stored in Firestore:', user);
  } catch (error) {
    console.error('Error signing up:', error);
  }
}

// Sign-In Function
export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed in:', user);
  } catch (error) {
    console.error('Error signing in:', error);
  }
}