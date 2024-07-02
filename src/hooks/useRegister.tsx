import { useState } from 'react';
import { useAuthDispatch, signupAction, updateAction, loginAction } from '../Contexts/AuthContext/Context';
import { userInfo } from '../utils/dbOperations/interfaces';
import { LoginFormInterface } from '../Screens/Login/Interfaces';

type FormType = 'signup' | 'update' | 'login';

const useRegister = (formType: FormType) => {
  const dispatch = useAuthDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: userInfo | LoginFormInterface, role?: 'admin' | 'users', id?: string) => {
    setLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      if (formType === 'signup' && id && role) {
        await signupAction(dispatch, id, data as userInfo, role);
      } else if (formType === 'update' && id) {
        await updateAction(dispatch, id, data as userInfo);
      } else if (formType === 'login') {
        await loginAction(dispatch, (data as LoginFormInterface).email, (data as LoginFormInterface).password);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};

export default useRegister;
