import type { User } from "./User";

interface Promo {
    _id: string;
    code: string;
    description?: string;
    discount_percentage: number;
    start_date: number;
    expiry_date: number;
    created_by: User;
    __v: number;
    nickname?: string;
}

export type { Promo }