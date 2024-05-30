import { useRef, useEffect } from "react";
import './SortListingsButton.css';

function SortListingsButton({ handleSort, showSortMenu, toggleSortMenu, currentSortOrder }) {

    const ulRef = useRef();

    useEffect(() => {
        if (!showSortMenu || !ulRef.current) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                toggleSortMenu();
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showSortMenu, toggleSortMenu]);

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'aToZ', label: 'Plant Name: A to Z' },
        { value: 'zToA', label: 'Plant Name: Z to A' },
        { value: 'lowToHigh', label: 'Price: Low to High' },
        { value: 'highToLow', label: 'Price: High to Low' }
    ];

    const ulClassName = "sort-dropdown" + (showSortMenu ? "" : " hidden");

    return (
        <div className="sortButtonWrapper">
            <span className="sortButton" onClick={(e) => {
                e.stopPropagation();
                toggleSortMenu();
            }}>
                <i className="fa-solid fa-sort" /> Sort
            </span>
            <div className="outerSortWrapper">
                {showSortMenu && (
                    <div className={ulClassName} ref={ulRef}>
                        {sortOptions.map((option) => (
                            <a key={option.value}
                                onClick={() => {
                                    handleSort(option.value);
                                    toggleSortMenu();
                                }}

                                className={option.value === currentSortOrder ? "inactiveSortOption" : ""}
                            >
                                {currentSortOrder === option.value && <i className="fa-solid fa-check" style={{ marginRight: "5px" }} />}
                                {option.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SortListingsButton;
