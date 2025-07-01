import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Chrome, Facebook, ArrowLeft, Shield } from 'lucide-react';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'phone' | 'verify'>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signInWithGoogle, signInWithFacebook, signInWithPhone } = useAuth();

  useEffect(() => {
    if (isOpen && authMode === 'phone' && !recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });
      setRecaptchaVerifier(verifier);
    }

    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, [isOpen, authMode]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
      onSuccess();
      onClose();
    } catch (error: any) {
      setError('Error al iniciar sesión con Google. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithFacebook();
      onSuccess();
      onClose();
    } catch (error: any) {
      setError('Error al iniciar sesión con Facebook. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    if (!recaptchaVerifier) {
      setError('reCAPTCHA no está listo. Inténtalo de nuevo.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+593${phoneNumber}`;
      const confirmation = await signInWithPhone(formattedPhone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setAuthMode('verify');
    } catch (error: any) {
      setError('Error al enviar código de verificación. Verifica el número.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmationResult) return;

    try {
      setIsLoading(true);
      setError(null);
      await confirmationResult.confirm(verificationCode);
      onSuccess();
      onClose();
    } catch (error: any) {
      setError('Código de verificación incorrecto. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setAuthMode('login');
    setPhoneNumber('');
    setVerificationCode('');
    setConfirmationResult(null);
    setError(null);
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      setRecaptchaVerifier(null);
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              {(authMode === 'phone' || authMode === 'verify') && (
                <button
                  onClick={() => setAuthMode('login')}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <h2 className="text-2xl font-bold text-gray-900">
                {authMode === 'login' && 'Iniciar Sesión'}
                {authMode === 'register' && 'Crear Cuenta'}
                {authMode === 'phone' && 'Teléfono'}
                {authMode === 'verify' && 'Verificar Código'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {authMode === 'login' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-center mb-6">
                Únete a la conversación en EcuaPost
              </p>

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Chrome className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Continuar con Google</span>
              </button>

              <button
                onClick={handleFacebookSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Facebook className="h-5 w-5" />
                <span className="font-medium">Continuar con Facebook</span>
              </button>

              <button
                onClick={() => setAuthMode('phone')}
                className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Phone className="h-5 w-5 text-green-500" />
                <span className="font-medium">Continuar con Teléfono</span>
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm">
                  ¿No tienes cuenta?{' '}
                  <button
                    onClick={() => setAuthMode('register')}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    Regístrate
                  </button>
                </p>
              </div>
            </div>
          )}

          {authMode === 'register' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-center mb-6">
                Crea tu cuenta en EcuaPost
              </p>

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Chrome className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Registrarse con Google</span>
              </button>

              <button
                onClick={handleFacebookSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Facebook className="h-5 w-5" />
                <span className="font-medium">Registrarse con Facebook</span>
              </button>

              <button
                onClick={() => setAuthMode('phone')}
                className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Phone className="h-5 w-5 text-green-500" />
                <span className="font-medium">Registrarse con Teléfono</span>
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm">
                  ¿Ya tienes cuenta?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    Inicia sesión
                  </button>
                </p>
              </div>
            </div>
          )}

          {authMode === 'phone' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-center mb-6">
                Ingresa tu número de teléfono
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de teléfono
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +593
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="987654321"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Formato: 987654321 (sin el 0 inicial)
                </p>
              </div>

              <div id="recaptcha-container"></div>

              <button
                onClick={handlePhoneSignIn}
                disabled={isLoading || !phoneNumber.trim()}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Enviando...' : 'Enviar código de verificación'}
              </button>

              <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <Shield className="h-4 w-4" />
                <span>
                  Tu número será verificado y protegido. No lo compartiremos.
                </span>
              </div>
            </div>
          )}

          {authMode === 'verify' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-center mb-6">
                Ingresa el código de 6 dígitos enviado a tu teléfono
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de verificación
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest"
                />
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verificando...' : 'Verificar código'}
              </button>

              <button
                onClick={() => setAuthMode('phone')}
                className="w-full text-blue-500 py-2 text-sm hover:underline"
              >
                ¿No recibiste el código? Enviar de nuevo
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Al continuar, aceptas nuestros{' '}
              <a href="#" className="text-blue-500 hover:underline">
                Términos de Servicio
              </a>{' '}
              y{' '}
              <a href="#" className="text-blue-500 hover:underline">
                Política de Privacidad
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;