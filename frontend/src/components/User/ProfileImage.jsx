import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProfile } from "../../store/user";
import './User.css';

function ProfileImage({ userId }) {
    const dispatch = useDispatch();

    const user = useSelector(state => state.user[userId])


    useEffect(() => {
        dispatch(fetchProfile(userId));
    }, [dispatch, userId])
    return (user &&
        <>

            <div className="userProfileLeft">
                <div className="userImageContainer">
                    {user.UserImages?.[0] &&
                        <img className="userImage" src={user.UserImages?.[0]?.url} />
                    }
                </div>
                {user.accountType === "seller" && (
                    <div className="profileShop">
                        <Link to={`/user/${userId}`}>View Profile</Link> | <Link to={`/user/${userId}/shop`}>View Shop</Link>
                    </div>
                )}
            </div>

        </>
    )
}

export default ProfileImage;
