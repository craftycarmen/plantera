import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { editOrder } from "../../../store/sell";
import { useState } from "react";

function UpdateOrderModal({ orderId, orderStatus }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [status, setStatus] = useState(orderStatus)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const order = {
            status
        }

        try {
            await dispatch(editOrder(orderId, order))
            closeModal();
        } catch (error) {
            console.error('Error updating order status:', error)
        }
    }
    return (
        <section className="modal orderModal">
            <h1>Update Order Status</h1>
            <h2>Order #{orderId}</h2>
            <div style={{ marginTop: "10px" }}>Current Status: {orderStatus}</div>
            <div style={{ marginTop: "15px" }}>New Status:</div>
            <form onSubmit={handleSubmit}>
                <div className="orderStatusOptions">
                    <div className="radio">
                        <input type="radio"
                            value="inProgress"
                            name="status"
                            onClick={() => setStatus("inProgress")}
                        /><span>In Progress</span>
                    </div>
                    <div className="radio">
                        <input type="radio"
                            value="shipped"
                            name="status"
                            onClick={() => setStatus("shipped")}
                        /><span>Shipped</span>
                    </div>
                </div>
                <span className="deleteButtons" style={{ marginTop: "20px" }}><button>Update Order Status</button>
                    <button
                        onClick={closeModal}
                    >
                        Cancel
                    </button></span>
            </form>

        </section>
    )
}

export default UpdateOrderModal
