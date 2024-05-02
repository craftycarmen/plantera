import './SearchModal.css';

function SearchModal() {
    const handleSubmit = async () => {

    }

    return (
        <section className="searchModal">
            <h1>Search</h1>
            <form onSubmit={handleSubmit} className='searchForm'>
                <input
                    type='text'
                />
                <button
                    type='submit'
                ><i style={{ fontSize: "x-large" }} className="fa-solid fa-magnifying-glass" /></button>
            </form>
        </section>
    )
}

export default SearchModal
