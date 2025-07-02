import { useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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

    // Verificar si hay un resultado de redirect pendiente
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('✅ Usuario logueado con redirect:', result.user);
        }
      } catch (error: any) {
        console.error('❌ Error en redirect result:', error);
        setError(error.message);
      }
    };

    checkRedirectResult();

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Intentar primero con popup
      try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('✅ Usuario logueado con Google (popup):', result.user);
        return result.user;
      } catch (popupError: any) {
        // Si el popup falla, usar redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          console.log('🔄 Popup bloqueado, usando redirect...');
          await signInWithRedirect(auth, googleProvider);
          // El resultado se manejará en getRedirectResult
          return null;
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión con Google:', error);
      
      // Mensajes de error más amigables
      let errorMessage = 'Error al iniciar sesión';
      switch (error.code) {
        case 'auth/popup-blocked':
          errorMessage = 'Las ventanas emergentes están bloqueadas. Permitiendo popups y reintentando...';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = 'Ventana de login cerrada. Inténtalo de nuevo.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión. Verifica tu internet.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Espera un momento.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Intentar primero con popup
      try {
        const result = await signInWithPopup(auth, facebookProvider);
        console.log('✅ Usuario logueado con Facebook (popup):', result.user);
        return result.user;
      } catch (popupError: any) {
        // Si el popup falla, usar redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          console.log('🔄 Popup bloqueado, usando redirect...');
          await signInWithRedirect(auth, facebookProvider);
          return null;
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión con Facebook:', error);
      
      let errorMessage = 'Error al iniciar sesión con Facebook';
      switch (error.code) {
        case 'auth/popup-blocked':
          errorMessage = 'Las ventanas emergentes están bloqueadas. Permitiendo popups y reintentando...';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = 'Ventana de login cerrada. Inténtalo de nuevo.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'Ya existe una cuenta con este email usando otro método de login.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
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
      
      let errorMessage = 'Error al enviar código SMS';
      switch (error.code) {
        case 'auth/invalid-phone-number':
          errorMessage = 'Número de teléfono inválido. Verifica el formato.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Espera antes de solicitar otro código.';
          break;
        case 'auth/captcha-check-failed':
          errorMessage = 'Verificación reCAPTCHA fallida. Inténtalo de nuevo.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
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