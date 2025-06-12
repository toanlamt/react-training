import { Outlet } from "react-router";
import AppHeader from '../components/Header/AppHeader.tsx';
import AppSidebar from '../components/Sidebar/AppSidebar.tsx';
import AppFooter from '../components/Footer/AppFooter.tsx';

const RootLayout: React.FC = () => {
    return (
        <>
            <AppHeader/>
            <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
                {/* <AppSidebar/> */}
                <div id="main-content"
                     className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-15 lg:mr-15 dark:bg-gray-900">
                    <main>
                        <Outlet></Outlet>
                        <AppFooter/>
                    </main>
                </div>
            </div>
        </>
    )
}

export default RootLayout;