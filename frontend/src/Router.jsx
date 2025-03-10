import { createBrowserRouter } from 'react-router-dom';
import Listings from './components/Listings/ListingsIndex';
import ListingPage from './components/Listings/ListingPage';
import CreateListingForm from './components/Sell/SellerDashboard/ListingForm/CreateListingForm';
import UpdateListingForm from './components/Sell/SellerDashboard/ListingForm/UpdateListingForm';
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
import UserGuides from './components/User/UserGuides';
import CreateGuide from './components/Guides/GuideForm/CreateGuide';
import UpdateGuide from './components/Guides/GuideForm/UpdateGuide';
import Error404 from './components/ErrorHandling/Error404';
import Sell from './components/Sell/SellPage/Sell';
import ManageSellerListings from './components/Sell/SellerDashboard/ManageListings';
import Orders from './components/Orders';
import ManageOrders from './components/Sell/SellerDashboard/ManageOrders';
import FulfilledOrders from './components/Sell/SellerDashboard/ManageOrders/FulfilledOrders';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51QIbbJGrdPWSfcrQDrPAjloRpybQIcMhTJCYfAkaZTT7TJbobyq3nER4oSliHzYcZY5Ck2qdb4snbErQmN1tPBsD00c2i01MKq")

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '*',
                element: <Error404 type="Page" />
            },
            {
                path: '/listings',
                element: <Listings />
            },
            {
                path: '/listings/:listingId',
                element: <ListingPage />
            },
            {
                path: '/sell/listings/new',
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
                element: (
                    <Elements stripe={stripePromise}>
                        <Checkout />
                    </Elements >
                ),
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
                path: '/user/:userId/guides',
                element: <UserGuides />
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
            {
                path: '/guides/new',
                element: <CreateGuide />
            },
            {
                path: '/guides/:guideId/edit',
                element: <UpdateGuide />
            },
            {
                path: '/sell',
                element: <Sell />
            },
            {
                path: '/sell/listings',
                element: <ManageSellerListings />
            },
            {
                path: '/orders',
                element: <Orders />
            },
            {
                path: 'sell/orders',
                element: <ManageOrders />
            },
            {
                path: 'sell/orders/fulfilled',
                element: <FulfilledOrders />
            },
        ]
    }
]);

export default router;
