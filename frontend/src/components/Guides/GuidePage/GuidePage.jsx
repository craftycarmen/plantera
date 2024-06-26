import { useDispatch, useSelector } from "react-redux";
import { fetchOneGuide } from "../../../store/guides";
import { useEffect } from "react";
import './GuidePage.css';
import { Link, useParams } from "react-router-dom";
import parse from 'html-react-parser';
import { titleCase } from "../../../../utils";
import Error404 from "../../ErrorHandling/Error404";

function GuidePage({ guideId: propsGuideId }) {
    const { guideId: paramsGuideId } = useParams();
    const guideId = propsGuideId || paramsGuideId;
    const dispatch = useDispatch();
    const guide = useSelector(state => (state.guides[guideId]));
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(fetchOneGuide(guideId))
    }, [dispatch, guideId]);

    return (
        <>
            {guide ? (
                <>
                    <h3><Link to="/">Home</Link>&nbsp;&nbsp;<i className="fa-solid fa-angle-right" style={{ fontSize: "small" }} />&nbsp;&nbsp;<Link to="/guides">Inspire</Link>&nbsp;&nbsp;<i className="fa-solid fa-angle-right" style={{ fontSize: "small" }} />&nbsp;&nbsp;{guide.title}</h3>
                    <div className="guidePageContainer">
                        <div className="guidePageHeader">
                            <h1>{guide.title && titleCase(guide.title)}</h1>
                            <div>by <Link to={`/user/${guide.Author?.id}`}>{guide.Author?.username}</Link></div>
                            <br />
                            <h3>{guide.description}</h3>
                        </div>
                        <img
                            className="guidePageImage"
                            src={guide.GuideImages?.[0].url}
                        />
                        <div>{parse(guide.content)}</div>
                        {sessionUser?.id === guide.Author?.id &&
                            <Link to={`/guides/${guide.id}/edit`}><button style={{ width: "fit-content" }}>Edit Guide</button></Link>}
                    </div>
                </>
            ) : (
                <Error404 type="Guide" />
            )}

        </>
    )
}

export default GuidePage
