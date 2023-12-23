interface APIError {
	cause: {
		errno: number;
		code: ErrCode;
		syscall: string;
		address: string;
		port: number;
	};
}

type ErrCode = "ECONNREFUSED" | "ECONNRESET";

export type { APIError };
