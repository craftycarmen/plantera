import { useState, useRef, useEffect, useCallback } from "react";
import './Filter.css'
import { useDispatch, useSelector } from "react-redux";
import { fetchListingResults } from "../../store/search";

function FilterButton({ searchTerm }) {
    const dispatch = useDispatch()
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const listings = useSelector(state => state.listings)
    const [minPrice, setMinPrice] = useState(undefined)
    const [maxPrice, setMaxPrice] = useState(undefined)
    const [minPotSize, setMinPotSize] = useState(undefined)
    const [maxPotSize, setMaxPotSize] = useState(undefined)
    const [selectedPrice, setSelectedPrice] = useState({})

    const priceOptions = [
        {
            name: "Under $25",
            value: {
                maxPrice: 25
            }
        },
        {
            name: "$25-$50",
            value: {
                minPrice: 25,
                maxPrice: 50
            }
        },
        {
            name: "$50-$100",
            value: {
                minPrice: 50,
                maxPrice: 100
            }
        },
        {
            name: "$100 and above",
            value: {
                minPrice: 100
            }
        },
        // { name: "Custom", value: "Custom" }
    ]

    const handlePriceChange = (option) => {
        setSelectedPrice(option);
        setMinPrice(option.value.minPrice);
        setMaxPrice(option.value.maxPrice);
        const filters = { minPrice: option.value.minPrice, maxPrice: option.value.maxPrice };
        dispatch(fetchListingResults(searchTerm, filters));
    }

    const fetchListings = useCallback(() => {
        const filters = { minPrice, maxPrice, minPotSize, maxPotSize }
        dispatch(fetchListingResults(searchTerm, filters))
    }, [dispatch, searchTerm, minPrice, maxPrice, minPotSize, maxPotSize])

    useEffect(() => {
        if (Object.keys(selectedPrice).length !== 0) fetchListings()
    }, [fetchListings, selectedPrice, minPrice, maxPrice])

    // useEffect(() => {
    //     if (selectedPrice) {
    //         const { minPrice, maxPrice } = selectedPrice.value;

    //     }
    //     // const fetchListings = () => {
    //     dispatch(fetchListingResults(searchTerm, minPrice, maxPrice, minPotSize, maxPotSize))
    //     // }

    // }, [dispatch, searchTerm, minPrice, maxPrice, minPotSize, maxPotSize])

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

    // const handleFilterChange = () => {

    // }
    // const closeMenu = () => setShowMenu(false);

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
                            {/* <span>Min</span>
                            <input
                                className="filterInputBox"
                                type="number"
                                step="1"
                                min="0"
                                value={minPrice}
                                onChange={(e) => {
                                    console.log("Min Price:", e.target.value);
                                    setMinPrice(e.target.value);
                                    handleFilterChange();
                                }}
                            />
                            <span>Max</span>
                            <input
                                className="filterInputBox"
                                type="number"
                                step="1"
                                min="0"
                                value={maxPrice}
                                onChange={(e) => { setMaxPrice(e.target.value); handleFilterChange(); }}
                            /> */}

                            {priceOptions.map((range, index) => (
                                <label key={range.name} className="priceOptions">

                                    <input
                                        key={index}
                                        name="priceRange"
                                        value={range.value}
                                        checked={selectedPrice && JSON.stringify(range.value) === JSON.stringify(selectedPrice.value)}
                                        type="radio"
                                        onChange={() => handlePriceChange(range)}
                                        onClick={fetchListings}
                                    />
                                    <span style={{ marginTop: "5px" }}>{range.name}</span>
                                </label>
                            ))}

                        </div>
                        {/* <div>Pot Size</div>
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
                        </div> */}
                    </form>
                )}
            </div>
        </div>
    )
}

export default FilterButton
