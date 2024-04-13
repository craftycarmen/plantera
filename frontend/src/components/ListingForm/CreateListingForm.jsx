import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { addListing, loadOneListing } from '../../store/listings';
// import { Audio } from 'react-loader-spinner'

function CreateListingForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sessionUser = useSelector(state => state.session.user);

    const [plantName, setPlantName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [potSize, setPotSize] = useState("");
    const [stockQty, setStockQty] = useState("");
    const [guideId, setGuideId] = useState("");
    const [image, setImage] = useState("");
    // const [imageLoading, setImageLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const updatePlantName = (e) => setPlantName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice = (e) => setPrice(e.target.value);
    const updatePotSize = (e) => setPotSize(e.target.value);
    const updateStockQty = (e) => setStockQty(e.target.value);
    const updateGuideId = (e) => setGuideId(e.target.value);
    const updateFile = e => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };

    useEffect(() => {

        const errs = {};

        if (!plantName) errs.plantName = '';
        if (!description) errs.description = '';
        if (!price) errs.price = '';
        if (!potSize) errs.potSize = '';
        if (!stockQty) errs.stockQty = '';
        if (plantName && plantName.length < 3 || plantName.length > 100) errs.plantName = 'Plant name must be between 3-100 characters';
        if (description && description.length < 30 || description.length > 250) errs.description = 'Description must be between 30-250 characters';
        if (price && price <= 0) errs.price = 'Price must be greater than $0';
        if (potSize && potSize < 2) errs.potSize = 'Pot size must be 2 inches or greater';
        if (stockQty && stockQty <= 0) errs.stockQty = 'Stock quantity must be greater than 0';

        setErrors(errs);
    }, [plantName, description, price, potSize, stockQty])


    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({})

        let listing = {
            sellerId: sessionUser.id,
            plantName,
            description,
            price,
            potSize,
            stockQty,
            guideId,
            image
        }

        // await dispatch(addListing(listing))
        //     .then((listing) => navigate(`/listings/${listing.id}`))
        try {
            const newListing = await dispatch(addListing(listing));

            const { id } = newListing

            // Redirect after successful listing creation
            // await dispatch(loadOneListing(listing.id))
            // .then(navigate(`/listings/${listing.id}`));
            // const newListing = res.id

            // Redirect after successful listing creation
            navigate(`/listings/${id}`);

        } catch (error) {
            console.error('Error creating listing:', error);
            // Handle error (display error message, update state, etc.)
        }
    };

    return (sessionUser &&
        <>
            <form onSubmit={handleSubmit}>
                <h1>Create Listing</h1>
                <div className='inputContainer'>
                    <input
                        type='text'
                        value={plantName}
                        onChange={updatePlantName}
                        placeholder=''
                        id='plantName'
                    />
                    <label htmlFor='plantName' className='floating-label'>Plant Name*</label>
                </div>
                <div className='error'>{errors.plantName &&
                    <><i className="fa-solid fa-circle-exclamation" /> {errors.plantName}</>}</div>
                <div className='inputContainer'>
                    <textarea
                        value={description}
                        onChange={updateDescription}
                        placeholder=''
                        id='description'
                    />
                    <label htmlFor='description' className='floating-label'>Description*</label>
                </div>
                <div className='error'>{errors.description &&
                    <><i className="fa-solid fa-circle-exclamation" /> {errors.description}</>}</div>
                <div className='inputContainer'>
                    <input
                        type='number'
                        step='0.01'
                        min='1'
                        value={price}
                        onChange={updatePrice}
                        placeholder=''
                        id='price'
                    />
                    <label htmlFor='price' className='floating-label'>Price*</label>
                </div>
                <div className='error'>{errors.price &&
                    <><i className="fa-solid fa-circle-exclamation" /> {errors.price}</>}</div>
                <div className='inputContainer'>
                    <input
                        type='number'
                        step='0.25'
                        min='2'
                        value={potSize}
                        onChange={updatePotSize}
                        placeholder=''
                        id='potSize'
                    />
                    <label htmlFor='potSize' className='floating-label'>Pot Size*</label>
                </div>
                <div className='error'>{errors.potSize &&
                    <><i className="fa-solid fa-circle-exclamation" /> {errors.potSize}</>}</div>
                <div className='inputContainer'>
                    <input
                        type='number'
                        step='1'
                        min='1'
                        value={stockQty}
                        onChange={updateStockQty}
                        placeholder=''
                        id='stockQty'
                    />
                    <label htmlFor='stockQty' className='floating-label'>Stock Quantity*</label>
                </div>
                <div className='error'>{errors.stockQty &&
                    <><i className="fa-solid fa-circle-exclamation" /> {errors.stockQty}</>}</div>
                <div className='inputContainer'>
                    <input
                        type='number'
                        step='1'
                        min='1'
                        value={guideId}
                        onChange={updateGuideId}
                        placeholder=''
                        id='guideId'
                    />
                    <label htmlFor='guideId' className='floating-label'>Guide ID</label>
                </div>
                <div className='inputContainer'>
                    <input
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        multiple
                        onChange={updateFile} />
                </div>
                <div className='error'>{errors.image &&
                    <><i className="fa-solid fa-circle-exclamation" /> {errors.image}</>}</div>
                <button
                    type='submit'
                    disabled={!!Object.values(errors).length}
                >
                    Create Listing
                </button>
            </form>
        </>)

}

export default CreateListingForm



// import ListingForm from "./ListingForm";

// function CreateListingForm() {
//     const newListing = {
//         plantName: '',
//         description: '',
//         price: '',
//         potSize: '',
//         stockQty: '',
//         guideId: '',
//     }

//     return (
//         <ListingForm
//             listing={newListing}
//             formType="Create Listing"
//         />
//     )
// }

// export default CreateListingForm;
