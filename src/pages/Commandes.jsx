import { useQuery } from 'react-query'
import { useReducer, useState, useDeferredValue } from 'react'
import CommandesPanel from '../components/CommandesPanel'
import { ToastContainer } from 'react-toastify'
import Searchbar from '../components/Searchbar'
import ConfirmAction from '../components/ConfirmAction'
import FactureClient from '../components/FactureClient'
import '../style/Commandes.css'
import 'react-toastify/dist/ReactToastify.css'


function Commandes(){

    
    const SVGS = {
      plus : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#272727" className="w-6 h-6">
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
  </svg>,
  done : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#13c81f" className="w-6 h-6">
  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
</svg>,
    print : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#eac23d" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
  </svg>
  
    }

    // Related to string filtering
    const [findString, setFindString] = useState('')
    const substring = useDeferredValue(findString)
    function findSubString(obj){
        return obj?.clients[0]?.f3?.toLowerCase().includes(substring?.toLowerCase()) 
                ||  obj?.clients[0]?.f2?.toLowerCase().includes(substring?.toLowerCase())
    }
    
    const DISPATCHERS = {
        add : 'ADD',
        view : 'VIEW',
        edit : 'EDIT',
        delete : 'DELETE',
        confirm : 'CONFIRM',
        validate : 'VALIDATE',
        print : 'PRINT',
    }

    function commandesActionsReducer(state, action) {

        switch (action.type) {
            case 'ADD':
                return { add : !state.add}
            case 'VIEW':
                return { view : !action.view, id : action?.id || null }                
            case 'EDIT':
                return { edit : !action.edit, id : action?.id || null }
            case 'DELETE':
                return { delete : !state.delete, id : action?.id || null }   
            case 'VALIDATE':
                return { validate : !state.validate, id : action?.id || null }             
            case 'CONFIRM':
                return { confirm : !state.confirm, id : action?.id || null }
            case 'PRINT':
                return { print : !state.print, id : action?.id || null}

            default:
                console.warn("Unregistered dispatcher !", action)
                break;
        }
    }
    
    const [ C_state, C_dispatch ] = useReducer(commandesActionsReducer, { 
        add : false, view : false, edit : false, delete : false, confirm : false, id : null, validate : false, print : false
     })

    const [ finishedCommands, setFinishedCommands ] = useState(false)
     
    const { data : commandesFetched, isLoading : commadesAreLoading, isError : commandesAreError, error : commandesError, refetch } = useQuery(['fetch-commandes', finishedCommands], () => window.api.getCommandes(finishedCommands), {
        refetchOnWindowFocus : false
      })


    if(commadesAreLoading){
        return <div className="App-main-container" >
        <Searchbar setSearch={setFindString} />
            <div className="component-body">
                <h3 className="golden">Chargement de la liste...</h3>
            </div>
        </div>
    }

    if(commandesAreError){
        // console.log(commandesError)
        return <div className="App-main-container" >
        <Searchbar setSearch={setFindString} />
            <div className="component-body">
                <h3 className="error">Erreur lors de la récupération !</h3>
            </div>
        </div>
    }
    
    return(
        <div className="App-main-container" >
            <Searchbar setSearch={setFindString} />
            <div className="component-body">
            
                <select name="type-commandes" defaultValue={finishedCommands} data-status={finishedCommands} className="set-commandes-type input-select" onClick={ (e) => setFinishedCommands(e.target.value)}>
                    <option value={false}>En cours</option>
                    <option value={true}>Terminées</option>
                </select>
            {/* <div className="page-options"> */}
                <div className="add-client" onClick={ () =>  C_dispatch({ type : DISPATCHERS.add })}> 
                    { SVGS.plus } 
                </div>
            {/* </div> */}

                { 
                    C_state?.add 
                    ? <CommandesPanel 
                        closeModal={ () => C_dispatch({ type : DISPATCHERS.add}) }
                        refresh={refetch}
                        />
                    : null
                }

                {
                    C_state?.delete
                    ? <ConfirmAction 
                        closeModal={ () => C_dispatch({ type : DISPATCHERS.delete})}
                        ID={C_state.id}
                        modalText="Supprimer commande ?"
                        refresh={refetch}
                        actionType="DELETE_COMMANDE"
                    />
                    : null
                }

                { 
                    C_state?.validate
                    ? <ConfirmAction 
                        closeModal={ () => C_dispatch({ type : DISPATCHERS.validate } )}
                        ID={C_state.id}
                        modalText="Valider la commande ?"
                        refresh={refetch}
                        actionType="VALIDATE_COMMAND"
                        extraData={ (commandesFetched?.find(e => e.id === C_state.id))?.modeles || null }
                    />
                    : null
                }
                
                {
                    C_state.confirm
                    ? <ConfirmAction 
                        closeModal={ () => C_dispatch({ type : DISPATCHERS.confirm } ) }
                        ID={C_state.id}
                        modalText="Autoriser des modifications"
                        refresh={refetch}
                        actionType="EDIT_COMMANDE"
                        goToComponent={() => C_dispatch({ type : DISPATCHERS.edit, id : C_state?.id || null }) }
                    />
                    : null
                }

                { 
                    C_state.edit
                    ? <CommandesPanel
                        closeModal={ () => C_dispatch({ type : DISPATCHERS.edit }) }
                        ID={C_state.id}
                        refresh={refetch}
                        editMode={true}    
                    />
                    : null
                }

                { 
                    C_state.print
                    ? <FactureClient 
                        closeModal={ () => C_dispatch({ type : DISPATCHERS.print})}    
                        ID={C_state.id}
                    />
                    : null
                }

                <div className="clients-container commandes-container">
                    <div className="table-row table-header prod-row">
                        <div className="table-cell">DATE DE LIVRAISON</div>
                        <div className="table-cell">COMMANDE</div>
                        <div className="table-cell">TAILLE / COULEUR</div>
                        <div className="table-cell">CLIENT</div>
                        <div className="table-cell">AVANCE</div>
                        <div className="table-cell">TOTAL</div>
                        <div className="table-cell">OPTIONS</div>
                    </div>

                    { 
                        commandesFetched?.filter(cli => findSubString(cli))?.map((cmd, index) => {
                          return <div key={index} className='table-row prod-row' >
                            <div className="table-cell"> {cmd?.date_livraison} </div>
                            
                            <div className="table-cell"> 
                                { 
                                    cmd?.modeles?.map((prod, idx) => (
                                        <div key={idx} data-id={prod?.f1}> { prod?.f2 } (x{prod?.f5}) </div>
                                    ))
                                }
                            </div>

                            <div className="table-cell"> 
                                { 
                                    cmd?.modeles?.map((prod, ind) => (
                                        <div key={ind}> {prod?.f3} / {prod?.f4} </div>
                                    )) 
                                }
                            </div>
                            <div className="table-cell"> {cmd?.clients[0]?.f2} {cmd?.clients[0]?.f3} </div>
                            <div className="table-cell"> {cmd?.avance} </div>
                            <div className="table-cell"> {cmd?.total} </div>

                            <div className='options table-cell' data-status={finishedCommands}>
                            
                                <div className="option-btn" title="Valider" onClick={ () => C_dispatch({ type : DISPATCHERS.validate, id : cmd?.id })}> 
                                    { SVGS.done } 
                                </div>

                                <div className="option-btn" 
                                    title="Facture" 
                                    onClick={ () => C_dispatch({ 
                                        type : DISPATCHERS.print, 
                                        id : { 
                                            client : cmd?.clients[0].f1,
                                            commande : cmd?.id
                                        } }
                                    )}> { SVGS.print } </div>
                                
                                {/* <div className="option-btn" title="Modifier" onClick={ () => C_dispatch({ type : DISPATCHERS.confirm, id : cmd?.id })}> { SVGS.edit } </div> */}

                                <div className="option-btn" title="Supprimer" onClick={ () => C_dispatch({ type : DISPATCHERS.delete, id : cmd?.id })}> { SVGS.delete } </div>
                            
                            </div>
                                
                          </div>  
                        })
                    }

                </div>

            </div>
    <ToastContainer />
        </div>
    )
}

export default Commandes