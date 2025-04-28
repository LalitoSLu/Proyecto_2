// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const crearDocumentoDePrueba = async () => {
    try {
      await setDoc(doc(db, "usuarios", "usuario1"), {
        nombre: "Lalo",
        edad: 25,
        favorito: true
      });
      console.log("Documento creado");
    } catch (error) {
      console.error("Error al crear documento:", error);
    }
  };
const firebaseConfig = {
  apiKey: "AIzaSyCDJrkCRcIeLv2m1hPxvUV41BEnwS6TtX8",
  authDomain: "mi-primera-app-5324c.firebaseapp.com",
  projectId: "mi-primera-app-5324c",
  storageBucket: "mi-primera-app-5324c.firebasestorage.app",
  messagingSenderId: "706393450360",
  appId: "1:706393450360:web:22962176f823932cf04a8d",
  measurementId: "G-TB82NH4BF3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

