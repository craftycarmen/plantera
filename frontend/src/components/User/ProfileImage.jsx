import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProfile } from "../../store/user";
import './User.css';

function ProfileImage({ userId }) {
    const dispatch = useDispatch();

    const user = useSelector(state => state.user[userId]?.User)
    const guides = useSelector(state => state.user[userId]?.Guides)

    useEffect(() => {
        dispatch(fetchProfile(userId))
        // .then(() => dispatch(fetchShop(userId)))
    }, [dispatch, userId])
    return (user &&
        <>

            <div className="userProfileLeft">
                <div className="userImageContainer">
                    {user.UserImages?.[0] &&
                        <>
                            <img className="userImage" src={user.UserImages?.[0]?.url} />
                            <div className="userImage-outline"></div>
                        </>

                    }
                </div>

                <div className="profileShop">
                    <span><Link to={`/user/${userId}`}>Profile</Link></span>
                    {user.accountType === "seller" && (<span><Link to={`/user/${userId}/shop`}>Shop</Link></span>)}
                    {guides?.length > 0 && <span><Link to={`/user/${userId}/guides`}>Guides</Link></span>}
                </div>
            </div >

        </>
    )
}

export default ProfileImage;
