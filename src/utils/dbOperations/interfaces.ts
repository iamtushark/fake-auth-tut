
export interface userInfo {
	name: string,
	password: string,
	mobileNo: number,
	email: string
}

export interface Entry {
	id: string;
	value: userInfo;
}

export interface dbEntries {
	admin: { [key: string]: userInfo },
	users: { [key: string]: userInfo },
	loggedInUser : string 
}