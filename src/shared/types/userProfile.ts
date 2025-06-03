export type SubWorkType = 'work' | 'personal';
export type WorkType = 'email' | 'phone';
export type AddressType = 'mailing' | 'work';
export type DocType = 'passport' | 'id_card' | 'driver_license';

export interface Contact {
    type: WorkType;
    value: string;
    subtype: SubWorkType;
    preferred: boolean;
    id: string;
    profile_id: string;
}

export interface Address {
    country: string;
    city: string;
    street: string;
    postal_code?: string;
    type: AddressType;
    id: string;
    profile_id: string;
}

export interface Document {
    doc_type: DocType;
    expiry_date: string;
    file_path: string;
    id: string;
    profile_id: string;
}

export interface Employment {
    company_name: string;
    from_date: string;
    to_date?: string;
    id: string;
    profile_id: string;
}

export interface UserProfile {
    id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    dob: string;
    age: number;
    user_id: string;
    contacts: Contact[];
    addresses: Address[];
    documents: Document[];
    employments: Employment[];
}

export interface UserProfileFormData extends Omit<UserProfile, 'id'> { }

export interface UserProfileState {
    profile: UserProfile | null;
    isLoading: boolean;
    isEditing: boolean;
    error: string | null;
}


export interface UserProfileResponse {
    success: boolean;
    data: UserProfile;
    message?: string;
}

export interface UserProfileUpdateRequest {
    profile: UserProfileFormData;
}