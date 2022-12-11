import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'

function Stats(){

    
    const navigate = useNavigate()

    function goBack(){
        navigate(-1)
    }
    
    const [ dataType, setDataType ] = useState('month')
    const [ dateFilter, setDateFilter ] = useState('')

    const APIS = {
        'month' : () => window.api.getMonthlyStats(dateFilter),
        'year' : () => window.api.getYearlyStats(dateFilter)
    }

    const { data : STATS  } = useQuery([`get-${dataType}-stats`, dateFilter], APIS[dataType || 'month'], { 
        refetchOnWindowFocus : false
    })

    const [ userData, setUserData ] = useState({
        labels : STATS?.map((item) => item.grouper || '-'),
        datasets : [{
            label : "Entrées", 
            data : STATS?.map((item) => Number(item.entrees) || 0)
        }]
    })

    useEffect(() => {
        setUserData({
            labels : STATS?.map((item, i) => (dataType === "month") ? item?.grouper : i+1 || '-'),
            datasets : [{
                label : "Entrées", 
                data : STATS?.map((item) => Number(item.entrees) || 0),
                backgroundColor : ["lightblue"]
            },

            {
                label : "Sorties", 
                data : STATS?.map((item) => Number(item.sorties) || 0),
                backgroundColor : ["tomato"]
            }
        ]
        })
    }, [STATS])

    const SVGS = {
        back : <svg onClick={goBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
      </svg>,
      delete : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
    }


    return(
        <div className="main-container">
            <div className="go-back">
                {SVGS.back}

                <select className="select-input" defaultValue="month" onChange={(e) => setDataType(e?.target?.value)}>
                    <option value="month">Mensuel</option>
                    <option value="year">Annuel</option>
                </select>

                <input type="month" onChange={e => setDateFilter(e.target.value)} />
            </div>
        
        {
            STATS ? 
            <Bar 
                data={userData}
                // options={}
            />
            : null
        }

        </div>
    )


}

export default Stats