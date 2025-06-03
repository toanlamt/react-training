import type { RouteObject } from 'react-router-dom';
import Login from './Login/Login';
import Logout from './Logout/Logout';
import NotFound from '../404';
import Auth from "./Auth.tsx";
import ResetPassword from "./ResetPassword/ResetPassword.tsx";
import SignUp from "./SignUp/SignUp.tsx";

const authRoutes: RouteObject[] = [
    {
        path: 'auth',
        element: <Auth />,
        errorElement: <NotFound />,
        children: [
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'logout',
                element: <Logout />
            },
            {
                path: 'sign-up',
                element: <SignUp />
            },
            {
                path: 'reset-password',
                element: <ResetPassword />
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
];

export default authRoutes;