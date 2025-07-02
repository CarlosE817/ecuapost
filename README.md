# EcuaPost 🇪🇨

**EcuaPost** es una red social minimalista tipo Twitter con autenticación completa, desarrollada con:

- ⚛️ React + TypeScript (con Context API y Hooks para gestión de estado)
- ⚡ Vite
- 🎨 TailwindCSS
- 🔥 Firebase (Authentication y Storage)
- 💾 LocalStorage para persistencia de tweets y bookmarks (las imágenes se guardan en Firebase Storage)

---

## ✨ Funciones

### 🔐 Autenticación
- **Google Sign-In** ✅ - Inicio rápido con cuenta Google
- **Facebook Login** ✅ - Autenticación con Facebook
- **Teléfono SMS** ✅ - Verificación por código SMS
- Gestión completa de sesiones
- Perfiles automáticos basados en datos del proveedor

### 📱 Red Social
- Crear y visualizar publicaciones tipo tweet
- **Subida de imágenes a Firebase Storage** ✅
- Likes, retweets y bookmarks
- Editar y eliminar tus propios tweets
- Sistema de notificaciones en tiempo real (básico, vía toasts)
- Búsqueda avanzada con filtros
- Navegación completa entre secciones

### 💾 Persistencia
- Datos de tweets (texto, metadatos) y bookmarks guardados en localStorage
- URLs de imágenes (hosteadas en Firebase Storage) se guardan con los tweets
- No se pierden tweets ni bookmarks al recargar
- Configuración de usuario guardada (tema, etc.)

### 🎨 Interfaz
- Diseño responsivo y moderno
- Animaciones suaves y micro-interacciones
- Tema consistente y profesional
- Notificaciones toast elegantes

---

## 🚀 Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Authentication y configura los proveedores:
   - **Google**: Habilitar en Authentication > Sign-in method
   - **Facebook**: Configurar App ID y App Secret
   - **Teléfono**: Habilitar SMS authentication
4. **Habilita Firebase Storage**:
   - Ve a la sección "Storage" en Firebase Console y haz clic en "Comenzar".
   - **Importante: Configura las Reglas de Seguridad de Storage**. Para empezar, puedes usar reglas permisivas para desarrollo, pero asegúrate de proteger tus datos en producción. Un ejemplo para desarrollo (permite leer a todos, escribir solo a usuarios autenticados en sus propios directorios de imágenes):
     ```
     rules_version = '2';
     service firebase.storage {
       match /b/{bucket}/o {
         match /{allPaths=**} {
           allow read;
         }
         match /tweet_images/{userId}/{allPaths=**} {
           allow write: if request.auth != null && request.auth.uid == userId;
         }
       }
     }
     ```
5. Copia la configuración de Firebase y actualiza `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

### 3. Configurar proveedores

#### Google Sign-In
- Ya configurado automáticamente con Firebase

#### Facebook Login
1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Crea una nueva app
3. Configura Facebook Login
4. Añade tu dominio a los dominios válidos
5. Copia el App ID a Firebase Console

#### Teléfono SMS
- Configura reCAPTCHA en Firebase Console
- Añade números de prueba si es necesario

### 4. Ejecutar la aplicación
```bash
npm run dev
```

---

## 🔧 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── AuthModal.tsx   # Modal de autenticación
│   ├── UserMenu.tsx    # Menú de usuario
│   ├── Sidebar.tsx     # Barra lateral
│   └── ...
├── config/
│   └── firebase.ts     # Configuración Firebase (incluye Storage)
├── contexts/
│   └── AppContext.tsx  # Contexto principal de la aplicación
│   └── ThemeContext.tsx# Contexto para el tema (claro/oscuro)
├── hooks/
│   ├── useAuth.ts      # Hook de autenticación
│   ├── useTweets.ts    # Hook para gestión de tweets (CRUD, Storage)
│   ├── useBookmarks.ts # Hook para gestión de bookmarks
├── data/
│   └── mockData.ts     # Datos de ejemplo
└── types/
    └── index.ts        # Tipos TypeScript
```

---

## 🔧 Pruebas

El proyecto está configurado con Vitest para pruebas unitarias y de componentes. Para ejecutar las pruebas:

```bash
npm test
```
o
```bash
npx vitest
```
(Nota: Las pruebas pueden requerir configuración adicional o ajustes para ejecutarse correctamente en todos los entornos.)


---

## 🔐 Seguridad

- Autenticación segura con Firebase
- Tokens JWT automáticos
- Validación de sesiones
- Protección contra ataques comunes
- reCAPTCHA para verificación SMS

---

## 🌟 Características Avanzadas

### Sistema de Autenticación
- **Multi-proveedor**: Google, Facebook, SMS
- **Gestión de errores**: Mensajes claros y útiles
- **UX optimizada**: Flujos intuitivos y rápidos
- **Persistencia**: Sesiones que se mantienen

### Interfaz de Usuario
- **Responsive**: Funciona en móvil y desktop
- **Accesible**: Cumple estándares de accesibilidad
- **Performante**: Carga rápida y fluida
- **Moderna**: Diseño actual y atractivo

---

## 📝 Próximas Funciones

- [ ] Chat en tiempo real
- [ ] Notificaciones push
- [x] Subida de imágenes (Implementado con Firebase Storage, persistencia en localStorage de URLs)
- [ ] Modo oscuro (Base implementada con ThemeContext, necesita UI completa)
- [ ] Historias/Stories
- [ ] Verificación de cuentas

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu función (`git checkout -b feature/nueva-funcion`)
3. Commit tus cambios (`git commit -m 'Añadir nueva función'`)
4. Push a la rama (`git push origin feature/nueva-funcion`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

## 🆘 Soporte

¿Problemas con la configuración? 

1. Verifica que Firebase esté configurado correctamente
2. Revisa que los proveedores estén habilitados
3. Comprueba la consola del navegador para errores
4. Asegúrate de que las URLs estén en la whitelist de Firebase

---

**¡Disfruta construyendo con EcuaPost!** 🚀