export type Role = 'user' | 'officer';

export interface User {
    user: User | null | undefined;
    id: string;
    username: string;
    role: Role;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface SignUpCredentials extends LoginCredentials {
    confirmPassword: string;
    terms: boolean;
    role: Role;
    first_name: string;
    middle_name: string;
    last_name: string;
    dob: string;
}

export interface SignUpPayload {
    user_data: {
        username: string,
        role: Role,
        password: string,
    },
    profile_data: {
        first_name: string,
        middle_name: string,
        last_name: string,
        dob: string,
        age: string,
    }
}


export interface LoginResponse {
    user: User;
    message: string;
}

export interface SignUpResponse extends LoginCredentials {
    confirmPassword: string;
    role: Role;
}