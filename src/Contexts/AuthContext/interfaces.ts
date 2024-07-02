import { userInfo } from './../../utils/dbOperations/interfaces';

export interface AuthState {
	id: string;
	info: userInfo;
	authLevel: 'admin' | 'users' | null;
}

export type AuthAction =
  | { type: 'LOGIN'; payload: { id: string; info: userInfo; authLevel: 'admin' | 'users' } }
  | { type: 'LOGOUT' }
  | { type: 'SIGNUP'; payload: { id: string; info: userInfo; authLevel: 'admin' | 'users' } }
  | { type: 'UPDATE'; payload: { id: string; info: userInfo } };