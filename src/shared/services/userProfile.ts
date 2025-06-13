import apiClient from './apiClient';
import type { UserProfileFormData, UserProfileResponse } from '../types/userProfile';

export const userProfile = {
    getAllUserProfile: async (): Promise<any> => {
        try {
            const response = await apiClient.get('/profile');
            return response.data;
        } catch (error: any) {
            throw error || new Error('Failed to fetch user profiles');
        }
    },

    getUserProfileById: async (userId: string): Promise<any> => {
        try {
            const response = await apiClient.get(`/profile/${userId}`);
            return response.data;
        } catch (error: any) {
            throw error || new Error('Failed to fetch user profile');
        }
    },

    getUserProfileBasicById: async (userId: string): Promise<any> => {
        try {
            const response = await apiClient.get(`/profile/basic/${userId}`);
            return response.data;
        } catch (error: any) {
            throw error || new Error('Failed to fetch user profile');
        }
    },

    updateUserProfile: async (profileData: UserProfileFormData): Promise<any> => {
        try {
            const response = await apiClient.put('/profile', profileData);
            return response.data;
        } catch (error: any) {
            throw error || new Error('Failed to update user profile');
        }
    },

    createUserProfile: async (profileData: UserProfileFormData): Promise<any> => {
        try {
            const response = await apiClient.post('/profile', profileData);
            return response.data;
        } catch (error: any) {
            throw error || new Error('Failed to create user profile');
        }
    }
};