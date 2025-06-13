import { create } from 'zustand';
import type { KYC, KYCFormData, KYCState } from '../types/kyc';
import { kycService } from '../services/kycService';

interface KYCStore extends KYCState {
    kyc: KYC | null;
    isLoading: boolean;
    error: string | null | [];
    pendingKYCList: KYC[];
    resultKYCList: KYC[];

    fetchKYCByUserId: (userId: string) => Promise<void>;
    updateKYC: (kycData: KYCFormData) => Promise<any>;
    fetchPendingKYC: () => Promise<void>;
    fetchResultKYC: () => Promise<void>;
    approveKYC: (userId: string) => Promise<void>;
    rejectKYC: (userId: string) => Promise<void>;
    clearError: () => void;
}

export const useKYCStore = create<KYCStore>((set, get) => ({
    kyc: null,
    pendingKYCList: [],
    resultKYCList: [],
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

    fetchPendingKYC: async () => {
        set({ isLoading: true, error: null });

        try {
            const pendingKYCList = await kycService.fetchPendingKYC();
            set({
                pendingKYCList: pendingKYCList,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Failed to fetch pending KYC data',
                isLoading: false,
            });
        }
    },

    fetchResultKYC: async () => {
        set({ isLoading: true, error: null });

        try {
            const resultKYCList = await kycService.fetchResultKYC();
            set({
                resultKYCList: resultKYCList,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Failed to fetch result KYC data',
                isLoading: false,
            });
        }
    },

    approveKYC: async (userId: string) => {
        set({ isLoading: true, error: null });

        try {
            await kycService.approveKYC(userId);
            set((state) => ({
                pendingKYCList: state.pendingKYCList.filter((kyc) => kyc.user_id !== Number(userId)),
                isLoading: false,
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Failed to approve KYC',
                isLoading: false,
            });
        }
    },

    rejectKYC: async (userId: string) => {
        set({ isLoading: true, error: null });

        try {
            await kycService.rejectKYC(userId);
            set((state) => ({
                pendingKYCList: state.pendingKYCList.filter((kyc) => kyc.user_id !== Number(userId)),
                isLoading: false,
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Failed to reject KYC',
                isLoading: false,
            });
        }
    },


    clearError: () => set({ error: null }),
}));