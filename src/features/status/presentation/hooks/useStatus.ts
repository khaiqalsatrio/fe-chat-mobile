import { useStatusContext } from '../context/StatusContext';

/**
 * Hook ini sekarang merupakan wrapper untuk StatusContext.
 * Gunakan hook ini di komponen manapun untuk mendapatkan data status yang tersinkronisasi secara global.
 */
export const useStatus = () => {
  return useStatusContext();
};
