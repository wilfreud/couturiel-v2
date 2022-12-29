import { useQuery } from 'react-query'
import { useState, useReducer, useDeferredValue } from 'react'
import Searchbar from '../components/Searchbar'
import ClientView from '../components/ClientView'
import ConfirmAction from '../components/ConfirmAction'
import ClientPanel from '../components/ClientPanel'
import MesuresClient from '../components/MesuresClient'
import { ToastContainer } from 'react-toastify'


import '../style/Clients.css'

function conditionalRenderReducer(state, action){

    switch (action.type) {
        case 'DELETE_MODE':
            return {delete : !state.delete}
        
        case 'EDIT_MODE' : 
            return {edit : !state.edit}

        case 'VIEW_MODE' :
            return {view : !state.view}

        case 'CREATE_MODE' :
            return {create : !state.create}

        case 'PRINT_MODE' :
            return {print : !state.print}
        default:
            console.log("trying to acces unrecognized dispatcher")
            break;
    }
}

function Clients(){

    const [ IDtoProp, setIDtoProp ] = useState(null)
    const [ IDMesures, setIDMesures ] = useState(null)

    // Conditional rendering
    const [ CR_state, CR_dispatch ] = useReducer(
        conditionalRenderReducer, 
        { delete : false, edit : false, view : false, create : false, print : false }
    )
    const [askPermission, setAskPermission] = useState(false)
    
    const DISPATCHERS = {
        delete : 'DELETE_MODE',
        edit : 'EDIT_MODE',
        view : 'VIEW_MODE',
        create : 'CREATE_MODE',
        print : 'PRINT_MODE'
    }

    // Related to string filtering
    const [findString, setFindString] = useState('')
    const substring = useDeferredValue(findString)
    function findSubString(obj){
        return obj?.prenom.toLowerCase().includes(substring?.toLowerCase()) 
                || obj?.nom.toLowerCase().includes(substring?.toLowerCase()) 
                || obj?.tel.toLowerCase().includes(substring?.toLowerCase())
    }

    // Fetch data
    const { isLoading, data, isError, error, refetch } = useQuery( 'all-clients', () => { return window.api.getClients() }, {
        refetchOnWindowFocus : false
    })    

    // SVGS in JSX
    const SVGS = {
        plus : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#272727" className="w-6 h-6">
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
      </svg>,
        delete : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>,
        eye : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
    </svg>,
        edit : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
        <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
      </svg>,
        print : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#eac23d" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
  </svg>      
    }

    if(isLoading) return (<h2> Chargement de la liste... </h2>)

    if(isError) return (<h2 style={{ color : "red"}}> {error.message} </h2>)


    return (
        <div className="App-main-container carousel">
            <Searchbar setSearch={setFindString} />
            <div className="component-body">

                { CR_state.view ? 
                    <ClientView 
                        closeModal={ () => CR_dispatch( {type : DISPATCHERS.view } ) } 
                        ID={IDtoProp}
                    />
                    : null
                }

                { CR_state.delete ? 
                    <ConfirmAction 
                        closeModal={ () => CR_dispatch( {type : DISPATCHERS.delete } ) } 
                        ID={IDtoProp}
                        foreign={IDMesures}
                        modalText="Supprimer client ?"
                        refresh={refetch}
                        actionType="DELETE_CLIENT"
                    />
                    : null
                }

                { CR_state.create ? 
                    <ClientPanel 
                        closeModal={ () => CR_dispatch( {type : DISPATCHERS.create } ) }
                        // updateView={ (newRow) => data.unshift(newRow) }
                        refresh={refetch}
                    />
                    : null
                }

                { askPermission ? 
                    <ConfirmAction
                        closeModal={ () => setAskPermission(false)}
                        modalText={"Autoriser des modifications"}
                        goToComponent={ () => CR_dispatch( {type : DISPATCHERS.edit} )}
                        actionType="EDIT_CLIENT"
                    />
                    : null
                }

                { CR_state.edit ? 
                    <ClientPanel 
                        closeModal={ () => CR_dispatch( {type : DISPATCHERS.edit } ) }
                        editMode={true}
                        refresh={refetch}
                        ID={IDtoProp}
                    />
                    : null
                }

                { 
                    CR_state.print
                    ? <MesuresClient
                        ID={IDtoProp}
                        closeModal={ () => CR_dispatch( {type : DISPATCHERS.print})}
                    />
                    : null
                }

                <div className="add-client" onClick={() => CR_dispatch( { type : DISPATCHERS.create } )}> 
                    { SVGS.plus } 
                </div>
                
                <div className="clients-container">
                    <div className="client-line table-header">
                        <span className="client-cell"> Prénom </span>
                        <span className="client-cell"> Nom </span>
                        <span className="client-cell"> Téléphone </span>
                        <span className="client-cell"> Commandes </span>
                        <span className="client-cell"> Options </span>
                    </div>
                    <div className="table-body">
                        { 
                            data?.filter(cli => findSubString(cli))
                            .map( (client) => (
                                <div className="client-line" key={client.id} >
                                    <span className="client-cell prenom"> { client?.prenom } </span>
                                    <span className="client-cell nom"> { client?.nom } </span>
                                    <span className="client-cell tel"> { client?.tel } </span>
                                    <span className="client-cell commades"> { client?.commandes } </span>
                                    <span className="client-cell options"> 
                                        <span className="svg-span" 
                                            onClick={ () => {
                                                setIDtoProp(client?.id)
                                                CR_dispatch( { type : DISPATCHERS.view } )
                                            } }
                                        > 
                                            { SVGS.eye } 
                                        </span>

                                        <span className="svg-span" 
                                            onClick={ () => {
                                                setIDtoProp(client.id)
                                                setAskPermission(true)
                                            } }
                                        > 
                                            { SVGS.edit } 
                                        </span>

                                        <span className="svg-span" 
                                            onClick={ () => {
                                                setIDtoProp(client.id)
                                                setIDMesures(client.mesuresid)
                                                CR_dispatch( { type : DISPATCHERS.print } )
                                            } }
                                        > 
                                            { SVGS.print } 
                                        </span>

                                        <span className="svg-span" 
                                        onClick={ () => {
                                            setIDtoProp(client?.id)
                                            // setIDMesures(client.mesuresid)
                                            CR_dispatch( { type : DISPATCHERS.delete } )
                                            } }
                                        > 
                                            { SVGS.delete } 
                                        </span>

                                    </span>
                                </div>
                            ))
                        }                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Clients