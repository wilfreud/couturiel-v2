import ReactDom from 'react-dom'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import '../style/AddModel.css'


function AddModel({ closeModal, categorie, refresh, ID, editMode }){
    
    const CATEGORIES = {
        getzner : 1,
        supercent : 2,
        accessoires : 3
    }
    const { register, handleSubmit } = useForm()
    const { mutate : mutateModel, isError : errorMutatingModel, error : modelMultateERROR } = useMutation( editMode ? window.api.updateModel : window.api.addModel, { onSuccess : refresh } )

    const { data : thisModelData, isLoading : thisModelIsLoading, isError : thisModelIsError, error : thisModelError } = useQuery('get-model-to-update',
            () => {return window.api.getOneModel(ID)},
            {
                onSuccess : refresh,
                refetchOnWindowFocus : false,
                enabled : editMode ? true : false,
                cacheTime : false
            }
        )


    const defaultToast = {
        theme : 'dark',
        pauseOnFocusLoss : false, 
        pauseOnHover : false,
        autoClose : 4000
    }

    function handleForm(data){
        
        const infos = {
            path : data?.image[0]?.path || null,
            modelID : thisModelData?.id,
            infosID : thisModelData?.infos_id, 
            query1 : editMode ? [data?.modele] : [data?.modele, CATEGORIES[categorie]],
            query2 : [data?.taille || null, data?.quantite || 0, data?.couleur || null, data?.prix || null]
        }
        // console.log(thisModelData)
        
        // console.log(infos)
        // return
        
        mutateModel(infos)

        if(errorMutatingModel){
            console.error('Error adding/modifying model', modelMultateERROR)
            toast.error(`Erreur lors de ${ editMode ?  "la modifications" : "l'ajout"} du modèle`, defaultToast)
            return
        }
        toast.success(`Modèle ${ editMode ? "modifié" : "ajouté" }!`, defaultToast)
        closeModal()
    }


    const SVGS = {
        close : <svg onClick={closeModal} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
      </svg>
      
    }

    return ReactDom.createPortal(
        <div className="popup">

            <div className="close-modal-contain">
                <div className="close-modal">
                    {SVGS.close}
                </div>
            </div>

            <h3 className="golden">
                Ajouter un modèle
                <br />
                <span className="capitalize">
                    ({categorie})    
                </span>
            </h3>
            {
                editMode && (thisModelIsLoading || thisModelIsError)
                ? <h3> { thisModelIsLoading ?  "Chargement des informations..." : "Erreur lors du chargement des informations"} </h3> 
                :
                <form onSubmit={handleSubmit(handleForm)} className="modal-content">

                    <div className=" file-upload">
                        <input type="file" {...register('image', { required : editMode ? false : true })} className="form-field file-input" accept="image/*" />
                    </div>

                    <div className="form-part">
                        <input className="form-field" type="text" {...register('modele', {required : true})} placeholder="Nom du modèle" defaultValue={editMode ? thisModelData?.nom_modele : null} />
                        {/* <input disabled {...register('categorie', { required : true })} value={categorie} className="select-input form-field categorie" /> */}

                        <input type="text" className="form-field" {...register('couleur')} placeholder="Couleur" defaultValue={editMode ? thisModelData?.couleur : null} />

                        <input type='text' {...register('taille', { required : true})} className="form-field" placeholder="Taille" defaultValue={editMode ? thisModelData?.taille : null} />
                        

                        <input type="number" {...register('quantite', {required : true})} placeholder="Quantité" className="form-field" defaultValue={editMode ? thisModelData?.quantite : null} />
                        <input type="number" {...register('prix', {required : true, min : 0})} placeholder="Prix" className="form-field" defaultValue={editMode ? thisModelData?.prix : null} />


                    </div>


                    <input type="submit" value="Enregistrer" className="validate-form" />
                </form>
        }
        </div>
    , document.getElementById('modal-portal'))
}


export default AddModel