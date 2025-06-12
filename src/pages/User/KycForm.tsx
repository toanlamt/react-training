import { useState, useEffect } from 'react';
import { Spinner, Toast, Button } from 'flowbite-react';
import { HiCheck, HiX, HiOutlineArrowLeft } from "react-icons/hi";
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, FormProvider } from "react-hook-form";;
import { useKYCStore } from '../../shared/store/kycStore.ts';
import { useAuthStore } from '../../shared/store/authStore';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NetWorthSection } from '../../components/Features/kyc/components/NetWorthSection.tsx';
import { FinancialStatusSection, financialStatusSchema } from '../../components/Features/kyc/components/FinancialStatusSection.tsx';
import { InvestmentExperienceSection, investmentExperienceSchema } from '../../components/Features/kyc/components/InvestmentExperienceSection.tsx';
import type { KYCFormData } from '../../shared/types/kyc.ts';

const kycSchema = yup.object({
    ...financialStatusSchema.fields,
    ...investmentExperienceSchema.fields
});

const KycForm = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { userId } = useParams<{ userId?: string }>();
    const [readOnly, setReadOnly] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
        visible: boolean;
    }>({
        message: "",
        type: "success",
        visible: false,
    });


    const form = useForm<KYCFormData>({
        resolver: yupResolver(kycSchema)
    });

    const { handleSubmit, reset, formState: { isDirty } } = form;

    const {
        kyc,
        isLoading,
        error,
        fetchKYCByUserId,
        updateKYC
    } = useKYCStore();

    const goToPI = () => {
        navigate(`/pages/users/${userId}/details`);
    }

    useEffect(() => {
        if (user?.role === "officer") {
            setReadOnly(true);
        }
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                await fetchKYCByUserId(userId);
            }
        };

        fetchData();
    }, [userId, fetchKYCByUserId]);

    useEffect(() => {
        if (kyc) {
            reset({
                id: kyc.id,
                user_id: kyc.user_id,
                incomes: kyc.incomes || [],
                assets: kyc.assets || [],
                liabilities: kyc.liabilities || [],
                wealth_sources: kyc.wealth_sources || [],
                market_experience: kyc.market_experience || null,
                risk_tolerance: kyc.risk_tolerance || null,
            });
        }
    }, [kyc, reset]);

    useEffect(() => {
        if (error) {
            if (typeof error === "string") {
                showToast(error, "error");
            }
            else if (Array.isArray(error)) {
                const errorMessages = error.map((err: any) => err.msg).join(", ");
                showToast(errorMessages, "error");
            }
            else {
                showToast("An unexpected error occurred.", "error");
            }
        }
    }, [error]);

    const onSubmit = async (data: KYCFormData) => {
        const result = await updateKYC(data);
        if (result) {
            showToast("Profile updated successfully!", "success");
        }
    };

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type, visible: true });
        setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
    };

    return (
        <div className="grid grid-cols-1 px-4 pt-6 xl:gap-4 dark:bg-gray-900">
            <div className="mb-4 col-span-full xl:mb-2">
                <nav className="flex mb-5" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
                        <li className="inline-flex items-center">
                            <a href="#"
                                className="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white">
                                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                </svg>
                                Home
                            </a>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"></path>
                                </svg>
                                <a href="#"
                                    className="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-white">Users</a>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"></path>
                                </svg>
                                <span className="ml-1 text-gray-400 md:ml-2 dark:text-gray-500"
                                    aria-current="page">KYC</span>
                            </div>
                        </li>
                    </ol>
                </nav>
                <div className="mb-4 col-span-full xl:mb-2 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                        KYC
                    </h1>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white" pill onClick={goToPI}>
                        <HiOutlineArrowLeft className="ml-2 h-5 w-5" />
                        Personal Information
                    </Button>
                </div>
            </div>
            {/* Show loading spinner */}
            {isLoading && (
                <div className="flex justify-center">
                    <Spinner size="lg" aria-label="Loading..." />
                </div>
            )}

            {toast.visible && (
                <div className="fixed top-5 right-5 z-50">
                    <Toast>
                        {toast.type === "success" ? (
                            <HiCheck className="h-5 w-5 text-green-500" />
                        ) : (
                            <HiX className="h-5 w-5 text-red-500" />
                        )}
                        <div className="ml-3 text-sm font-normal">{toast.message}</div>
                    </Toast>
                </div>
            )}

            {!isLoading && !error && kyc && (

                <>{!readOnly && (
                    <div className="flex justify-between items-center mb-4">
                        <Button size="xs" onClick={() => setEditMode(!editMode)}>
                            {editMode ? "Save" : "Edit"}
                        </Button>
                    </div>

                )}

                    <FormProvider {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <div className="space-y-6">
                                <FinancialStatusSection readOnly={readOnly} editMode={editMode} />
                                <NetWorthSection />
                                <InvestmentExperienceSection editMode={editMode} />
                                {isDirty && (
                                    <div>
                                        <Button type="submit">Submit KYC</Button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </FormProvider>
                </>
            )}
        </div>
    );
}

export default KycForm;
