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
    const [potSize, setPotSize] = useState([])
    const [customMinPrice, setCustomMinPrice] = useState(undefined);
    const [customMaxPrice, setCustomMaxPrice] = useState(undefined);
    const [selectedPrice, setSelectedPrice] = useState({})
    const [errors, setErrors] = useState({})

    // const customPrice = () => {
    //     return (
    //         <>
    //             <div className="customPrice">
    //                 <span>$</span><input
    //                     className="filterInputBox"
    //                     type="number"
    //                     step="1"
    //                     min="0"
    //                     value={customMinPrice || ""}
    //                     onChange={(e) => setCustomMinPrice(e.target.value)}
    //                 /><span>&nbsp;—&nbsp;</span>
    //                 <span>$</span><input
    //                     className="filterInputBox"
    //                     type="number"
    //                     step="1"
    //                     min="0"
    //                     value={customMaxPrice || ""}
    //                     onChange={(e) => setCustomMaxPrice(e.target.value)}
    //                 />
    //             </div>
    //         </>
    //     )
    // }

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
            name: "Custom"
        }
    ]

    useEffect(() => {
        const errs = {};

        if (
            customMinPrice !== undefined &&
            customMaxPrice !== undefined &&
            customMinPrice !== "" &&
            customMaxPrice !== "" &&
            customMinPrice >= 0 &&
            customMaxPrice >= 0 &&
            customMinPrice >= customMaxPrice
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
        setErrors();
        setMinPrice(newMinPrice);
        setMaxPrice(newMaxPrice);
        const filters = { minPrice: newMinPrice, maxPrice: newMaxPrice, potSize };
        dispatch(fetchListingResults(searchTerm, filters));
    }

    const handleCustomApply = (e) => {
        e.preventDefault()
        // const { minPrice: newMinPrice, maxPrice: newMaxPrice } = option.value;
        if (customMinPrice !== undefined &&
            customMaxPrice !== undefined &&
            customMinPrice !== "" &&
            customMaxPrice !== "" &&
            customMinPrice >= 0 &&
            customMaxPrice >= 0 &&
            customMinPrice >= customMaxPrice) {
            setErrors({ customMinPrice: "Minimum price must be less than maximum price" })
            return;
        }

        setSelectedPrice({});
        setErrors({});
        setMinPrice(customMinPrice);
        setMaxPrice(customMaxPrice);
        const filters = { minPrice: customMinPrice, maxPrice: customMaxPrice };
        dispatch(fetchListingResults(searchTerm, filters));
    }

    const potSizeOptions = [
        {
            name: "Any",
            value: {
                potSize: "any"
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
        console.log("Pot size clicked:", value);
        const updatedPotSize = Array.isArray(potSize) ? [...potSize] : [];

        if (!updatedPotSize.includes(value)) {
            updatedPotSize.push(value)
        } else {
            const index = updatedPotSize.indexOf(value);
            updatedPotSize.splice(index, 1);
        }
        setPotSize(updatedPotSize)
        console.log("Updated pot size:", updatedPotSize);

        const filters = { minPrice, maxPrice }
        if (updatedPotSize.length > 0) {
            filters.potSize = updatedPotSize
        }
        dispatch(fetchListingResults(searchTerm, filters))

    }


    const fetchListings = useCallback(() => {
        let filters = { minPrice, maxPrice }
        if (potSize.length > 0) {
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


    // const closeMenu = () => setShowMenu(false);

    return (
        <div className="filterButtonWrapper">
            <span onClick={toggleMenu}>
                <i className="fa-solid fa-filter" /> Filter
            </span>
            <div>
                {showMenu && (
                    <form className="filter-dropdown" ref={ulRef}>
                        <div>
                            <div>Price</div>
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
                                                (selectedPrice.name === 'Custom' &&
                                                    range.name === 'Custom')
                                            }

                                            type="radio"
                                            onChange={() => handlePriceChange(range)}
                                            onClick={fetchListings}

                                        />
                                        <span style={{ marginTop: "8px" }}>{range.name}</span>

                                    </label>
                                ))}

                                <div className="customPrice">
                                    <span>$</span><input
                                        className="filterInputBox"
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={customMinPrice === "" ? "" : customMinPrice || ""}
                                        onChange={(e) => setCustomMinPrice(e.target.value === "" ? undefined : e.target.value)}
                                    /><span>&nbsp;—&nbsp;</span>
                                    <span>$</span><input
                                        className="filterInputBox"
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={customMaxPrice === "" ? "" : customMaxPrice || ""}
                                        onChange={(e) => setCustomMaxPrice(e.target.value === "" ? undefined : e.target.value)}
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
                        <div className="verticalLine"></div>
                        <div>
                            <div>Pot Size</div>
                            <div className="potSize">
                                {potSizeOptions.map((size) => (
                                    <button
                                        key={size.name}
                                        onClick={(e) => {
                                            handlePotSize(size.value.potSize, e);
                                        }
                                        }
                                    >{size.name}</button>
                                ))}
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div >
    )
}

export default FilterButton
