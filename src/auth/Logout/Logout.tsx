import { useState } from 'react';
import { Modal, Button, ModalBody, ModalHeader, ModalFooter } from 'flowbite-react';
import { useAuthStore } from '../../shared/store/authStore';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const [showModal, setShowModal] = useState(true);
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/auth/login', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <Modal show={showModal} onClose={handleCancel}>
                <ModalHeader>
                    Confirm Logout
                </ModalHeader>
                <ModalBody>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to log out? You will need to log in again to access your account.
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="red" onClick={handleLogout}>
                        Yes
                    </Button>
                    <Button color="gray" onClick={handleCancel}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Logout;