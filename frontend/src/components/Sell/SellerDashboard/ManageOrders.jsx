import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import ErrorHandling from "../../ErrorHandling";
import Menu from "./Menu";

function ManageOrders() {
    const dispatch = useDispatch();
    const [showMenu] = useState(false);
    const [isTablet] = useState(window.innerWidth <= 1024 && window.innerWidth >= 481);
    const sellerContainerStyle = {
        marginLeft: isTablet && showMenu ? '225px' : '0',
        transition: 'margin-left 0.2s ease-in-out'
    };
    const sessionUser = useSelector(state => state.session.user);
    return (
        <>
            <h1>Sell(er Dashboard) for {sessionUser.username}</h1>
            <div>Purge your plants and plant babies on Plantera, and get paid!</div>
            <br />
            <div className="sellerContainer">
                <Menu sessionUser={sessionUser} />
                <div style={sellerContainerStyle} className="sellerRightContainer">
                    <h2>Manage Orders</h2>
                    {!sessionUser ? (
                        <ErrorHandling />
                    ) : (
                        <div className="manageListingsSection">
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ManageOrders
