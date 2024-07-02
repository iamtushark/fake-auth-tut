import localforage from 'localforage';
import { dbEntries, userInfo } from './interfaces';

localforage.config({
	driver: localforage.INDEXEDDB,
	name: 'authentication-tut',
	version: 1.0,
	storeName: 'users',
	description: 'a data store for users',
});

const INITIAL_DATA = { admin: {}, users: {}, loggedInUser: '' };

export const loadEntries = async (): Promise<dbEntries> => {
	let data = await localforage.getItem<dbEntries>('users');

	if (!data) {
		data = INITIAL_DATA;
		await localforage.setItem('users', data);
	}

	return data;
};

export const getEntryById = async (id: string): Promise<userInfo | null> => {
	const data = await localforage.getItem<dbEntries>('users');
	if (!data) {
		await loadEntries();
		return null;
	}

	if (data.admin && data.admin[id]) {
		return data.admin[id];
	}

	if (data.users[id]) {
		return data.users[id];
	}

	return null;
};

export const addEntry = async (id: string, value: userInfo, key: 'admin' | 'users'): Promise<void> => {
	let data = await localforage.getItem<dbEntries>('users');
	if (!data) {
		data = INITIAL_DATA;
	}

	if (key === 'admin' && Object.keys(data.admin).length >= 1) {
		throw new Error('Maximum of 1 admin is allowed');
	} else if (key === 'users' && Object.keys(data.users).length >= 5) {
		throw new Error('Maximum of 5 users are allowed');
	}
	data[key][id] = value;

	await localforage.setItem('users', data);
};

export const updateEntry = async (id: string, value: userInfo): Promise<void> => {
	let data = await localforage.getItem<dbEntries>('users');
	if (!data) {
		data = INITIAL_DATA;
	}

	// Check if email already exists
	for (const [key, user] of Object.entries(data.admin)) {
		if (user.email === value.email && key !== id) {
			throw new Error('Email already exists for another admin');
		}
	}

	for (const [key, user] of Object.entries(data.users)) {
		if (user.email === value.email && key !== id) {
			throw new Error('Email already exists for another user');
		}
	}
	
	if (data.admin[id]) {
		data.admin[id] = value;
	} else if (data.users[id]) {
		data.users[id] = value;
	} else {
		throw new Error('Entry not found');
	}

	await localforage.setItem('users', data);
};

export const getAuthenticationLevel = async (id: string): Promise<'admin' | 'users' | null> => {
	const data = await localforage.getItem<dbEntries>('users');
	if (data) {
		if (data.admin[id]) {
			return 'admin';
		}
		if (data.users[id]) {
			return 'users';
		}
	}
	return null;
};

export const login = async (
	email: string,
	password: string
): Promise<{ id: string; userInfo: userInfo; authLevel: 'admin' | 'users' } | null> => {
	let data = await localforage.getItem<dbEntries>('users');
	if (!data) {
		data = INITIAL_DATA;
	}

	let loggedInUser = '';
	for (const key in data.admin) {
		if (data.admin[key].email === email && data.admin[key].password === password) {
			loggedInUser = key;
			break;
		}
	}

	if (!loggedInUser) {
		for (const key in data.users) {
			if (data.users[key].email === email && data.users[key].password === password) {
				loggedInUser = key;
				break;
			}
		}
	}
	if (loggedInUser) {
		data.loggedInUser = loggedInUser;
		await localforage.setItem('users', data);
		return { id: loggedInUser, userInfo: data.admin[loggedInUser] || data.users[loggedInUser], authLevel: data.admin[loggedInUser] ? 'admin' : 'users' };
	}

	return null;
};

export const signup = async (id: string, user: userInfo, key: 'admin' | 'users'): Promise<void> => {
	let data = await localforage.getItem<dbEntries>('users');
	if (!data) {
		data = INITIAL_DATA;
	}

	for (const adminKey in data.admin) {
		if (data.admin[adminKey].email === user.email) {
			throw new Error('Email already exists');
		}
	}

	for (const userKey in data.users) {
		if (data.users[userKey].email === user.email) {
			throw new Error('Email already exists');
		}
	}
	await addEntry(id, user, key);
	data = await localforage.getItem<dbEntries>('users');
	if (!data) {
		data = INITIAL_DATA;
	}
	data.loggedInUser = id;
	await localforage.setItem('users', data);
};

export const getLoggedInUserInfo = async (): Promise<{ id: string; userInfo: userInfo; authLevel: 'admin' | 'users' } | null> => {
	const data = await localforage.getItem<dbEntries>('users');
	if (data && data.loggedInUser) {
		const authLevel = data.admin[data.loggedInUser] ? 'admin' : 'users';
		return { id: data.loggedInUser, userInfo: data.admin[data.loggedInUser] || data.users[data.loggedInUser], authLevel };
	}
	return null;
};

export const getAllUsers = async (): Promise<Record<string, userInfo>> => {
	let data = await localforage.getItem<dbEntries>('users');
	if (!data) {
		data = INITIAL_DATA;
	}
	return data.users;
};

export const logout = async (): Promise<void> => {
	const data = await localforage.getItem<dbEntries>('users');
	if (data) {
		data.loggedInUser = '';
		await localforage.setItem('users', data);
	}
};