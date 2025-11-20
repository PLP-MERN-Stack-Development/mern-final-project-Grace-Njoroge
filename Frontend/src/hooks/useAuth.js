import { useContext } from 'react';
import { useAuth as useAuthFromContext } from '../context/AuthContext';

// simple wrapper so other components can `import { useAuth } from '../hooks/useAuth'`
export const useAuth = () => {
  return useAuthFromContext();
};

export default useAuth;
