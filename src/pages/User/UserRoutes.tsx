import { Navigate, type RouteObject } from "react-router-dom";
import UserPage from './UserPage.tsx';
import UserKYCPage from './UserKYCPage.tsx';
import UserProfilePage from './UserProfilePage.tsx';

const userRoutes: RouteObject[] = [
    {
        path: 'users',
        element: <UserPage/>,
        children: [
            { path: '', element: <Navigate to="list" replace/> },
            { path: ':userId/kyc', element: <UserKYCPage/> },
            { path: ':userId/edit', element: <UserProfilePage/> },
            { path: ':userId/details', element: <UserProfilePage/> }
        ]
    }
]

export default userRoutes;