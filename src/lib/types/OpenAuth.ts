export interface SignInData {
	token: string;
	staff: boolean;
}

export interface SignInError {
	error: string;
	status: string;
}
