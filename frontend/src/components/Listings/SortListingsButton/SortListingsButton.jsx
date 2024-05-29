import { useRef, useEffect } from "react";

function SortListingsButton({ handleSort, showSortMenu }) {

    const ulRef = useRef();


    useEffect(() => {
        if (!showSortMenu || !ulRef.current) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                handleSort(null); // Close the menu by setting showSortMenu to false
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showSortMenu, handleSort]);

    const toggleMenu = (e) => {
        e.stopPropagation();
        handleSort(null)
    }

    const ulClassName = "sort-dropdown" + (showSortMenu ? "" : " hidden");

    return (
        <div className="sortButtonWrapper">
            <span className="sortButton" onClick={toggleMenu}>
                <i className="fa-solid fa-sort" /> Sort
            </span>
            <div className="outerSortWrapper">
                {showSortMenu && (
                    <div className={ulClassName} ref={ulRef}>
                        <a onClick={() => handleSort('aToZ')}>Plant Name: A to Z</a>
                        <a onClick={() => handleSort('zToA')}>Plant Name: Z to A</a>
                        <a onClick={() => handleSort('lowToHigh')}>Price: Low to High</a>
                        <a onClick={() => handleSort('highToLow')}>Price: High to Low</a>
                        <a onClick={() => handleSort('newest')}>Recency: Newest First</a>
                        <a onClick={() => handleSort('oldest')}>Recency: Oldest First</a>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SortListingsButton
