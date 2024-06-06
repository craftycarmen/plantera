import ListingForm from "./ListingForm";

function CreateListingForm() {
    const newListing = {
        plantName: '',
        description: '',
        price: '',
        potSize: '',
        stockQty: '',
        guideIds: [],
        image: ''
    }

    return (
        <ListingForm
            listing={newListing}
            formType="Create Listing"
        />
    )
}

export default CreateListingForm;
