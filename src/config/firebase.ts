import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

// Configuración de Firebase (reemplaza con tus credenciales)
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "ecuapost-demo.firebaseapp.com",
  projectId: "ecuapost-demo",
  storageBucket: "ecuapost-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
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