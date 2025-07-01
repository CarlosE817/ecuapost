import { useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../config/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          phoneNumber: firebaseUser.phoneNumber
        };
        setUser(authUser);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('ecuapost-user', JSON.stringify(authUser));
      } else {
        setUser(null);
        localStorage.removeItem('ecuapost-user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Usuario logueado con Google:', result.user);
      return result.user;
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión con Google:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithPopup(auth, facebookProvider);
      console.log('✅ Usuario logueado con Facebook:', result.user);
      return result.user;
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión con Facebook:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
    try {
      setError(null);
      setLoading(true);
      console.log('📱 Enviando código SMS a:', phoneNumber);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      console.log('✅ Código SMS enviado');
      return confirmationResult;
    } catch (error: any) {
      console.error('❌ Error al enviar SMS:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      localStorage.removeItem('ecuapost-user');
      console.log('✅ Sesión cerrada');
    } catch (error: any) {
      console.error('❌ Error al cerrar sesión:', error);
      setError(error.message);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithFacebook,
    signInWithPhone,
    signOut
  };
};