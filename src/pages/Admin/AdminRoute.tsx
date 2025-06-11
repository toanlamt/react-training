import type { RouteObject } from 'react-router';
import AdminPage from './AdminPage.tsx';
import { requireOfficer } from "../../shared/LoginRequire.ts";


export async function pageLoader({request}: { request: Request }) {
    const res = await requireOfficer(request);
    return res ? res : null;
}

const adminRoutes: RouteObject[] = [
    {
        path: 'admin',
        loader: pageLoader,
        element: <AdminPage/>
    }
]


export default adminRoutes;