import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import appRoutes from "./AppRoutes.tsx";

const router = createBrowserRouter(appRoutes);

const App: React.FC = () => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
};

export default App;