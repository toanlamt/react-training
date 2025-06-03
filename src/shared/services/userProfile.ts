import apiClient from './apiClient';
import type { UserProfileFormData, UserProfileResponse } from '../types/userProfile';

export const userProfile = {
    getAllUserProfile: async (): Promise<any> => {
        const response = await apiClient.get('/profile');
        return response.data;
    },

    getUserProfileById: async (userId: string): Promise<any> => {
        const response = await apiClient.get(`/profile/${userId}`);
        return response.data;
    },

    updateUserProfile: async (profileData: UserProfileFormData): Promise<any> => {
        const response = await apiClient.put('/profile', JSON.stringify(profileData));
        return response.data;
    },

    createUserProfile: async (profileData: UserProfileFormData): Promise<any> => {
        const response = await apiClient.post('/profile', JSON.stringify(profileData));
        return response.data;
    }
};