import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProfile } from "../../store/user";
import './User.css';
import ProfileImage from "./ProfileImage";
import Error404 from "../ErrorHandling/Error404";
import { monthYear } from "../../../utils";

function UserProfile() {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user[userId]?.User)
    const sessionUser = useSelector(state => state.session.user)
    const [loading, setLoading] = useState(false);
    // const memberSince = (createdAt) => {
    //     const newDate = new Date(createdAt)
    //     return newDate.toLocaleString('default', { month: 'long', year: 'numeric' })
    // }

    const lastInitial = (lastName) => {
        let last = lastName.charAt(0)
        return last + "."
    }

    useEffect(() => {
        setLoading(true)
        dispatch(fetchProfile(userId)).then(() => setTimeout(() => {
            setLoading(false);
        }, 500))
    }, [dispatch, userId])
    return (
        <>{loading ? (
            <div className="dots"></div>
        ) : (
            <>
                {user ? (
                    <div className="userProfilePageContainer">
                        <ProfileImage userId={userId} />
                        <div className="username">
                            <h1>{user.username}</h1>
                            {sessionUser?.id === user.id &&
                                <button onClick={() => navigate(`/user/${userId}/editprofile`)}>Edit Profile</button>
                            }
                        </div>
                        <div className="userProfileInfo">

                            <div className="name">
                                <span style={{ fontWeight: "800" }}>Name:</span>
                                <div>{user.firstName} {user.lastName && lastInitial(user.lastName)}</div>
                            </div>

                            <div className="memberSince">
                                <span style={{ fontWeight: "800" }}>Member Since:</span>
                                <div>
                                    {user.createdAt && monthYear(user.createdAt)}
                                </div>
                            </div>

                            {user.city && user.state && (
                                <div className="location">
                                    <span style={{ fontWeight: "800" }}>Location:</span>
                                    <div>
                                        {user.city}, {user.state}
                                    </div>
                                </div>
                            )}

                            {user.favoritePlant && (
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
                ) : (
                    <Error404 type="User" />
                )}
            </>
        )}

        </>
    )
}

export default UserProfile;
