import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import Footer from './components/Footer';

function Layout() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(sessionActions.restoreUser()).then(() => {
            setIsLoaded(true)
        });
    }, [dispatch]);

    return (
        <div className="layout">
            <Navigation isLoaded={isLoaded} />
            <div className="main-content">
                {isLoaded && <Outlet />}
            </div>
            <Footer />
        </div>
    );
}

export default Layout;
