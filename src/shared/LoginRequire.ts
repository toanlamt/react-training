import { useAuthStore } from '../shared/store/authStore';

export async function requireAuth(request: Request): Promise<Response | null> {
    const { isAuthenticated, checkAuth } = useAuthStore.getState();

    // If not authenticated, call checkAuth to verify authentication
    if (!isAuthenticated) {
        await checkAuth();

        // Re-check authentication after calling checkAuth
        if (!useAuthStore.getState().isAuthenticated) {
            const url = new URL(request.url);
            return Response.redirect(`/auth/login?redirectTo=${url.pathname}`, 302);
        }
    }

    return null;
}