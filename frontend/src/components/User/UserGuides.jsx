import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchProfile } from "../../store/user";
import ProfileImage from "./ProfileImage";

function UserGuides() {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user[userId]?.User);
    const guides = useSelector(state => state.user[userId]?.Guides);
    const sessionUser = useSelector(state => state.session.user);
    // console.log(guides);
    useEffect(() => {
        dispatch(fetchProfile(userId))
    }, [dispatch, userId])

    return (user &&
        <div className="userProfilePageContainer">
            <ProfileImage userId={userId} />
            <div className="username">
                <h1>{user.username} <i className="fa-solid fa-angle-right" style={{ fontSize: "large" }} /> Guides</h1>
                {sessionUser?.id === user.id &&
                    <button onClick={() => navigate(`/guides/current`)}>Manage Guides</button>
                }
            </div>
            <div>
                {guides.length === 0 ? (
                    <div className="numGuides">This user does not have any guides.</div>
                ) :
                    (
                        <div className="userGuidesContainer" style={{ marginTop: "20px" }}>
                            {guides.sort((a, b) => b.id - a.id).map((guide) => (
                                <div key={guide.id}>
                                    <Link to={`/guides/${guide.id}`}>
                                        <div className="userGuideImageContainer">
                                            <div className="tape"></div>
                                            <img
                                                className="userGuideImage"
                                                src={guide.GuideImages?.[0]?.url} />
                                            <div className="guideInfo">
                                                <h2>{guide.title}</h2>
                                                <div>by {user?.username}</div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                            }


                        </div >
                    )
                }
            </div>
        </div>
    )
}

export default UserGuides;
