import { useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { useQuery } from 'react-query'
import SalairesPanel from './SalairesPanel.jsx'
import ConfirmAction from './ConfirmAction'
import '../style/Salaires.css'

function Salaires(){

    const navigate = useNavigate()
    const MATR_PREFIX = 'TDE'
    const matrPrefixZeros = (number) => { return MATR_PREFIX + `${number}`.padStart(3, 0) }

    const defaultToast = {
        theme : 'dark',
        pauseOnFocusLoss : false, 
        pauseOnHover : false,
        autoClose : 4000
    }

    function goBack(){
        navigate(-1)
    }

    const SVGS = {
        back : <svg onClick={goBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
      </svg>,
      delete : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>,
    plus : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#272727" className="w-6 h-6">
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
</svg>,
    edit : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
    <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
    </svg> 
    }

    const DISPATCHERS = {
        add : 'ADD',
        delete : 'DELETE',
        edit : "EDIT",
        pay : 'PAY',
        permission : 'PERMISSION'
    }

    function conditionalSalairesModal(state, action){
    // console.log(action)

        switch(action.type){
            case 'ADD':
                return { add : !state?.add }
            case 'DELETE':
                return { delete : !state?.delete, id : state?.id || null }
            case 'EDIT':
                return { edit : !state?.edit }
            case 'PAY':
                return { pay : !state?.pay, id : state?.id || null}
            case 'PERMISSION':
                return { permission : !state?.permission }
            default:
                console.warn("Unknown dispatcher warning triggered for reducer")
        }
    }

    const [ useID, setUseID ] = useState(null)

    const [ S_state, S_dispatch ] = useReducer(conditionalSalairesModal, { add : false, edit : false, delete : false, id : null, permission : false })

    const  { data, isLoading, isError, error, refetch } = useQuery('fetch-salaires', () => { return window.api.getEmployes() },  {
        refetchOnWindowFocus : false,
    })

    const Today = new Date()
    const { data : allowPayment, refetch : reCheckIfCanPay } = useQuery('check-if-payment-allowed', () => window.api.checkIfPaidIsDone([Today.getMonth()+1, Today.getFullYear()]), { refetchOnWindowFocus : false})


    function computeTotalSalaires(){
        const total =  data?.reduce((previousValue, currentValue) => {
            return previousValue + currentValue?.salaire
        }, 0) || 0

        return total
    }


    if(isLoading){
        return (<div className="main-container">
            <div className="go-back">
                {SVGS.back}
            </div>
            <h2 className="golden"> Chargement de la liste...</h2>
        </div>)
    }

    if(isError){
        console.error(error)
        return (<div className="main-container">
            <div className="go-back">
                {SVGS.back}
            </div>
            <h2 className="error"> Erreur lors du chargement de la liste...</h2>
        </div>)
    }


    return (
        <div className="main-container">
            <div className="go-back">
                {SVGS.back}

                {/* <input type="month" className="pick-date"  onChange={e => console.log(e.target.value)}/> */}

                <div className="add-client" title="Ajouter employé" onClick={ () => S_dispatch({ type : DISPATCHERS.add }) }> 
                    { SVGS.plus } 
                </div>
            </div>


            { 
                S_state.add 
                ? <SalairesPanel 
                    closeModal={ () => S_dispatch({ type : DISPATCHERS.add } )}
                    refresh={refetch}
                />
                : null
            }

            {
                S_state.delete
                ? <ConfirmAction 
                    closeModal={ () => {
                        setUseID(null)
                        S_dispatch({ type : DISPATCHERS.delete } )
                    }}
                    refresh={refetch}
                    ID={useID}
                    modalText="Autoriser la suppression"
                    actionType="DELETE_EMPLOYE"
                />
                : null
            }

            {
                S_state.pay
                ? <ConfirmAction
                    closeModal={ () => S_dispatch({ type : DISPATCHERS.pay })}
                    ID={computeTotalSalaires()}
                    refresh={reCheckIfCanPay}
                    modalText="Verser les salaires du mois ?"
                    actionType="PAY_EMPLOYEES"
                />
                : null
            }
            
            {
                S_state.permission
                ? <ConfirmAction
                    closeModal={ () => S_dispatch({ type : DISPATCHERS.permission } )}
                    modalText="Autoriser les modifications"
                    actionType="EDIT_EMPLOYEE"
                    // goToComponent={ () => S_dispatch({ type : DISPATCHERS.edit }) }
                    goToComponent={ () => S_dispatch({ type : DISPATCHERS.edit }) }
                />
                : null
            }

            { 
                S_state.edit
                ? <SalairesPanel 
                    closeModal={ () => S_dispatch({ type : DISPATCHERS.edit } )}
                    ID={useID}
                    editMode={true}
                    refresh={refetch}
                />
                : null
            }
            
            <div className="salaires-container">

                <div className="table-row table-header prod-row salaires-row">
                    <div className="table-cell">MATRICULE</div>
                    <div className="table-cell">NOM</div>
                    <div className="table-cell">PRENOM</div>
                    <div className="table-cell">SALAIRE</div>
                    <div className="table-cell">ACTIONS</div>
                </div>


                <div className="table-body">
                    {
                        data?.map((dt, i) => (
                            <div key={i} className="table-row prod-row salaires-row">
                                <div className="table-cell"> { matrPrefixZeros(dt?.id) } </div>
                                <div className="table-cell"> {dt?.nom} </div>
                                <div className="table-cell"> {dt?.prenom} </div>
                                <div className="table-cell"> {dt?.salaire} </div>
                                <div className="table-cell options"> 
                                    <div className="option-btn svg-span edit" title='Modifier' onClick={() => {
                                        setUseID(dt?.id)
                                        S_dispatch({ type : DISPATCHERS.permission })
                                        }}>
                                        { SVGS.edit }
                                    </div>

                                    <div className="option-btn svg-span delete" title="Supprimer" onClick={ () => {
                                        setUseID(dt?.id)
                                        S_dispatch({ type : DISPATCHERS.delete })
                                    } }
                                    >
                                        { SVGS.delete }
                                    </div>

                                </div>
                            </div>
                        ))
                    }

                    <div className="table-row prod-row salaires-row">
                        <div className="table-cell ignore-style"></div>
                        <div className="table-cell ignore-style"></div>
                        <div className="table-cell ignore-style"></div>
                        <div className="table-cell ignore-style blacken">
                            <h2>TOTAL : <span className=""> { computeTotalSalaires() } </span> </h2>
                            <button className="classic-btn"  onClick={ () => {
                            if(!allowPayment){
                                toast.error("Paiement dejà effectué !", defaultToast)
                                return
                            }
                            S_dispatch({ type : DISPATCHERS.pay })
                            }
                        }>PAYER</button>
                        </div>
                        <div className="table-cell ignore-style"></div>
                    </div>
                </div>


            </div>
            <ToastContainer />
        </div>
    )
}

export default Salaires