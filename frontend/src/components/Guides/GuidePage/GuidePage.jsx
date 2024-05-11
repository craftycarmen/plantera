import { useDispatch, useSelector } from "react-redux";
import { fetchOneGuide } from "../../../store/guides";
import { useEffect } from "react";
import './GuidePage.css';
import { Link, useParams } from "react-router-dom";

function GuidePage() {
    const { guideId } = useParams();
    const dispatch = useDispatch();
    const guide = useSelector(state => (state.guides[guideId]));

    useEffect(() => {
        dispatch(fetchOneGuide())
    }, [dispatch]);

    return (guide &&
        <>
            <h3><Link to="/">Home</Link>&nbsp;&nbsp;<i className="fa-solid fa-angle-right" style={{ fontSize: "small" }} />&nbsp;&nbsp;<Link to="/guides">Inspire</Link>&nbsp;&nbsp;<i className="fa-solid fa-angle-right" style={{ fontSize: "small" }} />&nbsp;&nbsp;{guide.title}</h3>
            <div className="guidePageContainer">
                <div className="guidePageHeader">
                    <h1>{guide.title}</h1>
                    <div>by <Link to={`/user/${guide.Author?.id}`}>{guide.Author?.username}</Link></div>
                    <br />
                    <h3>{guide.description}</h3>
                </div>
                <img
                    className="guidePageImage"
                    src={guide.GuideImages?.[0].url}
                />
                <div>{guide.content}</div>
            </div>
        </>
    )
}

export default GuidePage