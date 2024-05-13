import { createBrowserRouter } from 'react-router-dom';
import Listings from './components/Listings/ListingsIndex';
import ListingPage from './components/Listings/ListingPage';
import CreateListingForm from './components/Listings/ListingForm/CreateListingForm';
import UpdateListingForm from './components/Listings/ListingForm/UpdateListingForm';
import ManageListings from './components/listings/ManageListings';
import ShoppingCartPage from './components/Cart/CartPage';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/Checkout/OrderConfirmation';
import CheckoutUser from './components/Checkout/CheckoutUser/CheckoutUser';
import UserProfile from './components/User/UserProfile';
import EditProfile from './components/User/EditProfile';
import CompleteProfile from './components/User/CompleteProfile';
import Shop from './components/User/Shop';
import Layout from './Layout';
import Home from './components/Home/Home';
import SearchPage from './components/Search/SearchPage/SearchPage';
import Guides from './components/Guides/GuidesIndex';
import GuidePage from './components/Guides/GuidePage/GuidePage';
import ManageGuides from './components/Guides/ManageGuides/ManageGuides';

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/listings',
                element: <Listings />
            },
            {
                path: '/listings/current',
                element: <ManageListings />
            },
            {
                path: '/listings/:listingId',
                element: <ListingPage />
            },
            {
                path: '/listings/new',
                element: <CreateListingForm />
            },
            {
                path: '/listings/:listingId/edit',
                element: <UpdateListingForm />
            },
            {
                path: '/cart',
                element: <ShoppingCartPage />
            },
            {
                path: '/checkout',
                element: <Checkout />
            },
            {
                path: '/checkout/user',
                element: <CheckoutUser />
            },
            {
                path: '/order/:orderId',
                element: <OrderConfirmation />
            },
            {
                path: '/user/:userId',
                element: <UserProfile />
            },
            {
                path: '/user/:userId/editprofile',
                element: <EditProfile />
            },
            {
                path: '/user/:userId/completeprofile',
                element: <CompleteProfile />
            },
            {
                path: '/user/:userId/shop',
                element: <Shop />
            },
            {
                path: '/search',
                element: <SearchPage />
            },
            {
                path: '/guides',
                element: <Guides />
            },
            {
                path: '/guides/:guideId',
                element: <GuidePage />
            },
            {
                path: '/guides/current',
                element: <ManageGuides />
            },
        ]
    }
]);

export default router;
