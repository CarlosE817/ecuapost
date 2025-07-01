import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

// Configuración de Firebase con tus credenciales reales
const firebaseConfig = {
  apiKey: "AIzaSyDfwIjp_wyuD3hToQ3Dy2FO9AGsL_bdy8g",
  authDomain: "ecuapost-58055.firebaseapp.com",
  projectId: "ecuapost-58055",
  storageBucket: "ecuapost-58055.appspot.com",
  messagingSenderId: "683550310254",
  appId: "1:683550310254:web:1b144218f78acc9b2e0b7f",
  measurementId: "G-FJ1Y7LN299"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth
export const auth = getAuth(app);

// Proveedores de autenticación
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Configurar proveedores
googleProvider.addScope('profile');
googleProvider.addScope('email');

facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

export default app;