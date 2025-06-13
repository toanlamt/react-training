import { Navigate, type RouteObject } from "react-router-dom";
import AdminPage from './AdminPage.tsx';
import AdminProfles from './AdminProfiles.tsx';
import { requireOfficer } from "../../shared/LoginRequire.ts";
import AdminKycPreview from "../Admin/AdminKycPreview.tsx";
import AdminKycResult from "../Admin/AdminKycResult.tsx";


export async function pageLoader({ request }: { request: Request }) {
    const res = await requireOfficer(request);
    return res ? res : null;
}

const adminRoutes: RouteObject[] = [
    {
        path: 'admin',
        loader: pageLoader,
        element: <AdminPage />,
        children: [
            { path: '', element: <Navigate to="profiles" replace/> },
            { path: 'profiles', element: <AdminProfles /> },
            { path: 'preview', element: <AdminKycPreview /> },
            { path: "result", element: <AdminKycResult /> },
        ],
    }
]


export default adminRoutes;