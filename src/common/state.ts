
import { atom, WritableAtom } from 'jotai';

// Utility to load and save to local storage
const loadFromStorage = <T>(key: string, initialValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : initialValue;
};

const saveToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const createLocalStorageAtom = <T>(key: string, defaultValue: T): WritableAtom<T, T, T> => {
  const baseAtom = atom(loadFromStorage(key, defaultValue));

  const derivedAtom = atom(
    get => get(baseAtom),
    (get, set, update: T | ((prev: T) => T)) => {
      const newValue = typeof update === 'function' ? update(get(baseAtom)) : update;
      set(baseAtom, newValue);
      saveToStorage(key, newValue);
    }
  );

  return derivedAtom;
};

// Create atoms for specific properties
// const usernameAtom = createLocalStorageAtom('username', 'defaultUsername');
// const ageAtom = createLocalStorageAtom('age', 30);

// function MyComponent() {
//     const [username, setUsername] = useAtom(usernameAtom);