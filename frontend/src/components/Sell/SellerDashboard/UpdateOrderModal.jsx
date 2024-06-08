import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { editOrder } from "../../../store/sell";
import { useState } from "react";

function UpdateOrderModal({ orderId, status }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [orderStatus, setOrderStatus] = useState(status)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const order = {
            orderStatus
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
            <div style={{ marginTop: "10px" }}>Current Status: {status}</div>
            <div style={{ marginTop: "15px" }}>New Status:</div>
            <form onSubmit={handleSubmit}>
                <div className="orderStatusOptions">
                    <div className="radio">
                        <input type="radio"
                            value="In Progress"
                            name="status"
                            defaultChecked={orderStatus === "In Progress"}
                            onClick={() => setOrderStatus("In Progress")}
                        /><span>In Progress</span>
                    </div>
                    <div className="radio">
                        <input type="radio"
                            value="Shipped"
                            name="status"
                            defaultChecked={orderStatus === "Shipped"}
                            onClick={() => setOrderStatus("Shipped")}
                        /><span>Shipped</span>
                    </div>
                </div>
                <span className="deleteButtons" style={{ marginTop: "20px" }}><button onSubmit={handleSubmit}>Update Order Status</button>
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
