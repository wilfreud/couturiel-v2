import  ReactDom  from "react-dom"
import { useEffect } from "react"
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from "react-query"
import { toast } from 'react-toastify'

function SalairesPanel({ closeModal, ID, editMode, refresh } ){

    const defaultToast = {
        theme : 'dark',
        pauseOnFocusLoss : false, 
        pauseOnHover : false,
        autoClose : 4000
    }

    const SVGS = {
        close : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
      </svg>
      
    }

    const { data : employee } = useQuery('get-emplye-infos', () => window.api.getEmployeeInfos(ID), {
        refetchOnWindowFocus : false,
        enabled : editMode,
        cacheTime : false
    } )

    const { register, formState : { errors }, handleSubmit, reset } = useForm()
    const { mutate, isError, error } = useMutation( editMode ? window.api.updateEmployee : window.api.addEmploye, { onSuccess : refresh } )

    useEffect(() => {
        console.log("reseting form")
        reset(employee)
    }, [employee])


    function handleForm(data){
        const SEND = editMode ? [data?.prenom, data?.nom, data?.telephone || null, data?.salaire || 0, ID] : [data?.prenom, data?.nom, data?.telephone || null, data?.salaire || 0]
        // console.log(SEND)
        
        mutate(SEND)

        if(isError){
            console.error(error)
            toast.error(`Echec lors de ${ editMode ? "la modification" : "l'ajout"}`, defaultToast)
            return
        }

        toast.success(`Employé ${editMode ? "modifié" : 'ajouté'}`, defaultToast)
        closeModal()
    }




    return ReactDom.createPortal(

        <div className="popup">
            <div className="close-modal-contain">
                <div className="close-modal" onClick={closeModal}>
                    {SVGS.close}
                </div>
            </div>

            <h2 className="add-client-title">{editMode ? 'Modifier' : 'Enregistrer'} un employé</h2>

            <div className="display-error">
                { 
                    errors?.prenom
                    ? errors.prenom?.message
                    : null 
                }

                { 
                    errors?.nom
                    ? errors.nom?.message
                    : null 
                }
                
                { 
                    errors?.salaire
                    ? errors.salaire?.message
                    : null 
                }
            </div>

            <form className="modal-content" onSubmit={handleSubmit(handleForm)}>
                <div className="form-part">
                    <input className="form-field" type="text" {...register('prenom', {required: "Prénom requis !"})} placeholder="Prénom" />
                    <input className="form-field" type="text" {...register('nom', {required: "Nom requis !"})} placeholder="Nom" />
                    <input className="form-field" type="text" {...register('telephone')} placeholder="Télephone" />
                    <input className="form-field" type="number" {...register('salaire', {required : "Salaire invalide !"})} placeholder="salaire" />
                </div>

            <input type="submit" value="Enregistrer" className="validate-form"/>
            
            </form>

        </div>

     ,document.getElementById('modal-portal'))

}

export default SalairesPanel