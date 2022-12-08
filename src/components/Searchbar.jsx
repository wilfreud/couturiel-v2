import '../style/Searchbar.css'

function Searchbar({ setSearch }){

    return(
        <div className="searchbar">
            <input 
                type="text" 
                className="search-input"
                name="filter-search" 
                placeholder="Rechercher"
                onChange={e => setSearch(e.target.value)}  
            />

        </div>
    )

}


export default Searchbar