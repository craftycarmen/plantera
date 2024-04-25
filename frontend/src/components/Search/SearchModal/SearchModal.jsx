import './SearchModal.css';
import OpenModalMenuItem from '../../Navigation/OpenModalMenuItem';

function SearchModal() {
    const handleOpenModal = async () => {

    }

    return (
        <section className="searchModal">
            <h1>Search</h1>
            <form className='searchForm'>
                <input
                    type='text'
                />
                <button><i style={{ fontSize: "x-large" }} className="fa-solid fa-magnifying-glass" /></button>
            </form>
        </section>
    )
}

export default SearchModal
