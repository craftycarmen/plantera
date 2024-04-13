import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { addListing, loadOneListing, addImage } from '../../store/listings';
import { Audio } from 'react-loader-spinner'

function ListingForm({ listing, formType }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const listingId = listing.id

    const sessionUser = useSelector(state => state.session.user);

    const [plantName, setPlantName] = useState(listing?.plantName);
    const [description, setDescription] = useState(listing?.description);
    const [price, setPrice] = useState(listing?.price);
    const [potSize, setPotSize] = useState(listing?.potSize);
    const [stockQty, setStockQty] = useState(listing?.stockQty);
    const [guideId, setGuideId] = useState(listing?.guideId);
    const [image, setImage] = useState("");
    const [imageLoading, setImageLoading] = useState(false);
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

    const createForm = formType === 'Create Listing';


    useEffect(() => {
        async () => {
            await dispatch(loadOneListing(listingId))
        }
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
    }, [plantName, description, price, potSize, stockQty, dispatch, listingId])


    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({})

        listing = {
            ...listing,
            sellerId: sessionUser.id,
            plantName,
            description,
            price,
            potSize,
            stockQty,
            guideId
        }

        if (createForm) {
            const newListing = await dispatch(addListing(listing))
            listing = newListing

            const listingId = listing.id;

            const formData = new FormData();
            formData.append("image", image);
            formData.append("imageable_id", listingId);
            formData.append("imageable_type", "Listing");

            setImageLoading(true);

            await dispatch(addImage(formData))
                .then(() => {
                    dispatch(loadOneListing(listingId))
                        .then(() => navigate(`/listings/${listingId}`))
                }).catch((error) => {
                    console.error("Error uploading image:", error);
                    setImageLoading(false);
                })
        }

        // if (formType === 'Create Listing') {
        //     const newListing = await dispatch(addListing(listing));
        //     listing = newListing
        // }
        // else if (formType === 'Update Listing') {
        //     const updatedListing = await dispatch(updateListing(listing));
        // listing = updatedListing
        // }

        if (listing.errors) {
            setErrors(listing.errors);
        } else {
            navigate(`/listings/${listing.id}`)
        }
        // if (formType === 'Add Listing') {
        //     const listingId = listing.id;


        // }
    }

    return (sessionUser &&
        <>
            <form onSubmit={handleSubmit}>
                <h1>{formType}</h1>
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
                        onChange={updateFile} />
                </div>
                <div className='error'>{errors.image &&
                    <><i className="fa-solid fa-circle-exclamation" /> {errors.image}</>}</div>
                {(imageLoading) && <Audio
                    height="80"
                    width="80"
                    radius="9"
                    color="green"
                    ariaLabel="three-dots-loading"
                    wrapperStyle
                    wrapperClass
                />}
                <button
                    type='submit'
                    disabled={!!Object.values(errors).length}
                >
                    {formType}
                </button>
            </form>
        </>)

}

export default ListingForm
