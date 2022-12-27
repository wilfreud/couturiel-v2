import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from 'react-query' 
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../style/Caisse.css'
import ConfirmAction from './ConfirmAction'


function Mercerie() {

    const [ filterDate, setFilterDate ] = useState(null)
    
    const ENTRY_EXTRA_DATA = 'mercerie'

    const [askPermission, setAskPermission ] = useState(false)
    const [deleteProductId, setDeleteProductId ] = useState(null)

    const { register, handleSubmit, formState : { errors }, reset : resetForm } = useForm()

    const {isLoading, data, isError, refetch : refetchCaisseContent, refetch : refetchCaisse } = useQuery(['get-caisse-content', filterDate], () => window.api.getMercerieContent({date : filterDate, extra_data : ENTRY_EXTRA_DATA}), { refetchOnWindowFocus : false })
    const { data : totalInCaisse, isError : isErrorForTotal, refetch : refetchTotal } = useQuery(['get-total-caisse', filterDate], () => window.api.getMercerieTotal({date : filterDate, extra_data : ENTRY_EXTRA_DATA}), { refetchOnWindowFocus : false})
    const { data : models } = useQuery('fetch-models-for-caisse', window.api.getModelsByCategory, {
        refetchOnWindowFocus : false,
    })
    const { mutate : mutateCaisse, isError : isMutationError, error : mutationError } = useMutation(window.api.addEntryToCaisse, {
        onSuccess : () => {
            refetchCaisse()
            refetchTotal()
        }
    })

    const { mutate : mutateRows, isError : deleteIsError, error : deleteError } = useMutation(window.api.deleteEntry, {
        onSuccess : () => {
            refetchCaisse()
            refetchTotal()
        }
    })

    const navigate = useNavigate()

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
    </svg>
    }

    function addNewEntry(data){
        if(!data.libelle_sortie){
            data.libelle_sortie = null
        }

        if(!data.sortie){
            data.sortie = 0
        }

        data.extra_data = ENTRY_EXTRA_DATA

        mutateCaisse(data)

        if(isMutationError){
            console.error(mutationError)
            toast.error('Erreur'+ err.message, defaultToast)
            return
        }
            
        toast.success('Champ ajouté', defaultToast)
        // console.warn("refetching...")
        refetchCaisseContent()

        // setProductPrice(0)
        resetForm()
        refetchTotal()
    }

    function updateEntryPrice(e){
        const idd = Number(e.target.value)
        const price = models?.find(e => e.id === idd)
        console.log(price)
        setProductPrice(price.prix)
    }

    function filterByDate(e){
        const filter = e.target.value
        setFilterDate(filter)

    }

    function deleteRow(io){
        setAskPermission(true)
        setDeleteProductId(io)
    }
    
    function triggerDeletion(){
        mutateRows(deleteProductId)
        if(deleteIsError){
            console.error(deleteError)
            toast.error("Echec de suppression", defaultToast)
            return
        }

        toast.success("Supprimé !", defaultToast)
    }

    return (
        <div className="caisse-contain">

            { 
                askPermission ? 
                <ConfirmAction
                    closeModal={() => {
                        setAskPermission(false)
                        setDeleteProductId(null)
                    }}
                    modalText="Supprimer champ ?"
                    actionType='DELETE_ENTRY'
                    trigger = {triggerDeletion}
                />
                : null
            }

            <div className="go-back">
                {SVGS.back}

                <input type="date" className="pick-date" onChange={filterByDate} />
            </div>
            
            <div className="caisse-table override-input-color">
                <div className="table-header table-row">
                    <div className="table-cell">
                        <div className="table-sub-cell">Date</div>
                        <div className="table-sub-cell"></div>
                    </div>
                    
                    <div className="table-cell">
                        <div className="table-sub-cell">LIBELLE</div>

                    </div>

                    <div className="table-cell">
                        <div className="table-sub-cell">MONTANT</div>
                    </div>
                    
                </div>

                <form onSubmit={handleSubmit(addNewEntry)} className="table-row table-body ignore-line">
                    <input type="submit" className="submit" value="+" />
                    
                    <div className="table-cell mercerie">
                        <input className="form-field" type="text" defaultValue={""} {...register('libelle_sortie')} placeholder="Libelle sortie" />
                    </div>

                    <div className="table-cell mercerie">
                        <input className="form-field" type="number" {...register('sortie', {min : 0}) } placeholder="Sortie" />
                    </div>
                </form>

                    { isLoading ? <h2>Chargement...</h2> : null }

                    {
                        data?.map(row => (
                            <div className="table-row table-body" key={row?.id}>
                                <div className="row-deleter" onClick={() => {
                                    
                                   if(row?.libelle_entree?.includes("TDR")){
                                    toast.error("Action impossible pour les commandes validées", defaultToast)
                                    return
                                   }

                                   deleteRow(row?.id)}
                                }> {SVGS.delete} </div>
                                <div className="table-cell mercerie"> {row?.dateformat} </div>
                                <div className="table-cell mercerie">
                                    <div className="table-sub-cell"> {row?.libelle_sortie} </div>
                                    {/* <div className="table-sub-cell"> {row?.entree} </div> */}
                                </div>

                                <div className="table-cell mercerie">
                                    {/* <div className="table-sub-cell"> {row?.libelle_sortie} </div> */}
                                    <div className="table-sub-cell"> {row?.sortie} </div>
                                </div>

                            </div>
                        ))
                    }

                <div className="table-footer table-row">
                    <div className="table-cell ignore-style"></div>
                    <div className="table-cell ignore-style"></div>
                    <div className="table-cell ignore-style"></div>
                    <div className="table-cell ignore-style"></div>
                    <div className="table-cell ignore-style total-cell"> 
                        <span className="total-title">TOTAL : </span>
                        <span className="total-value"> { isErrorForTotal ? <span className="error">ERROR</span>  : totalInCaisse } </span> 
                    </div>
                </div>

                { isError ? <h2 className="error"> Erreur de récupération des données </h2> : null }
            </div>
            <ToastContainer />
        </div>
    )
}


export default Mercerie