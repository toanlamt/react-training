import apiClient from './apiClient';
import type { KYC, KYCFormData } from '../types/kyc';

export const kycService = {
    getKYCByUserId: async (userId: string): Promise<KYC> => {
        try {
            const response = await apiClient.get(`/kyc/${userId}`);
            return response.data;
        } catch (error: any) {
            throw error || new Error('Failed to fetch kyc data');
        }
    },

    updateKYC: async (kycData: KYCFormData): Promise<KYC> => {
        try {
            const response = await apiClient.put('/kyc', kycData);
            return response.data;
        } catch (error: any) {
            throw error || new Error('Failed to update kyc data');
        }
    },
};