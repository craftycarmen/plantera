import { useState, useRef, useEffect } from "react";
import './Filter.css'

function FilterButton() {
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(100)
    const [minPotSize, setMinPotSize] = useState(2)
    const [maxPotSize, setMaxPotSize] = useState(12)

    useEffect(() => {
        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('click', closeMenu);
        } else {
            document.removeEventListener('click', closeMenu);
        }

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    }

    const closeMenu = () => setShowMenu(false);

    return (
        <div className="filterButtonWrapper">
            <span onClick={toggleMenu}>
                <i className="fa-solid fa-filter" /> Filter
            </span>
            <div>
                {showMenu && (
                    <form className="filter-dropdown" ref={ulRef}>
                        <div>Price</div>
                        <div className="filterRange">
                            <span>Min</span>
                            <input
                                className="filterInputBox"
                                type="number"
                                step="1"
                                min="0"
                            />
                            <span>Max</span>
                            <input
                                className="filterInputBox"
                                type="number"
                                step="1"
                                min="0"
                            />
                        </div>
                        <div>Pot Size</div>
                        <div className="filterRange">
                            <span>Min</span>
                            <input
                                className="filterInputBox"
                                type="number"
                                step="1"
                                min="2"
                                max="12"
                            />
                            <span>Max</span>
                            <input
                                className="filterInputBox"
                                type="number"
                                step="1"
                                min="2"
                                max="12"
                            />
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default FilterButton
