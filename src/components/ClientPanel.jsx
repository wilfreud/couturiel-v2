import ReactDom from 'react-dom'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useMutation, useQuery } from 'react-query'
import '../style/ClientPanel.css'

function ClientPanel({closeModal, editMode, ID, refresh}){

    const { register, handleSubmit, reset } = useForm()
    const { mutate : mutateClient, isError, error} = useMutation(editMode ? window.api.updateClient : window.api.addClient, { onSuccess : refresh })
    
    const { data : EM_data, isError : EM_isError, error : EM_error} = useQuery(['edit-client', ID], () => {
        return window.api.getClientAllInfos(ID)
    },
    {
        refetchOnMount : false,
        refetchOnWindowFocus : false,
        enabled : editMode ? true : false,
        cacheTime : false
    })

    const SVGS = {
        close : <svg onClick={closeModal} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
      </svg>
      
    }

    useEffect(() => {
        // console.log("reseting form...")
        reset(EM_data)
    }, [EM_data])

    const defaultToast = {
        theme : 'dark',
        pauseOnFocusLoss : false, 
        pauseOnHover : false,
        autoClose : 4000
    }

    function handleForm(data){

        const infos = editMode ? {
            client : [data?.nom, data?.prenom, data?.tel, data?.adresse, ID],
            mesures  : [
                data?.tour_ceinture || null,
                data?.fesse || null,
                data?.cuisse || null,
                data?.longueur_pantalon || null,
                data?.bas_pantalon || null,
                data?.tour_cou || null,
                data?.epaules || null,
                data?.tour_poitrine || null,
                data?.tour_bras || null,
                data?.manche || null,
                data?.tour_manche || null,
                data?.longueur_haut || null,
                data?.blouse || null,
                data?.taille || null,
                data?.mollet || null,
                EM_data?.mesuresid
            ]
        }
        : {
            client : [data?.nom, data?.prenom, data?.tel, data?.adresse],
            mesures  : [
                data?.tour_ceinture || null,
                data?.fesse || null,
                data?.cuisse || null,
                data?.longueur_pantalon || null,
                data?.bas_pantalon || null,
                data?.tour_cou || null,
                data?.epaules || null,
                data?.tour_poitrine || null,
                data?.tour_bras || null,
                data?.manche || null,
                data?.tour_manche || null,
                data?.longueur_haut || null,
                data?.blouse || null,
                data?.taille || null,
                data?.mollet || null
            ]
        }
        // console.log(data)
        // return
        mutateClient(infos)

        if(isError){
            console.error(error)
            toast.error('Erreur ajout de client', defaultToast)
            return
        }

        if (EM_isError){
            console.error(error)
            toast.error('Erreur modification du client', defaultToast)
            return
        }

        toast.success(`Client ${editMode ? 'modifié' : 'ajouté'}`, defaultToast)
        closeModal()
    }

    if(EM_isError) {
        console.error(EM_error.message)
        return ReactDom.createPortal(
            <div>
                { SVGS.close }
                <h2 style={{ color : "red"}}> Erreur lors du chargement des informations </h2>
            </div>
        , document.getElementById('modal-portal'))
    }
// console.log(EM_data)
    return ReactDom.createPortal(
        <div className="popup">

            <div className="close-modal-contain">
                <div className="close-modal">
                    {SVGS.close}
                </div>
            </div>

            <h2 className="add-client-title"> {editMode ? 'Modifier' : 'Ajouter'} un client </h2>
                <div className="display-errror">
                </div>

                <form className="modal-content" onSubmit={handleSubmit(handleForm)}>
                    <div className="form-part first-part">
                        <input {...register('prenom', {required : true})} type="text" className="form-field"  placeholder='prénom' defaultValue={ editMode ? EM_data?.prenom : null } />
                        <input {...register('nom', {required : true})} type="text" className="form-field"  placeholder='nom' defaultValue={ editMode ? EM_data?.nom : null } />
                        <input {...register('tel')} type="text" className="form-field"  placeholder='tel' defaultValue={ editMode ? EM_data?.tel : null } />
                        <input {...register('adresse')} type="text" className="form-field"  placeholder='adresse' defaultValue={ editMode ? EM_data?.adresse : null } />
                    </div>

                    <div className="form-part second-part">
                        <input type="text" className="form-field" {...register('tour_ceinture')}  placeholder='Tour de ceinture' />
                        <input type="text" className="form-field" {...register('fesse')}  placeholder='Fesse' />
                        <input type="text" className="form-field" {...register('cuisse')}  placeholder='Cuisse' />
                        <input type="text" className="form-field" {...register('longueur_pantalon')}  placeholder='Longueur pantalon' />
                        <input type="text" className="form-field" {...register('bas_pantalon')}  placeholder='Bas pantalon' />
                        <input type="text" className="form-field" {...register('tour_cou')}  placeholder='Tour de cou' />
                        <input type="text" className="form-field" {...register('epaules')}  placeholder='Epaules' />
                        <input type="text" className="form-field" {...register('tour_poitrine')}  placeholder='Tour de poitrine' />
                        <input type="text" className="form-field" {...register('tour_bras')}  placeholder='Tour de bras' />
                        <input type="text" className="form-field" {...register('manche')}  placeholder='Manche' />
                        <input type="text" className="form-field" {...register('tour_manche')}  placeholder='Tour de manche' />
                        <input type="text" className="form-field" {...register('longueur_haut')}  placeholder='Longueur haut' />
                        <input type="text" className="form-field" {...register('blouse')}  placeholder='Blouse' />
                        <input type="text" className="form-field" {...register('taille')}  placeholder='Taille' />
                        <input type="text" className="form-field" {...register('mollet')}  placeholder='Mollet' />
                    </div>

                        <button type="submit" className="validate-form"> Enregistrer </button>
                </form>

        </div>
    , document.getElementById('modal-portal'))
}

export default ClientPanel