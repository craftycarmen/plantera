import { useDispatch } from "react-redux";
import { useModal } from '../../../context/Modal';
import { removeListing } from "../../../store/listings";

function DeleteListingModal({ listingId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const yes = () => {
        return dispatch(removeListing(listingId))
            .then(closeModal)
    }

    return (
        <section className="modal">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete this listing?</p>
            <button
                id="yes"
                onClick={yes}>
                Yes, Delete Listing
            </button>
            <br />
            <button
                id="no"
                onClick={closeModal}>
                Cancel
            </button>
        </section>
    )
}

export default DeleteListingModal
