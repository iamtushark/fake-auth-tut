export interface RegisterForm {
	email: string;
	password: string;
	roleType: 'admin' | 'users';
	name: string;
	mobileNo: number;
}