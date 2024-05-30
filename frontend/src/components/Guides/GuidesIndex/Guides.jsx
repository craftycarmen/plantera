import { useDispatch, useSelector } from "react-redux";
import './Guides.css';
import { useEffect, useState, useCallback, useRef } from "react";
import { fetchAllGuides } from "../../../store/guides";
import { Link } from "react-router-dom";

function Guides() {
    const dispatch = useDispatch();
    let guides = Object.values(useSelector((state) => state.guides))
    const [sortOrder, setSortOrder] = useState('newest');
    const ulRef = useRef();
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth >= 481);

    const sortedGuides = (guides) => {
        switch (sortOrder) {
            case 'aToZ':
                return guides.sort((a, b) => a.title.localeCompare(b.title));
            case 'zToA':
                return guides.sort((a, b) => b.title.localeCompare(a.title));
            case 'oldest':
                return guides.sort((a, b) => (a.id - b.id));
            case 'newest':
            default:
                return guides.sort((a, b) => (b.id - a.id))

        }
    }

    guides = sortedGuides(guides)

    const getColumns = (width) => {
        if (width >= 1425) return 8;
        if (width <= 1424 && width >= 1190) return 3;
        if (width >= 992) return 4;
        if (width >= 768) return 4;
        return 4;
    }
    const [columns, setColumns] = useState(getColumns(window.innerWidth));
    const [displayCount, setDisplayCount] = useState(columns);


    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth <= 480);
        setIsTablet(window.innerWidth <= 1024 && window.innerWidth >= 481);

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

    const toggleSortMenu = useCallback(() => {
        setShowSortMenu(prevState => !prevState);
    }, []);

    const handleSort = (order) => {
        setSortOrder(order);
        setShowSortMenu(!showSortMenu);
    }

    useEffect(() => {
        if (!showSortMenu || !ulRef.current) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                toggleSortMenu();
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showSortMenu, toggleSortMenu]);

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'aToZ', label: 'Title: A to Z' },
        { value: 'zToA', label: 'Title: Z to A' }
    ];

    const displayedGuides = guides.slice(0, displayCount);

    const guidesContainerStyle = {
        marginRight: (!isTablet && !isMobile) && showSortMenu ? '250px' : '0',
        transition: 'margin-right 0.2s ease-in-out'
    };

    const handleShowMore = () => {
        const newCount = calculateDisplayCount(displayCount + columns, columns);
        setDisplayCount(newCount);
    };


    useEffect(() => {
        dispatch(fetchAllGuides())
    }, [dispatch]);

    const ulClassName = "sortGuides-dropdown" + (showSortMenu ? "" : " hidden");

    return (guides &&
        <>

            <h1>Inspire</h1>
            <div>Get plant-spired with these guides written by the Plantera community!</div>
            <br />
            <div className="sortGuidesContainer">
                <div className="sortGuidesButtonWrapper">
                    <span className="sortGuidesButton" onClick={(e) => {
                        e.stopPropagation();
                        toggleSortMenu();
                    }}>
                        <i className="fa-solid fa-sort" /> Sort
                    </span>
                    <div className="outerSortGuidesWrapper">
                        {showSortMenu && (
                            <div className={ulClassName} ref={ulRef}>
                                {sortOptions.map((option) => (
                                    <a key={option.value}
                                        onClick={() => {
                                            handleSort(option.value);
                                            toggleSortMenu();
                                        }}

                                        className={option.value === sortOrder ? "inactiveSortOption" : ""}
                                    >
                                        {sortOrder === option.value && <i className="fa-solid fa-check" style={{ marginRight: "5px" }} />}
                                        {option.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="guidesContainer" style={guidesContainerStyle}>
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
            <div className="showMoreDiv" style={guidesContainerStyle}>
                {guides.length > displayCount && (
                    <button onClick={handleShowMore} style={{ width: "fit-content" }}>Show More</button>
                )}
            </div>

        </>
    )
}

export default Guides;
