import { useParams, useNavigate } from 'react-router-dom'
import { useReducer } from 'react'
import { useQuery } from 'react-query'
import AddModel from './AddModel'
import { ToastContainer, toast } from 'react-toastify'
import ConfirmAction from './ConfirmAction'
import '../style/Produits.css'

function Produits(){
    const navigate = useNavigate()
    const { categorie } = useParams()

    function conditionalModalrender(state, action){

        switch(action.type){
            case 'ADD':
                return {add : !state.add}
            case 'EDIT':
                return {edit : !state.edit, id : action?.id || null }
            case 'DELETE':
                return {delete : !state.delete, id : action?.id || null}
            case 'ASK_PERMISSION':
                return { permission : !state.permission, id : action?.id || null }
            default:
                console.warn("Unknown dispatcher warning triggered for reducer")
        }
    }

    const [ formState, dispatchForm ] = useReducer(conditionalModalrender, { add : false, edit : false, delete : false, id : null, permission : false })
    const DISPATCHERS = {
        delete : 'DELETE',
        edit : 'EDIT',
        add : 'ADD',
        permission : 'ASK_PERMISSION'
    }

    const fetchAPIS = {
        getzner : window.api.getAllGetzner,
        supercent : window.api.getAllSupercent,
        accessoires : window.api.getAllAccessoires
    }

    const { data : produits, isLoading, isError, error, refetch } = useQuery(`fetch-${categorie}`, fetchAPIS[categorie], {
        refetchOnWindowFocus : false,
    })

    function goBack(){
        navigate(-1)
    }

    const defaultToast = {
        theme : 'dark',
        pauseOnFocusLoss : false, 
        pauseOnHover : false,
        autoClose : 4000
    }

    // console.log("FORMSTATE ID : ", formState.id)


    function setTargetId(e, action){
        const id = Number(e.target.getAttribute('data-id')) || null
        // console.log("Action :", action)
        // console.log("ID : ", id)

        switch(action){
            case "DELETE" : 
                const currentValue = Number(e.target.getAttribute('data-value'))
                if(currentValue > 0){
                    toast.error("Erreur! Stock non vide", defaultToast)
                    return
                }
                dispatchForm( {type : DISPATCHERS.delete, id : id} )
                break
            case "EDIT" : 
                dispatchForm( {type : DISPATCHERS.permission, id : id} )
                break
            default:
                console.warn("Unknwon action")

        }
    }

    const SVGS = {
        back : <svg onClick={goBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
      </svg>,
      
      plus : <svg onClick={() => {dispatchForm({type : DISPATCHERS.add})} } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#272727" className="w-6 h-6">
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
      </svg>,
    edit : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>,
    delete : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>,
    refresh : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
    
    }

    if(isLoading){
        return(
        <div className="produits-container">
            <div className="go-back">
                {SVGS.back}
            </div>

                <h3 className="warning-message">Chargement des produits...</h3>
        </div>
        )
    }

    if(isError){
        console.error(error)
        return(
        <div className="produits-container">
            <div className="go-back">
                {SVGS.back}
            </div>
                <h3 className="error">Erreur de la récupération des produits...</h3>
        </div>
        )
    }
    // console.log(defaultImage)
    
    return(
        <div className="main-container">
            <div className="go-back">
                {SVGS.back}
            </div>

            <div className="add-btn">
                <div className="add-client"> 
                        { SVGS.plus } 
                </div>
            </div>

            {
                formState.add 
                ? <AddModel 
                    closeModal={ () => dispatchForm( {type : DISPATCHERS.add} )}
                    categorie={categorie}
                    refresh={refetch}
                    /> 
                : null
            }

            {
                formState.edit
                ? <AddModel 
                    closeModal={ () => dispatchForm( {type : DISPATCHERS.edit})}
                    categorie={categorie}
                    refresh={refetch}
                    editMode={true}
                    ID={formState.id}
                    />
                : null
            }

            { 
                formState.permission
                ? <ConfirmAction 
                    closeModal={ () => { dispatchForm( {type : DISPATCHERS.permission})} }
                    modalText="Autoriser des modifications"
                    ID={formState.id}
                    actionType="EDIT_MODEL"
                    goToComponent={() => {dispatchForm({type : DISPATCHERS.edit, id : formState.id || null})} }
                    />
                : null 
            }

            {
                formState.delete
                ? <ConfirmAction
                    closeModal={ () => dispatchForm( {type : DISPATCHERS.delete} )}
                    modalText="Autoriser la suppression"
                    actionType="DELETE_MODEL"
                    ID={formState.id}
                    refresh={refetch}
                 />
                : null
            }

            <div className="produits-body">
                
                {
                    produits?.map( (item) => (
                        <div className="produit-item" key={item.id} >

                            <div className="produit-options">
                                <div data-id={item.id} onClick={(e) => setTargetId(e, "EDIT")} className="produit-opt edit"> {SVGS.edit} </div>
                                <div data-id={item.id} data-value={item?.quantite} onClick={(e) => setTargetId(e, "DELETE")} className="produit-opt delete"> { SVGS.delete } </div>
                            </div>
                            
                            <div className="produit-overlay"></div>

                            <div className="produit-img-container">
                                <img 
                                    src={item?.image} 
                                    alt="Produit" 
                                />
                            </div>


                            <div className="produit-infos">
                                <div className="produit-info-line produit-nom"> <span className="golden"> Modèle : </span>
                                    <span className="golden boldit"> {item?.nom_modele} </span> 
                                </div>
                                <div className="produit-info-line produit-taille"> <span className="golden"> Taille : </span>
                                    <span className="golden boldit"> {item?.taille} </span> 
                                </div>
                                <div className="produit-info-line produit-prix"> <span className="golden"> Prix : </span>
                                    <span className="golden boldit"> {item?.prix} </span> 
                                </div>
                                <div className="produit-info-line produit-quantite"> <span className="golden"> Quantité : </span>
                                    <span className="golden boldit"> {item?.quantite} </span> 
                                </div>
                                {/* <div className="produit-info-line produit-quantite"> <span className="golden"> ID : </span> {item?.id} </div> */}

                            </div>
                        </div>
                    ))
                }

            </div>
            
            {/* <div className="refresh" onClick={refetch}>
                { SVGS.refresh }
            </div> */}
            <ToastContainer />
        </div>
    )

}

export default Produits