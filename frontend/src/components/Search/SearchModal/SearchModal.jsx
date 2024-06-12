import { useDispatch } from 'react-redux';
import { useState } from 'react';
import './SearchModal.css';
import { fetchListingResults } from '../../../store/search';
import { useModal } from '../../../context/Modal';

function SearchModal({ navigate }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [searchQuery, setSearchQuery] = useState('');
    const searchTermLocalStorage = (searchTerm) => {
        localStorage.setItem('searchTerm', searchTerm)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        localStorage.removeItem('searchTerm')
        searchTermLocalStorage(searchQuery);
        dispatch(fetchListingResults(searchQuery))
            .then(() => {
                closeModal();
                navigate(`/search?search=${searchQuery}`)
                setSearchQuery('')
            })
    }

    return (
        <section className="searchModal">
            <form onSubmit={handleSubmit} className='searchForm'>
                <h1>Search</h1>
                <div>
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
                </div>
            </form>
        </section>
    )
}

export default SearchModal
