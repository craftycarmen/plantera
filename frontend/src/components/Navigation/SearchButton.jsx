import OpenModalMenuItem from './OpenModalMenuItem';
import SearchModal from '../Search/SearchModal/SearchModal';
import { useNavigate } from 'react-router-dom';

function SearchButton() {
    const navigate = useNavigate();

    return (
        <>
            <OpenModalMenuItem
                itemText={<>

                    <i style={{ color: "#28635A" }} className="fa-solid fa-magnifying-glass" />

                </>}
                modalComponent={<SearchModal navigate={navigate} />}
            />
        </>
    )
}

export default SearchButton
