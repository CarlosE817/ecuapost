import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Chrome, ArrowLeft, Shield, AlertCircle, Smartphone, Monitor, Eye, EyeOff } from 'lucide-react';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'phone' | 'verify' | 'email-login' | 'email-register'>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signInWithGoogle, signInWithPhone, signUpWithEmail, signInWithEmail, error } = useAuth();

  // Detectar tipo de dispositivo
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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
      console.log(`🚀 Iniciando Google Sign-In`);
      
      const result = await signInWithGoogle();
      
      if (result) {
        console.log('✅ Login exitoso con popup');
        onSuccess();
        onClose();
      } else {
        console.log('🔄 Redirect iniciado, esperando recarga...');
      }
    } catch (error: any) {
      console.error('❌ Error en Google Sign-In:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    if (!recaptchaVerifier) {
      return;
    }

    try {
      setIsLoading(true);
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+593${phoneNumber}`;
      const confirmation = await signInWithPhone(formattedPhone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setAuthMode('verify');
    } catch (error: any) {
      // Error is handled by useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmationResult) return;

    try {
      setIsLoading(true);
      await confirmationResult.confirm(verificationCode);
      onSuccess();
      onClose();
    } catch (error: any) {
      // Error is handled by useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) return;

    try {
      setIsLoading(true);
      await signUpWithEmail(email, password, displayName);
      onSuccess();
      onClose();
    } catch (error: any) {
      // Error is handled by useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsLoading(true);
      await signInWithEmail(email, password);
      onSuccess();
      onClose();
    } catch (error: any) {
      // Error is handled by useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setAuthMode('login');
    setPhoneNumber('');
    setVerificationCode('');
    setEmail('');
    setPassword('');
    setDisplayName('');
    setShowPassword(false);
    setConfirmationResult(null);
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              {(authMode !== 'login' && authMode !== 'register') && (
                <button
                  onClick={() => setAuthMode('login')}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              )}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {authMode === 'login' && 'Iniciar Sesión'}
                {authMode === 'register' && 'Crear Cuenta'}
                {authMode === 'phone' && 'Teléfono'}
                {authMode === 'verify' && 'Verificar Código'}
                {authMode === 'email-login' && 'Iniciar con Email'}
                {authMode === 'email-register' && 'Registrarse con Email'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Información del método de autenticación */}
          {(authMode === 'login' || authMode === 'register') && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-2">
                {isMobile ? <Smartphone className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" /> : <Monitor className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />}
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    {isMobile ? 'Dispositivo móvil detectado' : 'Dispositivo desktop detectado'}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">
                    {isMobile 
                      ? 'Se usará redirección para mejor compatibilidad'
                      : 'Se intentará ventana emergente, con redirección como respaldo'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">Error de autenticación</p>
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {authMode === 'login' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Únete a la conversación en EcuaPost
              </p>

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Chrome className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {isLoading ? 'Conectando...' : 'Continuar con Google'}
                </span>
              </button>

              <button
                onClick={() => setAuthMode('email-login')}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-900 dark:text-white">Continuar con Email</span>
              </button>

              <button
                onClick={() => setAuthMode('phone')}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <Phone className="h-5 w-5 text-green-500" />
                <span className="font-medium text-gray-900 dark:text-white">Continuar con Teléfono</span>
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
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
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Crea tu cuenta en EcuaPost
              </p>

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Chrome className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {isLoading ? 'Conectando...' : 'Registrarse con Google'}
                </span>
              </button>

              <button
                onClick={() => setAuthMode('email-register')}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-900 dark:text-white">Registrarse con Email</span>
              </button>

              <button
                onClick={() => setAuthMode('phone')}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <Phone className="h-5 w-5 text-green-500" />
                <span className="font-medium text-gray-900 dark:text-white">Registrarse con Teléfono</span>
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
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

          {authMode === 'email-login' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Inicia sesión con tu email
              </p>

              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tu contraseña"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
              </form>

              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  ¿No tienes cuenta?{' '}
                  <button
                    onClick={() => setAuthMode('email-register')}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    Regístrate
                  </button>
                </p>
              </div>
            </div>
          )}

          {authMode === 'email-register' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Crea tu cuenta con email
              </p>

              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email || !password || !displayName}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </form>

              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  ¿Ya tienes cuenta?{' '}
                  <button
                    onClick={() => setAuthMode('email-login')}
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
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Ingresa tu número de teléfono
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número de teléfono
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    +593
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="987654321"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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

              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <Shield className="h-4 w-4" />
                <span>
                  Tu número será verificado y protegido. No lo compartiremos.
                </span>
              </div>
            </div>
          )}

          {authMode === 'verify' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Ingresa el código de 6 dígitos enviado a tu teléfono
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Código de verificación
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
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