import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useState } from 'react'

function ComptaGenerale(){

    const navigate = useNavigate()

    function goBack(){
        navigate(-1)
    }

    const Today = new Date()

    const [ filterDate, setFilterDate ] = useState({ month : Today.getMonth() + 1, year : Today.getFullYear() })

    const { data, isLoading, isError, error } = useQuery(['fetch-infos', filterDate], () => window.api.getComptaGenerale(filterDate), { refetchOnWindowFocus : false})

    function handleDateChange(e){
        if(!e.target.value) return 

        const [ year, month ] = e.target.value?.split('-') || null
        setFilterDate({ month: Number(month), year: Number(year)})
    }

    function computeTotal (){
        return (Number(data?.entree) - (Number(data?.sortie) + Number(data?.salaires))) || 0
    }

    const SVGS = {
        back : <svg onClick={goBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
      </svg>,
      delete : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
    }

    return (
        <div className="main-container">
            <div className="go-back">
                {SVGS.back}

                <input type="month" className="pick-date" onChange={ handleDateChange }/>
            </div>

            <div className="container-body">
                <div className="show-element">
                    <span className="element-name">TOTAL ENTREES: </span>
                    <span className="element-value">{data?.entree}</span>
                </div>
                <div className="show-element">
                    <span className="element-name">TOTAL SORTIES: </span>
                    <span className="element-value">{data?.sortie}</span>
                </div>
                <div className="show-element">
                    <span className="element-name">TOTAL SALAIRES: </span>
                    <span className="element-value">{data?.salaires}</span>
                </div>
            </div>

            <div className="container-sum">
                <span className="element-name">TOTAL MOIS : </span>
                <span className="element-value"> {computeTotal()} FCFA </span>
            </div>

            {/* <div className="cmds-count">
                <span>Commandes ce mois-ci : </span>
                <span className="golden"> {data?.nombre_commandes} </span>
            </div> */}
        </div>
    )
}

export default ComptaGenerale