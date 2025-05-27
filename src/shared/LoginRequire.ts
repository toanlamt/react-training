import { useAuthStore } from '../shared/store/authStore';

export function requireAuth(request: Request): Response | null {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        const url = new URL(request.url);
        return Response.redirect(`/auth/login?redirectTo=${url.pathname}`, 302);
    }

    return null;
}