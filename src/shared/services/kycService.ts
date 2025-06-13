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
    
    fetchPendingKYC: async (): Promise<KYC[]> => {
        try {
            const response = await apiClient.get('/kyc/pending');
            return response.data;
        } catch (error: any) {
            throw error || new Error('Failed to fetch pending KYC data');
        }
    },

    fetchResultKYC: async (): Promise<KYC[]> => {
        try {
            const response = await apiClient.get('/kyc/result');
            return response.data;
        } catch (error: any) {
            throw error || new Error('Failed to fetch result KYC data');
        }
    },

    approveKYC: async (userId: string): Promise<KYC> => {
        try {
            const response = await apiClient.post(`/kyc/${userId}/approve`);
            return response.data;
        } catch (error: any) {
            throw error || new Error('Failed to approve KYC');
        }
    },

    rejectKYC: async (userId: string): Promise<KYC> => {
        try {
            const response = await apiClient.post(`/kyc/${userId}/reject`);
            return response.data;
        } catch (error: any) {
            throw error || new Error('Failed to reject KYC');
        }
    },
};