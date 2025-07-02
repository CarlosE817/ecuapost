// src/setupTests.ts
import '@testing-library/jest-dom';

// You can add other global setup code here if needed.

// Mock localStorage for tests
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => Object.keys(store)[index] || null,
    length: Object.keys(store).length,
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Temporarily comment out Firebase mocks to isolate the issue
/*
vi.mock('firebase/storage', async (importOriginal) => {
  const actual = await importOriginal() as typeof import('firebase/storage');
  return {
    ...actual,
    ref: vi.fn().mockReturnValue({}),
    uploadBytesResumable: vi.fn().mockReturnValue({
      on: vi.fn((event, progress, error, complete) => {
        if (event === 'state_changed' && typeof complete === 'function') {
          complete();
        }
        return vi.fn();
      }),
      snapshot: { ref: 'mockRef' }
    }),
    getDownloadURL: vi.fn().mockResolvedValue('https://mockstorage.com/mockimage.jpg'),
  };
});

vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal() as typeof import('firebase/auth');
  return {
    ...actual,
    getAuth: vi.fn(() => ({
      onAuthStateChanged: vi.fn(() => vi.fn()),
      signOut: vi.fn().mockResolvedValue(undefined),
    })),
    GoogleAuthProvider: vi.fn(),
    FacebookAuthProvider: vi.fn(),
    createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: 'test-uid', email: 'test@example.com', updateProfile: vi.fn() } }),
    signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: 'test-uid', email: 'test@example.com' } }),
    updateProfile: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock('./config/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn(() => () => {}),
    currentUser: null,
  },
  storage: {},
  googleProvider: {},
  facebookProvider: {},
  default: {}
}));
*/
