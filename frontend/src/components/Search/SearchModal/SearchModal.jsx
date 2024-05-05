import { useDispatch } from 'react-redux';
import { useState } from 'react';
import './SearchModal.css';
import { fetchListingResults } from '../../../store/search';
import { useModal } from '../../../context/Modal';

function SearchModal({ navigate }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(fetchListingResults(searchQuery))
            .then(() => {
                navigate(`/search?search=${searchQuery}`)
                setSearchQuery('')
                closeModal();
            })
    }

    return (
        <section className="searchModal">
            <h1>Search</h1>
            <form onSubmit={handleSubmit} className='searchForm'>
                <input
                    type='text'
                    value={searchQuery}
                    placeholder='monstera, ficus, pothos'
                    onChange={(e) => setSearchQuery(e.target.value)}
                    id='searchQuery'
                />
                <button
                    type='submit'
                ><i style={{ fontSize: "x-large" }} className="fa-solid fa-magnifying-glass" /></button>
            </form>
        </section>
    )
}

export default SearchModal
