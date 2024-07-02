import React, { createContext, useContext, useReducer, ReactNode, Dispatch, useEffect } from 'react';
import { userInfo } from './../../utils/dbOperations/interfaces';
import { login, signup, updateEntry, loadEntries, logout } from './../../utils/dbOperations/dbOperations';
import { AuthState, AuthAction } from './interfaces';

const initialState: AuthState = {
  id: '',
  info: { name: '', password: '', mobileNo: 0, email: '' },
  authLevel: null,
};

const AuthStateContext = createContext<AuthState>(initialState);
const AuthDispatchContext = createContext<Dispatch<AuthAction>>(() => { });

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { id: action.payload.id, info: action.payload.info, authLevel: action.payload.authLevel };
    case 'LOGOUT':
      return { ...initialState };
    case 'SIGNUP':
      return { id: action.payload.id, info: action.payload.info, authLevel: action.payload.authLevel };
    case 'UPDATE':
      if (state.id === action.payload.id) {
        return { ...state, info: action.payload.info };
      }
      return state;
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const defaultEntries = await loadEntries();
        if (defaultEntries) {
          const loggedInUser = defaultEntries.loggedInUser || ''; // Ensure to handle cases where loggedInUser might not exist
          const authLevel = defaultEntries.admin[loggedInUser] ? 'admin' : 'users'; // Determine the authentication level
          dispatch({ type: 'LOGIN', payload: { id: loggedInUser, info: defaultEntries.admin[loggedInUser] || {}, authLevel } });
        }
      } catch (error) {
        console.error('Error fetching default entries:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = (): AuthState => useContext(AuthStateContext);
export const useAuthDispatch = (): Dispatch<AuthAction> => useContext(AuthDispatchContext);

// Actions
export const loginAction = async (dispatch: Dispatch<AuthAction>, email: string, password: string) => {
  const user = await login(email, password);
  
  if (user) {
    dispatch({ type: 'LOGIN', payload: { id: user.id, info: user.userInfo, authLevel: user.authLevel } });
  } else {    
    throw new Error('Invalid email or password');
  }
};

export const signupAction = async (dispatch: Dispatch<AuthAction>, id: string, user: userInfo, key: 'admin' | 'users') => {
  await signup(id, user, key);
  dispatch({ type: 'SIGNUP', payload: { id, info: user, authLevel: key } });
};

export const updateAction = async (dispatch: Dispatch<AuthAction>, id: string, user: userInfo) => {
  await updateEntry(id, user);
  dispatch({ type: 'UPDATE', payload: { id, info: user } });
};

export const logoutAction = async (dispatch: Dispatch<AuthAction>) => {
  await logout();
  dispatch({ type: 'LOGOUT' });
};
