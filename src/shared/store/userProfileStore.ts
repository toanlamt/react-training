import { create } from 'zustand';
import type { UserProfile, UserProfileFormData, UserProfileState } from '../types/userProfile';
import { userProfile } from '../services/userProfile';

interface UserProfileStore extends UserProfileState {
    profile: UserProfile | null,
    profiles: UserProfile[] | null,
    isLoading: boolean,
    isEditing: boolean,
    error: string | null,

    fetchUserProfile: () => Promise<void>;
    fetchUserProfileById: (userId: string) => Promise<void>;
    updateUserProfile: (profileData: UserProfileFormData) => Promise<void>;
    createUserProfile: (profileData: UserProfileFormData) => Promise<void>;
    setEditMode: (isEditing: boolean) => void;
    clearError: () => void;
}

export const useUserProfileStore = create<UserProfileStore>((set, get) => ({
    profile: null,
    profiles: null,
    isLoading: false,
    isEditing: false,
    error: null,

    fetchUserProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const profiles = await userProfile.getAllUserProfile();
            set({
                profiles,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Failed to fetch profile',
                isLoading: false,
            });
        }
    },

    fetchUserProfileById: async (userId: string) => {
        set({ isLoading: true, error: null });

        try {
            const profile = await userProfile.getUserProfileById(userId);
            set({
                profile: profile,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Failed to fetch profile',
                isLoading: false,
            });
        }
    },

    updateUserProfile: async (profileData: UserProfileFormData) => {
        set({ isLoading: true, error: null });

        try {
            const profile = await userProfile.updateUserProfile(profileData);
            set({
                profile: profile,
                isLoading: false,
                isEditing: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Failed to update profile',
                isLoading: false,
            });
        }
    },

    createUserProfile: async (profileData: UserProfileFormData) => {
        set({ isLoading: true, error: null });

        try {
            const profile = await userProfile.createUserProfile(profileData);
            set({
                profile: profile,
                isLoading: false,
                isEditing: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Failed to update profile',
                isLoading: false,
            });
        }
    },

    setEditMode: (isEditing: boolean) => {
        set({ isEditing });
    },

    clearError: () => set({ error: null })

}));