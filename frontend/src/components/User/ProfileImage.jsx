import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProfile } from "../../store/user";
import './User.css';

function ProfileImage({ userId }) {
    const dispatch = useDispatch();

    const user = useSelector(state => state.user[userId])


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
                {user.accountType === "seller" && (
                    <div className="profileShop">
                        <Link to={`/user/${userId}`}>Profile</Link>&nbsp;&nbsp;&nbsp;
                        <Link to={`/user/${userId}/shop`}>Shop</Link>&nbsp;&nbsp;&nbsp;
                        Guides
                    </div>
                )}
            </div>

        </>
    )
}

export default ProfileImage;
