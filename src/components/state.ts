'use client'
import { useAtom, atom, WritableAtom } from 'jotai';
import { useEffect, useCallback } from 'react';

function loadState<T>(key: string, defaultValue: T): T {
  // Check if running in a browser environment
  if (typeof window === 'undefined') {
    return defaultValue; // Return default value if not in browser
  }

  const storedValue = localStorage.getItem(key);
  console.log("loadState.storedValue", storedValue);

  if (storedValue !== null) {
    try {
      return JSON.parse(storedValue) as T;
    } catch (e) {
      console.error('Error reading from local storage', e);
    }
  }
  return defaultValue;
}

function saveState<T>(key: string, value: T): void {
  // Check if running in a browser environment
  if (typeof window === 'undefined') {
    return; // Do nothing if not in browser
  }

  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    console.log("saveState.serializedValue", serializedValue);
  } catch (e) {
    console.error('Error writing to local storage', e);
  }
}

export default function useLocalAtom<T>(key: string, defaultValue: T): [T, (newValue: T) => void] {
  const initialState = loadState<T>(key, defaultValue);
  const localAtom: WritableAtom<T, [T], void> = atom<T, [T], void>(initialState, (get, set, update: T) => set<T, [T], void>(localAtom, update));
  const [value, setValue] = useAtom<T>(localAtom);

  console.log("useLocalAtom.value",value)

  const setValueMemoized = useCallback((newValue: T) => {
    console.log("useLocalAtom.useCallback",newValue)
    // @ts-ignore
    setValue<T>(newValue);
  }, [setValue]);

  // Effect to update local storage whenever the atom's value changes
  useEffect(() => {
    console.log("useLocalAtom.useEffect",value)
    saveState<T>(key, value);
  }, [value]);

  return [value, setValueMemoized];
}