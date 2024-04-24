import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchProfile } from "../../store/user";
import './User.css';

function UserProfile() {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user[userId])
    const sessionUser = useSelector(state => state.session.user)
    console.log(sessionUser.id);
    const memberSince = (createdAt) => {
        const newDate = new Date(createdAt)
        return newDate.toLocaleString('default', { month: 'long', year: 'numeric' })
    }

    const lastInitial = (lastName) => {
        let last = lastName.charAt(0)
        return last + "."
    }

    console.log("UZAH", user);
    useEffect(() => {
        dispatch(fetchProfile(userId));
    }, [dispatch, userId])
    return (user &&
        <>
            <div className="userProfilePageContainer">
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
                <div className="userProfileInfo">
                    <div className="username">
                        <h1>{user.username}</h1>
                        {sessionUser?.id === user.id &&
                            <button onClick={() => navigate(`/user/${userId}/editprofile`)}>Edit Profile</button>
                        }
                    </div>

                    <div className="name">
                        <span style={{ fontWeight: "800" }}>Name:</span>
                        <div>{user.firstName} {user.lastName && lastInitial(user.lastName)}</div>
                    </div>

                    <div className="memberSince">
                        <span style={{ fontWeight: "800" }}>Member Since:</span>
                        <div>
                            {user.createdAt && memberSince(user.createdAt)}
                        </div>
                    </div>

                    {user.city && (
                        <div className="location">
                            <span style={{ fontWeight: "800" }}>Location:</span>
                            <div>
                                {user.city}, {user.state}
                            </div>
                        </div>
                    )}

                    {user.favoritePlant && user.favoritePlant !== "undefined" && (
                        <div className="favePlant">
                            <span style={{ fontWeight: "800" }}>Favorite Plant:</span>
                            <div>
                                {user.favoritePlant}
                            </div>
                        </div>
                    )}

                    {user.bio && (
                        <div className="bio">
                            <span style={{ fontWeight: "800" }}>Bio:</span>
                            <div>
                                {user.bio}
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </>
    )
}

export default UserProfile;
