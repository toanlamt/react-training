import { create } from 'zustand';
import type { KYC, KYCFormData, KYCState } from '../types/kyc';
import { kycService } from '../services/kycService';

interface KYCStore extends KYCState {
    kyc: KYC | null;
    isLoading: boolean;
    error: string | null | [];

    fetchKYCByUserId: (userId: string) => Promise<void>;
    updateKYC: (kycData: KYCFormData) => Promise<any>;
    clearError: () => void;
}

export const useKYCStore = create<KYCStore>((set, get) => ({
    kyc: null,
    isLoading: false,
    error: null,

    fetchKYCByUserId: async (userId: string) => {
        set({ isLoading: true, error: null });

        try {
            const kyc = await kycService.getKYCByUserId(userId);
            set({
                kyc: kyc,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Failed to fetch KYC data',
                isLoading: false,
            });
        }
    },

    updateKYC: async (kycData: KYCFormData) => {
        set({ isLoading: true, error: null });

        try {
            const updatedKYC = await kycService.updateKYC(kycData);
            if (updatedKYC) {
                set({
                    kyc: updatedKYC,
                    isLoading: false,
                });
            }
            return updatedKYC;
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Failed to update KYC data',
                isLoading: false,
            });
        }
    },

    clearError: () => set({ error: null }),
}));