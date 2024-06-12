import { useState, useRef, useEffect, useCallback } from "react";
import './Filter.css'
import { useDispatch } from "react-redux";
import { fetchListingResults } from "../../store/search";

function FilterButton({ searchTerm, onFilterToggle, onFilterChange }) {
    const dispatch = useDispatch()
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const [minPrice, setMinPrice] = useState(undefined)
    const [maxPrice, setMaxPrice] = useState(undefined)
    const [potSize, setPotSize] = useState([])
    const [potSizeButtonClicked, setPotSizeButtonClicked] = useState({})
    const [customMinPrice, setCustomMinPrice] = useState(undefined);
    const [customMaxPrice, setCustomMaxPrice] = useState(undefined);
    const [selectedPrice, setSelectedPrice] = useState({})
    const [errors, setErrors] = useState({})

    const priceOptions = [
        {
            name: "Any",
            value: {
                minPrice: undefined,
                maxPrice: undefined
            }
        },
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
            name: ""
        }
    ]

    useEffect(() => {
        const errs = {};

        const min = Number(customMinPrice);
        const max = Number(customMaxPrice);

        if (
            // customMinPrice !== undefined &&
            // customMaxPrice !== undefined &&
            // customMinPrice !== "" &&
            // customMaxPrice !== "" &&
            // customMinPrice >= 0 &&
            // customMaxPrice >= 0 &&
            // customMinPrice >= customMaxPrice
            !isNaN(min) &&
            !isNaN(max) &&
            min >= 0 &&
            max >= 0 &&
            min >= max
        ) {
            errs.customMinPrice = "Minimum price must be less than maximum price";
        } else {
            setErrors({});
        }

        setErrors(errs);
    }, [customMinPrice, customMaxPrice]);


    const handlePriceChange = (option) => {
        setSelectedPrice(option);
        let newMinPrice, newMaxPrice;

        if (option.value) {
            newMinPrice = option.value.minPrice;
            newMaxPrice = option.value.maxPrice;
        } else {
            newMinPrice = undefined;
            newMaxPrice = undefined;
        }

        setCustomMinPrice(undefined);
        setCustomMaxPrice(undefined);

        setErrors();
        setMinPrice(newMinPrice);
        setMaxPrice(newMaxPrice);
        const filters = { minPrice: newMinPrice, maxPrice: newMaxPrice, potSize };
        dispatch(fetchListingResults(searchTerm, filters));
        if (onFilterChange) onFilterChange(filters);
    }

    const handleCustomApply = (e) => {
        e.preventDefault()
        // const { minPrice: newMinPrice, maxPrice: newMaxPrice } = option.value;

        const min = Number(customMinPrice);
        const max = Number(customMaxPrice);

        if (
            // customMinPrice !== undefined &&
            // customMaxPrice !== undefined &&
            // customMinPrice !== "" &&
            // customMaxPrice !== "" &&
            // customMinPrice >= 0 &&
            // customMaxPrice >= 0 &&
            // customMinPrice >= customMaxPrice
            !isNaN(min) &&
            !isNaN(max) &&
            min >= 0 &&
            max >= 0 &&
            min >= max
        ) {
            setErrors({ customMinPrice: "Minimum price must be less than maximum price" })
            return;
        }

        setSelectedPrice(priceOptions.find(option => option.name === ''))
        setErrors({});
        setMinPrice(min);
        setMaxPrice(max);
        const filters = { minPrice: min, maxPrice: max };
        dispatch(fetchListingResults(searchTerm, filters));
        if (onFilterChange) onFilterChange(filters);
    }

    const potSizeOptions = [
        {
            name: "Any",
            value: {
                potSize: 0
            }
        },
        {
            name: '2"',
            value: {
                potSize: 2
            }
        },
        {
            name: '3"',
            value: {
                potSize: 3
            }
        },
        {
            name: '4"',
            value: {
                potSize: 4
            }
        },
        {
            name: '5"',
            value: {
                potSize: 5
            }
        },
        {
            name: '6"',
            value: {
                potSize: 6
            }
        },
        {
            name: '7"',
            value: {
                potSize: 7
            }
        },
        {
            name: '8"',
            value: {
                potSize: 8
            }
        },
        {
            name: '9"',
            value: {
                potSize: 9
            }
        },
        {
            name: '10"',
            value: {
                potSize: 10
            }
        },
        {
            name: '11"',
            value: {
                potSize: 11
            }
        },
        {
            name: '12"',
            value: {
                potSize: 12
            }
        },
    ]

    const handlePotSize = (value, e) => {
        e.preventDefault();
        const updatedPotSize = Array.isArray(potSize) ? [...potSize] : [];

        if (!updatedPotSize.includes(value)) {
            updatedPotSize.push(value)
        } else {
            const index = updatedPotSize.indexOf(value);
            updatedPotSize.splice(index, 1);
        }
        setPotSize(updatedPotSize)
        setPotSizeButtonClicked(prevState => ({ ...prevState, [value]: !prevState[value] }))

        const filters = { minPrice, maxPrice }
        if (updatedPotSize.length > 0) {
            filters.potSize = updatedPotSize
        }
        dispatch(fetchListingResults(searchTerm, filters))
        if (onFilterChange) onFilterChange(filters);
    }


    const fetchListings = useCallback(() => {
        let filters = { minPrice, maxPrice }
        if (potSize?.length > 0) {
            filters = { ...filters, potSize }
        }
        dispatch(fetchListingResults(searchTerm, filters))
    }, [dispatch, searchTerm, minPrice, maxPrice, potSize])

    useEffect(() => {
        if (Object.keys(selectedPrice).length !== 0) fetchListings()
    }, [fetchListings, selectedPrice, minPrice, maxPrice, potSize])

    useEffect(() => {
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setPotSize(undefined);
        setSelectedPrice({});
    }, [searchTerm]);

    const handleClear = (e) => {
        e.preventDefault();
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setPotSize(undefined);
        setSelectedPrice({});
        setPotSizeButtonClicked(false);
        dispatch(fetchListingResults(searchTerm, null))
    }

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
        onFilterToggle()
    }

    console.log("PRICING", customMinPrice, customMaxPrice);
    return (
        <div className="filterButtonWrapper">
            <span className="filterButton" onClick={toggleMenu}>
                <i className="fa-solid fa-filter" /> Filter
            </span>
            <div className="outerFilterWrapper">
                {showMenu && (
                    <form className="filter-dropdown" ref={ulRef}>
                        <div>
                            <h3>Price</h3>
                            <div className="filterRange">
                                {priceOptions.map((range, index) => (
                                    <label key={range.name} className="priceOptions">

                                        <input
                                            key={index}
                                            name="priceRange"
                                            value={range.value}
                                            checked={
                                                (Object.keys(selectedPrice).length !== 0 &&
                                                    selectedPrice.value &&
                                                    JSON.stringify(range.value) === JSON.stringify(selectedPrice.value)) ||
                                                (selectedPrice.name === '' &&
                                                    range.name === '')
                                            }

                                            type="radio"
                                            onChange={() => handlePriceChange(range)}
                                            onClick={fetchListings}

                                        />
                                        <span>{range.name}</span>

                                    </label>
                                ))}

                                <div className="customPrice">
                                    <span>$</span><input
                                        className="filterInputBox"
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={customMinPrice === "" ? "" : customMinPrice || ""}
                                        onChange={(e) => setCustomMinPrice(e.target.value === "" ? undefined : Number(e.target.value))}
                                    /><span>&nbsp;—&nbsp;</span>
                                    <span>$</span><input
                                        className="filterInputBox"
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={customMaxPrice === "" ? "" : customMaxPrice || ""}
                                        onChange={(e) => setCustomMaxPrice(e.target.value === "" ? undefined : Number(e.target.value))}
                                    />
                                    <button
                                        disabled={(!customMinPrice && !customMaxPrice) || errors && !!Object.values(errors)?.length
                                        }
                                        onClick={(e) => handleCustomApply(e)}><i className="fa-solid fa-check" /></button>
                                </div>


                                <div className="error">{errors?.customMinPrice &&
                                    <><i className="fa-solid fa-circle-exclamation" /> {errors.customMinPrice}</>}</div>
                            </div>
                        </div>
                        <br />
                        <div className="potFilter">
                            <h3>Pot Size</h3>
                            <div className="potSize">
                                {potSizeOptions.map((size) => (
                                    <button className={potSizeButtonClicked[size.value.potSize] ? "clickedButton" : ""}
                                        key={size.name}
                                        onClick={(e) => handlePotSize(size.value.potSize, e)}
                                    >{size.name}</button>
                                ))}
                            </div>
                        </div>
                        <br />
                        <button className="clearFilters" onClick={(e) => handleClear(e)}>Clear Filters</button>
                    </form>
                )}
            </div>
        </div >
    )
}

export default FilterButton
