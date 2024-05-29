import { useDispatch, useSelector } from "react-redux";
import './Guides.css';
import { useEffect, useState, useCallback } from "react";
import { fetchAllGuides } from "../../../store/guides";
import { Link } from "react-router-dom";

function Guides() {
    const dispatch = useDispatch();
    const guides = Object.values(useSelector((state) => state.guides))
        .sort((a, b) => b.id - a.id);


    const getColumns = (width) => {
        if (width >= 1425) return 8;
        if (width <= 1424 && width >= 1190) return 3;
        if (width >= 992) return 4;
        if (width >= 768) return 4;
        return 4;
    }
    const [columns, setColumns] = useState(getColumns(window.innerWidth));
    const [displayCount, setDisplayCount] = useState(columns * 2);


    const handleResize = useCallback(() => {
        const newColumns = getColumns(window.innerWidth);
        setColumns(newColumns);
        setDisplayCount(prevCount => calculateDisplayCount(prevCount, newColumns));
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    const calculateDisplayCount = (currCount, columns) => {
        const rows = Math.ceil(currCount / columns);
        return rows * columns;
    };

    const displayedGuides = guides.slice(0, displayCount);

    const handleShowMore = () => {
        const newCount = calculateDisplayCount(displayCount + columns, columns);
        setDisplayCount(newCount);
    };


    useEffect(() => {
        dispatch(fetchAllGuides())
    }, [dispatch]);

    return (guides &&
        <>
            <div className="pageHeader">
                <h1>Inspire</h1>
                <div>Get plant-spired with these guides written by the Plantera community!</div>
            </div>
            <div className="guidesContainer">
                {displayedGuides.map((guide) => (
                    <div key={guide.id}>
                        <Link to={`/guides/${guide.id}`}>
                            <div className="guideImageContainer">
                                <div className="tape"></div>
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
            <div className="showMoreDiv">
                {guides.length > displayCount && (
                    <button onClick={handleShowMore} style={{ width: "fit-content" }}>Show More</button>
                )}
            </div>
        </>
    )
}

export default Guides;
