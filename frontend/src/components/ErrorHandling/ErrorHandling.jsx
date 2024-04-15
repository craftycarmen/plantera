import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ErrorHandling() {
    return (
        <section className="errorHandlingContainer">
            <div>To access this page, you must <OpenModalMenuItem
                itemText="log in"
                modalComponent={<LoginFormModal />}
            /> or <OpenModalMenuItem
                    itemText="sign up"
                    modalComponent={<SignupFormModal />}
                /> for Plantera.</div>
            <br />
            <div><img
                style={
                    {
                        display: 'block',
                        width: '200px',
                        margin: 'auto'
                    }
                }
                src='../../ohno.png' /></div>
        </section>
    )
}

export default ErrorHandling
