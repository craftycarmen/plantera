import OpenModalMenuItem from './OpenModalMenuItem';
import SearchModal from '../Search/SearchModal/SearchModal';

function SearchButton() {
    const handleOpenModal = async () => {

    }

    return (
        <>
            <OpenModalMenuItem
                itemText={<>

                    <i style={{ color: "#28635A" }} className="fa-solid fa-magnifying-glass" />

                </>}
                // onClick={handleOpenModal}
                modalComponent={<SearchModal />}
            />
        </>
    )
}

export default SearchButton
