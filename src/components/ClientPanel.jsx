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
// console.log(data)
// return
        const infos = editMode ? {
            client : [data?.nom, data?.prenom, data?.tel, data?.email, data?.notes, ID],
            mesures  : [
                data?.cou || null,
                data?.epaule || null,
                data?.poitrine || null,
                data?.taille || null,
                data?.ceinture || null,
                data?.petite_hanche || null,
                data?.hanche || null,
                data?.hauteur_taille || null,
                data?.l_manche_1 || null,
                data?.l_manche_2 || null,
                data?.l_haut_1 || null,
                data?.l_haut_2 || null,
                data?.l_veste_ou_manteau || null,
                data?.l_jupe_t_h || null,
                data?.long_jupe_1 || null,
                data?.long_jupe_2 || null,
                data?.l_robe_1 || null,
                data?.l_robe_2 || null,
                data?.l_pant || null,
                data?.tour_de_bras || null,
                data?.dessus_poitrine || null,
                EM_data?.mesuresid
            ]
        }
        : {
            client : [data?.nom, data?.prenom, data?.tel, data?.email, data?.notes],
            mesures  : [
                data?.cou || null,
                data?.epaule || null,
                data?.poitrine || null,
                data?.taille || null,
                data?.ceinture || null,
                data?.petite_hanche || null,
                data?.hanche || null,
                data?.hauteur_taille || null,
                data?.l_manche_1 || null,
                data?.l_manche_2 || null,
                data?.l_haut_1 || null,
                data?.l_haut_2 || null,
                data?.l_veste_ou_manteau || null,
                data?.l_jupe_t_h || null,
                data?.long_jupe_1 || null,
                data?.long_jupe_2 || null,
                data?.l_robe_1 || null,
                data?.l_robe_2 || null,
                data?.l_pant || null,
                data?.tour_de_bras || null,
                data?.dessus_poitrine || null,
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
                        <input {...register('prenom', {required : true})} type="text" autoFocus className="form-field"  placeholder='prénom' />
                        <input {...register('nom', {required : true})} type="text" className="form-field"  placeholder='nom' />
                        <input {...register('tel')} type="text" className="form-field"  placeholder='tel' />
                        <input {...register('email')} type="text" className="form-field ignore-capitalize-form-field"  placeholder='email'/>
                        <textarea {...register('notes')} type="text" className="form-field notes"  placeholder='notes'/>
                    </div>

                    <div className="form-part second-part">
                        <input type="text" className="form-field" {...register('cou')}  placeholder='cou' />
                        <input type="text" className="form-field" {...register('epaule')}  placeholder='epaule' />
                        <input type="text" className="form-field" {...register('poitrine')}  placeholder='poitrine' />
                        <input type="text" className="form-field" {...register('taille')}  placeholder='taille' />
                        <input type="text" className="form-field" {...register('ceinture')}  placeholder='ceinture' />
                        <input type="text" className="form-field" {...register('petite_hanche')}  placeholder='petite hanche' />
                        <input type="text" className="form-field" {...register('hanche')}  placeholder='hanche' />
                        <input type="text" className="form-field" {...register('hauteur_taille')}  placeholder='hauteur taille' />
                        <input type="text" className="form-field" {...register('l_manche_1')}  placeholder='l manche 1' />
                        <input type="text" className="form-field" {...register('l_manche_2')}  placeholder='l manche 2' />
                        <input type="text" className="form-field" {...register('l_haut_1')}  placeholder='l haut 1' />
                        <input type="text" className="form-field" {...register('l_haut_2')}  placeholder='l haut 2' />
                        <input type="text" className="form-field" {...register('l_veste_ou_manteau')}  placeholder='l veste ou manteau' />
                        <input type="text" className="form-field" {...register('l_jupe_t_h')}  placeholder='l jupe t h' />
                        <input type="text" className="form-field" {...register('long_jupe_1')}  placeholder='long jupe 1' />
                        <input type="text" className="form-field" {...register('long_jupe_2')}  placeholder='long jupe 2' />
                        <input type="text" className="form-field" {...register('l_robe_1')}  placeholder='l robe 1' />
                        <input type="text" className="form-field" {...register('l_robe_2')}  placeholder='l robe 2' />
                        <input type="text" className="form-field" {...register('l_pant')}  placeholder='l pant' />
                        <input type="text" className="form-field" {...register('tour_de_bras')}  placeholder='tour de bras' />
                        <input type="text" className="form-field" {...register('dessus_poitrine')}  placeholder='dessus poitrine' />
                    </div>

                        <button type="submit" className="validate-form"> Enregistrer </button>
                </form>

        </div>
    , document.getElementById('modal-portal'))
}

export default ClientPanel