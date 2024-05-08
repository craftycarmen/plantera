import { useState, useRef, useEffect, useCallback } from "react";
import './Filter.css'
import { useDispatch } from "react-redux";
import { fetchListingResults } from "../../store/search";

function FilterButton({ searchTerm }) {
    const dispatch = useDispatch()
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const [minPrice, setMinPrice] = useState(undefined)
    const [maxPrice, setMaxPrice] = useState(undefined)
    const [minPotSize, setMinPotSize] = useState(undefined)
    const [maxPotSize, setMaxPotSize] = useState(undefined)
    const [customMinPrice, setCustomMinPrice] = useState(undefined);
    const [customMaxPrice, setCustomMaxPrice] = useState(undefined);
    const [selectedPrice, setSelectedPrice] = useState({})
    const [errors, setErrors] = useState({})

    const customPrice = () => {
        return (<div className="customPrice">
            <span>$</span><input
                className="filterInputBox"
                type="number"
                step="1"
                min="0"
                value={customMinPrice}
                onChange={(e) => setCustomMinPrice(e.target.value)}
            /><span>&nbsp;—&nbsp;</span>
            <span>$</span><input
                className="filterInputBox"
                type="number"
                step="1"
                min="0"
                value={customMaxPrice}
                onChange={(e) => setCustomMaxPrice(e.target.value)}
            />
        </div>
        )
    }
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
        {
            name: customPrice(),
            value: {
                minPrice: customMinPrice,
                maxPrice: customMaxPrice
            }
        }
    ]

    useEffect(() => {
        const errs = {};
        if (customMinPrice && customMaxPrice && customMinPrice > customMaxPrice) errs.customMinPrice = "Minimum price must be greater than maximum price"

        setErrors(errs)
    }, [customMinPrice, customMaxPrice])

    const handlePriceChange = (option) => {
        setSelectedPrice(option);
        setErrors();
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

    useEffect(() => {
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setMinPotSize(undefined);
        setMaxPotSize(undefined);
        setSelectedPrice({});
    }, [searchTerm]);

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
                                    <span style={{ marginTop: "8px" }}>{range.name}</span>

                                </label>
                            ))}
                            <div className="error">{errors?.customMinPrice &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.customMinPrice}</>}</div>
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
