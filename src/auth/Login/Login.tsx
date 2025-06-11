import { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthStore } from '../../shared/store/authStore';
import type { LoginCredentials } from '../../shared/types/auth';

const loginSchema = yup.object({
    username: yup.string()
        .required('Username is required'),
    password: yup.string()
        .required('Password is required')
});

const Login = () => {
    const navigate = useNavigate()
    const { login, isLoading, error, clearError, user } = useAuthStore();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginCredentials>({
        resolver: yupResolver(loginSchema)
    });
    const onSubmit = async (data: LoginCredentials) => {
        try {
            clearError();
            await login(data);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    useEffect(() => {
        if (user) {
            if (user.role === "officer") {
                navigate(`/pages/admin`, { replace: true });
              } else {
                navigate(`/pages/users/${user.id}/details`, { replace: true });
              }
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
            <a href="#" className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white">
                <img src="/logo.png" className="mr-4 h-11" alt="Simple KYC Logo" />
                <span>Simple KYC Authentication</span>
            </a>
            <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sign in to platform
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                        <input type="text" id="username" {...register('username')} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input type="password" {...register('password')} id="password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" name="remember" type="checkbox" className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="font-medium text-gray-900 dark:text-white">Remember me</label>
                        </div>
                        <Link to='/auth/reset-password' className="ml-auto text-sm text-primary-700 hover:underline dark:text-primary-500">Lost Password?</Link>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Login to your account</button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Forgot password? <Link to='/auth/sign-up' className="text-primary-700 hover:underline dark:text-primary-500">Sign-up</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;