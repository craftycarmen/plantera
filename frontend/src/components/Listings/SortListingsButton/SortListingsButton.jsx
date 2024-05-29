import { useState } from "react";

function SortListingsButton() {

    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    }

    return (
        <div className="sortButtonWrapper">
            <span className="sortButton" onClick={toggleMenu}>
                <i className="fa-solid fa-sort" /> Sort
            </span>
            <div className="outerSortWrapper">
                {showMenu && (
                    <div>
                        <div>Newest</div>
                        <div>Oldest</div>
                        <div>Alphabetically A to Z</div>
                        <div>Alphabetically Z to A</div>
                        <div>Price Low to High</div>
                        <div>Price High to Low</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SortListingsButton
