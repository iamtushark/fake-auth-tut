import * as yup from 'yup';

export const SignupSchema = yup.object().shape({
	email: yup.string().required('Email is required').email('Must be a valid email'),
	password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
	roleType: yup.string().required('Role type is required').oneOf(['admin', 'users'], 'Invalid role type') as yup.Schema<'admin' | 'users'>,
	name: yup.string().required('Name is required'),
	mobileNo: yup.number().required('Phone number is required').typeError("Phone number must be a number")
		.test(
			"len",
			"Phone number must be exactly 10 digits",
			(val) =>
				val !== undefined && val !== null && val.toString().length === 10,
		)
});

export default SignupSchema;
