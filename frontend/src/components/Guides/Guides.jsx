import { useDispatch, useSelector } from "react-redux";
import './Guides.css';
import { useEffect } from "react";
import { fetchAllGuides } from "../../store/guides";
import { Link } from "react-router-dom";

function Guides() {
    const dispatch = useDispatch();
    const guides = Object.values(useSelector((state) => state.guides))
        .sort((a, b) => b.id - a.id);
    console.log(guides);
    useEffect(() => {
        dispatch(fetchAllGuides())
    }, [dispatch]);

    return (guides &&
        <>
            <h1>Inspire</h1>
            <div>Get plant-spired with these guides written by the Plantera community!</div>
            <br />
            <div className="guidesContainer">
                {guides.map((guide) => (
                    <div key={guide.id}>
                        <Link to={`/guides/${guide.id}`}>
                            <div className="guideImageContainer">
                                <img
                                    className="guideImage"
                                    src={guide.GuideImages?.[0]?.url} />
                                <div className="guideInfo">
                                    <h2>{guide.title}</h2>
                                    <div>by {guide.Author?.username}</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div >
        </>
    )
}

export default Guides;
