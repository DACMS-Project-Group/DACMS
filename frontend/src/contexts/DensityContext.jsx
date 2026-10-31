import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const DensityContext = createContext(null);

export const DensityProvider = ({ children }) => {
  // Persist density preference so it survives refreshes.
  const stored =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('dacms-density')
      : null;

  const [density, setDensity] = useState(stored || 'compact');

  useEffect(() => {
    try {
      localStorage.setItem('dacms-density', density);
    } catch {
      // localStorage may be blocked in some environments.
    }
  }, [density]);

  const toggle = useCallback(() => {
    setDensity((current) => (current === 'compact' ? 'comfortable' : 'compact'));
  }, []);

  return (
    <DensityContext.Provider value={{ density, toggle }}>
      {children}
    </DensityContext.Provider>
  );
};

export const useDensity = () => {
  const ctx = useContext(DensityContext);
  if (!ctx) {
    throw new Error('useDensity must be used within a DensityProvider');
  }
  return ctx;
};
