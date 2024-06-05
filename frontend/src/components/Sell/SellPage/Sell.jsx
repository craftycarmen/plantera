import './Sell.css';
import { PiNumberCircleOneFill, PiNumberCircleTwoFill, PiNumberCircleThreeFill } from "react-icons/pi";
import { useSelector } from 'react-redux';
import OpenModalMenuItem from '../../Navigation/OpenModalMenuItem';
import SignupFormModal from '../../SignupFormModal';
import { Link } from 'react-router-dom';
import SellerDashboard from '../SellerDashboard';


function Sell() {

    const sessionUser = useSelector(state => state.session.user);
    const user = useSelector(state => state.user[sessionUser?.id]?.User)
    const currUser = user || sessionUser;
    const isSeller = currUser && currUser.accountType !== 'seller';

    return (
        <>
            {sessionUser && !isSeller ? (
                <h1>Sell(er Dashboard) for {sessionUser.username}</h1>
            ) : (
                <h1>Sell</h1>)}
            <div>Purge your plants and plant babies on Plantera, and get paid!</div>
            <br />
            <div className='sellContainer'>
                {sessionUser && !isSeller ? (
                    <SellerDashboard sessionUser={sessionUser} />
                ) : (
                    <>
                        <div className='sellSteps'>
                            <div className='step'>
                                <div>
                                    <img src='../../logo-monstera.png' />
                                </div>
                                <h2><span style={{ fontSize: "30px", marginTop: "5px" }}><PiNumberCircleOneFill /></span> Be a Seller on Plantera</h2>
                                <div>Fill out the seller section on your Plantera profile.</div>
                            </div>
                            <div className='step'>
                                <div>

                                    <img src='../../plant-listing.png' />
                                </div>

                                <h2><span style={{ fontSize: "30px", marginTop: "5px" }}><PiNumberCircleTwoFill /></span> List Your Plants</h2>
                                <div>Take a picture of your plant and share the details.</div>
                            </div>
                            <div className='step'>
                                <div>
                                    <img src='../../get-paid.png' />
                                </div>
                                <h2><span style={{ fontSize: "30px", marginTop: "5px" }}><PiNumberCircleThreeFill /></span> Earn Money from Your Sales</h2>
                                <div>Once your plant sells, ship it and see that money hit that bank account!</div>
                            </div>
                        </div>
                        <div className='signUp'>
                            <h2><span style={{ fontStyle: "italic" }}>...Ready For It?</span></h2>
                            {isSeller &&
                                <Link to={`/user/${sessionUser?.id}/editprofile`}><button><h3>Be a seller now!</h3></button></Link>
                            }
                            {!sessionUser &&
                                <OpenModalMenuItem
                                    itemText={<button><h3>Sign up for Plantera now!</h3></button>}
                                    modalComponent={<SignupFormModal />}
                                />
                            }
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default Sell
