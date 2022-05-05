// This is a carbon copy of
// https://github.com/luiz-chagas/react-auth-service/blob/main/src/adapters/firebase-auth.ts
// Adapters have no idea this is a react application
// All they care about is conforming to the interface AuthService

import {
  User as FirebaseUser,
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  FacebookAuthProvider,
  EmailAuthProvider,
  AuthProvider as FirebaseAuthProvider,
  getRedirectResult,
} from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from './firebase-config'
import { User } from "../types/entities/User"
import { AuthErrors, AuthProviders, AuthService } from "../services/auth";


const initializeFirebase: AuthService["init"] = () => {
  const apps = getApps()
  if (apps.length === 0) {
    return initializeApp(firebaseConfig);
  }
  return apps[0]
};

// This function translates a FirebaseUser to the User type our
// application has defined, so no FirebaseUser types will
// ever leak into our application
const transformUser = (user: FirebaseUser): User => ({
  id: user.uid,
  email: user.email,
  name: user.displayName ?? "Visitor",
  photoURL: user.photoURL ?? undefined
});

const getUser: AuthService["getUser"] = async () => {
  const firebaseUser = getAuth().currentUser;

  if (!firebaseUser) return null;

  return transformUser(firebaseUser);
};

const onUserChanged: AuthService["onUserChanged"] = (callback) =>
  getAuth().onAuthStateChanged((maybeFirebaseUser) => {
    if (!maybeFirebaseUser) return callback(null);
    return callback(transformUser(maybeFirebaseUser));
  });

const providerList: Record<AuthProviders, FirebaseAuthProvider> = {
  Email: new EmailAuthProvider(),
  Facebook: new FacebookAuthProvider(),
  Google: new GoogleAuthProvider(),
};

const signIn: AuthService["signIn"] = async (provider) => {

  const selectedProvider = providerList[provider];

  if (!selectedProvider) throw Error(AuthErrors.InvalidProdiver);

  const auth = getAuth()

  return signInWithRedirect(auth, selectedProvider);


};

const signOut: AuthService["signOut"] = () => getAuth().signOut();

export const FirebaseAuthService: AuthService = {
  getUser,
  init: initializeFirebase,
  onUserChanged,
  signIn,
  signOut,
};

