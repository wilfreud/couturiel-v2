import ReactDom from 'react-dom'
import { useState } from 'react'
import logo from '../assets/logo.png'
import eye from '../assets/svg/eye.svg'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useMutation } from 'react-query'

function ConfirmAction({ ID, foreign, closeModal, modalText, actionType, refresh, goToComponent, trigger, extraData }){
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [showError, setShowError] = useState(false)

    const APIS = {
        'DELETE_MODEL' : window.api.deleteModel,
        'DELETE_CLIENT' : window.api.deleteClient,
        'DELETE_COMMANDE' : window.api.deleteCommande,
        'VALIDATE_COMMAND' : window.api.validateCommande,
        'DELETE_EMPLOYE' : window.api.deleteEmploye,
        'PAY_EMPLOYEES' : window.api.payEmployees
    }

    const { mutate, isError, error } = useMutation(  APIS[actionType], { onSuccess : refresh})

    const SVGS = {
        close : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
      </svg>
      
    }

    const litteMargin = { margin: "15px"}

    const defaultToast = {
        theme : 'dark',
        pauseOnFocusLoss : false, 
        pauseOnHover : false,
        autoClose : 4000
    }
    
    function deleteClient(){
        mutate({cli : ID, mes : foreign})
        if(isError){
            console.error("Error in client deletion :::", error)
            toast.error("Erreur lors de la suppression", defaultToast)
            return
        }

        toast.success("Client supprimé !", defaultToast)            
    }

    function deleteModel(){
        mutate(ID)
        if(isError){
            console.error("Error in model deletion :::", error)
            toast.error("Erreur lors de la suppression du modèle", defaultToast)
            return
        }
        toast.success("Modèle supprimé !", defaultToast)
    }

    function deleteCommande(){
        // console.log(ID)
        mutate(ID)
        if(isError){
            console.error("Error in commande deletion :::", error)
            toast.error("Erreur lors de la suppression de la commande", defaultToast)
            return
        }
        toast.success("Commande supprimée !", defaultToast)
    }

    function deleteEntry(){
        mutate(ID)
        if(isError){
            console.error("Error in entry deletion :::", error)
            toast.error("Erreur lors de la suppression de l'E/S", defaultToast)
            return
        }
        toast.success("Entrée/Sortie supprimé !", defaultToast)
    }

    function validateCommand(){
        const SEND = {
            id : ID, 
            caisse : extraData
        }
        // console.log(SEND) 
        // return
        mutate(SEND)
        if(isError){
            console.error("Error in command validation :::", error)
            toast.error("Erreur lors de la validation de la commande", defaultToast)
            return
        }
        toast.success("Commande validée !", defaultToast)
    }

    function deleteEmploye(){
        // console.log(ID)
        // return 
        mutate(ID)
        if(isError){
            console.error("Error in deleting employee :::", error)
            toast.error("Erreur lors de la suppression", defaultToast)
            return
        }
        toast.success("Employé supprimé", defaultToast)
    }

    function payEmployees(){
        mutate(ID)
        if(isError){
            console.error("Error in paying employees :::", error)
            toast.error("Erreur lors l'action", defaultToast)
            return
        }
        toast.success("Paiments enregistrés", defaultToast)
    }
        

    async function handleSubmit(e){
        
        e.preventDefault()
        setShowError(false)

        const canGO = await window.api.login({ passtype : (actionType?.toLowerCase()?.includes('delete') ? 'delete' : 'alter') , password : password })
        
        if(canGO === false) {
            setShowError(true)
            return
        }
        
        switch(actionType) {
            case 'DELETE_CLIENT':
                deleteClient()
                break
            case 'EDIT_CLIENT':
                goToComponent()
                break
            case 'EDIT_MODEL':
                goToComponent()
                return 
            case 'EDIT_EMPLOYEE':
                goToComponent()
                break
            case 'DELETE_MODEL':
                deleteModel()
                break
            case 'DELETE_ENTRY':
                trigger()
                break
            case 'DELETE_COMMANDE': 
                deleteCommande()
                break
            case 'DELETE_EMPLOYE':
                deleteEmploye()
                break
            case 'VALIDATE_COMMAND':
                validateCommand()
                break
            case 'EDIT_COMMANDE':
                goToComponent()
                break
            case 'PAY_EMPLOYEES':
                payEmployees()
                break
            default:
                console.warn("Unknowm action specifier on form submit")
        }
        // console.log('REACHING HERE', goToComponent)
        if(actionType === "EDIT_EMPLOYEE" || actionType === "EDIT_COMMANDE") return
        closeModal()
    }

    return ReactDom.createPortal(
        <div className="popup">

            <div className="close-modal-contain">
                <div className="close-modal" onClick={closeModal}>
                    {SVGS.close}
                </div>
            </div>

            <img src={logo} id="logo" alt="Tailor brand" style={{...litteMargin}} />
            
            <h3 style={{color : "red", fontStyle : "italic"}}> 
                {modalText} 
            </h3>

            <form id="form-field" onSubmit={e => handleSubmit(e, "DELETE_CLIENT")}>
                    <div 
                        id="type-password" 
                        style={{margin: "0 3em"}}
                        onAnimationEnd={() => setShowError(false)} 
                        className={showError ? "error" : ""}
                    >
                        
                        <input 
                            type={showPassword ? "text" : "password"} 
                            autoFocus 
                            autoComplete="off"
                            // required
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            // placeholder="Mot de passe" 
                        />
                        
                        <img 
                            id="show-password" 
                            src={eye}
                            draggable={false}
                            alt="Password visibility" 
                            onMouseDown={() => setShowPassword(true)} 
                            onMouseUp={() => setShowPassword(false)} 
                        />
                    </div>  
                    <button 
                        className="connect-btn" 
                        type="submit"
                    >
                        
                        Confirmer
                    </button>
                </form>
        </div>

    , document.getElementById('modal-portal'))
    
}

export default ConfirmAction