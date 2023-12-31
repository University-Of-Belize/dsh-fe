import type { User } from './User';

interface Feedback {
	_id: string;
	content: string;
	original_content: string;
	author: User;
	__v: number;
}

export type { Feedback };
