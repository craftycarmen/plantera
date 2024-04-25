import { useDispatch } from "react-redux";
import { useModal } from '../../../context/Modal';
import { removeListing } from "../../../store/listings";
import { useState } from "react";

function DeleteListingModal({ listingId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState(null)

    const yes = async () => {
        try {
            await dispatch(removeListing(listingId))
            closeModal()
        } catch (error) {
            console.error("Error deleting listing:", error);

            // Log the error object to inspect it
            console.log(error.status);
            if (error.status === 403) {
                setErrors("You cannot delete this listing, as there is an active order with this listing.")
            } else {
                console.error("Error deleting listing:", error)
            }
        }
    }

    return (
        <section className="modal">
            <h1>Confirm Delete</h1>
            {!errors ? (
                <>
                    <p>Are you sure you want to delete this listing?</p>
                    <span><button
                        id="yes"
                        onClick={yes}
                        style={{ width: "190px" }}
                    >
                        Delete Listing
                    </button>&nbsp;
                        <button
                            id="no"
                            onClick={closeModal}
                            style={{ width: "190px" }}
                        >
                            Cancel
                        </button></span>
                </>
            ) : (
                <>
                    <p>This listing cannot be deleted because it has associated order(s). If you&#39;d like to make this listing inactive, change stock quantity to 0.</p>
                    <button
                        id="no"
                        onClick={closeModal}
                        style={{ width: "190px" }}
                    >
                        Cancel
                    </button>
                </>
            )}
        </section>
    )
}

export default DeleteListingModal
