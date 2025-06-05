import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Spinner, Alert } from 'flowbite-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserProfileStore } from '../../shared/store/userProfileStore.ts';
import { BasicInfoCard } from '../../components/Features/UserProfile/components/BasicInfoCard.tsx';
import { AddressCard } from '../../components/Features/UserProfile/components/AddressCard.tsx';
import { EmailCard } from '../../components/Features/UserProfile/components/EmailCard.tsx';
import { PhoneCard } from '../../components/Features/UserProfile/components/PhoneCard.tsx';
import { DocumentCard } from '../../components/Features/UserProfile/components/DocumentCard.tsx';
import { EmploymentCard } from '../../components/Features/UserProfile/components/EmploymentCard.tsx';

const ProfileForm = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { userId } = useParams<{ userId?: string }>();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        console.log('Submitted data:', data);
    };

    const goToKYC = () => {
        navigate(`/pages/users/${params.id}/kyc`);
    }

    const {
        profile,
        isLoading,
        isEditing,
        error,
        clearError,
        fetchUserProfileById,
        updateUserProfile
    } = useUserProfileStore();


    const [tempProfile, setTempProfile] = useState(profile);
    useEffect(() => {
        if (profile) {
            setTempProfile(profile);
        }
    }, [profile]);

    const emails = tempProfile?.contacts.filter((c) => c.type === "email") || [];
    const phones = tempProfile?.contacts?.filter((c) => c.type === "phone") || [];

    const handlePartialUpdate = (section: Partial<typeof profile>) => {
        setTempProfile((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                ...section,
            };
        });
    };

    const handleSaveAll = () => {
        if (tempProfile) {
            updateUserProfile(tempProfile);
        }
    };


    useEffect(() => {
        // Fetch user profile using userId.
        if (userId) {
            fetchUserProfileById(userId);
        }

    }, [userId, fetchUserProfileById]);

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
                                    aria-current="page">Personal Information</span>
                            </div>
                        </li>
                    </ol>
                </nav>
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">Personal
                    Information</h1>
            </div>
            <div className="space-y-6">
                {/* Show loading spinner */}
                {isLoading && (
                    <div className="flex justify-center">
                        <Spinner size="lg" aria-label="Loading..." />
                    </div>
                )}

                {/* Show error message */}
                {error && (
                    <Alert color="failure">
                        <span>
                            <span className="font-medium">Error:</span> {error}
                        </span>
                    </Alert>
                )}

                {/* Render profile cards if profile exists */}
                {!isLoading && !error && tempProfile && (
                    <>
                        <BasicInfoCard data={tempProfile.basicinfo} onChange={(basicinfo) => handlePartialUpdate({ basicinfo })} />
                        <AddressCard data={tempProfile.addresses} onChange={(addresses) => handlePartialUpdate({ addresses })} />
                        <EmailCard data={emails} onChange={(updatedEmails) => handlePartialUpdate({ contacts: [...updatedEmails, ...phones] })} />
                        <PhoneCard data={phones} onChange={(updatedPhones) => handlePartialUpdate({ contacts: [...emails, ...updatedPhones] })} />
                        <DocumentCard data={tempProfile.documents} onChange={(docs) => handlePartialUpdate({ documents: docs })} />
                        <EmploymentCard data={tempProfile.employments} onChange={(emps) => handlePartialUpdate({ employments: emps })} readOnly={false} />

                        <div className="text-right">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={handleSaveAll}
                            >
                                Save All
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ProfileForm;