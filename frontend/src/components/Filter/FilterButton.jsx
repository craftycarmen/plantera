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
    const [potSize, setPotSize] = useState(undefined)
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
        if (customMinPrice && customMaxPrice && customMinPrice > customMaxPrice) errs.customMinPrice = "Minimum price must be less than maximum price"

        setErrors(errs)
    }, [customMinPrice, customMaxPrice])

    const handlePriceChange = (option) => {
        setSelectedPrice(option);
        const { minPrice: newMinPrice, maxPrice: newMaxPrice } = option.value;
        setErrors();
        setMinPrice(option.value.minPrice);
        setMaxPrice(option.value.maxPrice);
        const filters = { minPrice: newMinPrice, maxPrice: newMaxPrice };
        dispatch(fetchListingResults(searchTerm, filters));
    }

    const handleCustomApply = (e) => {
        e.preventDefault()
        // const { minPrice: newMinPrice, maxPrice: newMaxPrice } = option.value;
        if (customMinPrice !== undefined && customMaxPrice !== undefined && customMinPrice > customMaxPrice) {
            setErrors({ customMinPrice: "Minimum price must be less than maximum price" })
            return;
        }
        setSelectedPrice({ name: "Custom" });
        setErrors();
        setMinPrice(customMinPrice);
        setMaxPrice(customMaxPrice);
        const filters = { minPrice: customMinPrice, maxPrice: customMaxPrice };
        dispatch(fetchListingResults(searchTerm, filters));
    }

    const potSizeOptions = [
        {
            name: "Any",
            value: {
                potSize: "all"
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
    const handlePotSize = () => {
        const filters = { potSize: potSize }
    }

    const fetchListings = useCallback(() => {
        const filters = { minPrice, maxPrice, potSize }
        dispatch(fetchListingResults(searchTerm, filters))
    }, [dispatch, searchTerm, minPrice, maxPrice, potSize])

    useEffect(() => {
        if (Object.keys(selectedPrice).length !== 0) fetchListings()
    }, [fetchListings, selectedPrice, minPrice, maxPrice])

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
                        <div>
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

                                <div className="customPrice">
                                    <span>$</span><input
                                        className="filterInputBox"
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={customMinPrice || ""}
                                        onChange={(e) => setCustomMinPrice(e.target.value)}
                                    /><span>&nbsp;—&nbsp;</span>
                                    <span>$</span><input
                                        className="filterInputBox"
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={customMaxPrice || ""}
                                        onChange={(e) => setCustomMaxPrice(e.target.value)}
                                    />
                                    <button
                                        disabled={errors && !!Object.values(errors)?.length
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
                                    <button key={size.name} onClick={handlePotSize}>{size.name}</button>
                                ))}
                                {/* <button onClick={handlePotSize}>Any</button>
                                <button onClick={handlePotSize}>2&#34;</button>
                                <button onClick={handlePotSize}>3&#34;</button>
                                <button onClick={handlePotSize}>4&#34;</button>
                                <button onClick={handlePotSize}>5&#34;</button>
                                <button onClick={handlePotSize}>6&#34;</button>
                                <button onClick={handlePotSize}>7&#34;</button>
                                <button onClick={handlePotSize}>8&#34;</button>
                                <button onClick={handlePotSize}>9&#34;</button>
                                <button onClick={handlePotSize}>10&#34;</button>
                                <button onClick={handlePotSize}>11&#34;</button>
                                <button onClick={handlePotSize}>12&#34;</button> */}
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default FilterButton
