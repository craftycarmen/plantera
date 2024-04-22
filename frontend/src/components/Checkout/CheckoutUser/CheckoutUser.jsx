import { useEffect, useState } from 'react';
import * as sessionActions from '../../../store/session';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../Checkout.css';
import CheckoutLogin from './CheckoutLogin';
import CheckoutSignup from './CheckoutSignup';

function CheckoutUser() {

    return (
        <>
            <div>
                Please log in or sign up to check out.
            </div>
            <div className='checkoutUserContainer'>
                <CheckoutLogin />

                <CheckoutSignup />
            </div>
        </>
    )
}

export default CheckoutUser
