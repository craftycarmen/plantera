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

            if (error.status === 403) {
                setErrors("This listing cannot be deleted because it is linked to existing orders.")
            } else {
                console.error("Error deleting listing:", error)
            }
        }
    }

    return (
        <section className="modal deleteModal">
            <h1>Confirm Delete</h1>
            {!errors ? (
                <>
                    <p>Are you sure you want to delete this listing?</p>
                    <span className="deleteButtons"><button
                        id="yes"
                        onClick={yes}
                    >
                        Delete Listing
                    </button>
                        <button
                            id="no"
                            onClick={closeModal}
                        >
                            Cancel
                        </button></span>
                </>
            ) : (
                <>
                    <p>This listing cannot be deleted because it is linked to existing order(s). If you&#39;d like to make this listing inactive, change stock quantity to 0.</p>
                    <button
                        id="no"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                </>
            )}
        </section>
    )
}

export default DeleteListingModal
