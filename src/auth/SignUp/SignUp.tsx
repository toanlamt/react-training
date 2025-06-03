import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthStore } from '../../shared/store/authStore';
import type { SignUpCredentials, Role } from '../../shared/types/auth';

const roles: Role[] = ['user', 'officer'];

const signUpSchema = yup.object({
    username: yup.string()
        .required('Username is required')
        .min(8, 'Username must be 8-10 characters')
        .max(10, 'Username must be 8-10 characters')
        .matches(
            /^[a-zA-Z0-9]+$/,
            'Username must only contain letters and numbers'
        ),
    password: yup.string()
        .required('Password is required')
        .min(12, 'Password must be 12-16 characters')
        .max(16, 'Password must be 12-16 characters')
        .matches(
            /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@#&!])/,
            'Password must contain letters, numbers and special characters (@#&!)'
        ),
    role: yup.string()
        .oneOf(roles, 'Invalid role selected')
        .default('officer'),
    confirmPassword: yup.string()
        .required('Confirm password is required')
        .oneOf([yup.ref('password')], 'Passwords must match'),
    terms: yup.boolean()
        .oneOf([true], 'You must accept the Terms and Conditions')
        .default(false),
});

const SignUp = () => {
    const navigate = useNavigate()
    const { signUp, isLoading, error, clearError } = useAuthStore();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignUpCredentials>({
        resolver: yupResolver(signUpSchema)
    });
    const onSubmit = async (data: SignUpCredentials) => {
        try {
            clearError();
            await signUp(data);
            navigate('/auth/login', { replace: true });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (

        <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
            <a href="" className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white">
                <img src="/logo.png" className="mr-4 h-11" alt="Simple KYC Logo" />
                <span>Sign-up for Simple KYC</span>
            </a>
            <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Create a Free Account
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
                        <input type="text" {...register("username")} id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Username (8-10 characters)" />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input type="password" {...register("password")} id="password" placeholder="Password (12-16 characters)" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                        <input type="password" {...register('confirmPassword')} id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select user role</label>
                        <select id="role" {...register('role')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" {...register('terms')} type="checkbox" className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="font-medium text-gray-900 dark:text-white">I accept the <a href="#" className="text-primary-700 hover:underline dark:text-primary-500">Terms and Conditions</a></label>
                        </div>
                        {errors.terms && (
                            <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
                        )}
                    </div>
                    <button type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create account</button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Already have an account? <Link to='/auth/login' className="text-primary-700 hover:underline dark:text-primary-500">Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp;