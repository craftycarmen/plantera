import ListingForm from "./ListingForm";

function CreateListingForm() {
    const newListing = {
        plantName: '',
        description: '',
        price: '',
        potSize: '',
        stockQty: '',
        guideId: '',
    }

    return (
        <ListingForm
            listing={newListing}
            formType="Create Listing"
        />
    )
}

export default CreateListingForm;
