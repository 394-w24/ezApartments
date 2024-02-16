// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { useState, useEffect, useCallback } from "react";
import { getDatabase, ref, onValue, update, connectDatabaseEmulator , get} from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithCredential,
  connectAuthEmulator
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCw03fsZfEd1JyURQZrDioSokaZKYVPUJg",
  authDomain: "ezapartments-a35e6.firebaseapp.com",
  databaseURL: "https://ezapartments-a35e6-default-rtdb.firebaseio.com",
  projectId: "ezapartments-a35e6",
  storageBucket: "ezapartments-a35e6.appspot.com",
  messagingSenderId: "827964291256",
  appId: "1:827964291256:web:e630dc3c79bc640ffc1c4d",
  measurementId: "G-NGG3RRD1C1"
};



const app = initializeApp(firebaseConfig)
const database = getDatabase(app);

export const useDbData = (path) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  useEffect(() => (
    onValue(ref(database, path), (snapshot) => {
     setData( snapshot.val() );
    }, (error) => {
      setError(error);
    })
  ), [ path ]);

  return [ data, error ];
};

export const getDbData = async (path) => {
  const snapshot = await get(ref(database, path));
  return snapshot.val();
}

export const writeToDb = async (path, value) => {
  var success = false;
  await update(ref(database, path), value)
      .then(() => {console.log("Successfully written to database.", value); success = true})
      .catch((error) => console.log(error));
  return success
}

export const useDbUpdate = (path) => {
  const [result, setResult] = useState();
  const updateData = useCallback((value) => {
    update(ref(database, path), value)
    .then(() => setResult(makeResult()))
    .catch((error) => setResult(makeResult(error)))
  }, [database, path]);

  return [updateData, result];
};

const makeResult = (error) => {
  const timestamp = Date.now();
  const message = error?.message || `Updated: ${new Date(timestamp).toLocaleString()}`;
  return { timestamp, error, message };
};
