import type { User } from './User';

interface Article {
	_id: string;
	content: string;
	author: User;
	__v: number;
}

export type { Article };
