import ReactDom from 'react-dom'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from 'react-query'
import { toast } from 'react-toastify'
import '../style/ComamndesPanel.css'



function CommandesPanel({ editMode, refresh, ID, closeModal }) {
  // console.log(ID)

    const SVGS = {
        plus : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#272727" className="w-6 h-6">
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
      </svg>,

      plusCircle : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
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
      close : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>,
      minus : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  
    }

    const defaultToast = {
      theme : 'dark',
      pauseOnFocusLoss : false, 
      pauseOnHover : false,
      autoClose : 4000
   }



    const [newModel, setNewModel] = useState() 

    const { register, handleSubmit, formState : formError, reset } = useForm()

    const {data : clients } = useQuery('fetch-clients', window.api.getClientsForCommandes, {
      cacheTime : false,
      refetchOnWindowFocus : false
    })

    const  { data : modeles, refetch : refetchModels } = useQuery('fetch-models-by-category', window.api.getModelsByCategory, {
      cacheTime : false,
      refetchOnWindowFocus : false
    })

    const { mutate, isError : isMutationError, error : mutationError} = useMutation(window.api.addCommande, {
      onSuccess : refresh
    })

    const { data : tenues } = useQuery('get-tenues', window.api.getAllTenues)
    const { data : accessoires } = useQuery('get-accessoires', window.api.getAllAccessoires)


    const  { mutate : addNewModel } = useMutation(window.api.addModel, { onSuccess : refetchModels, onError : () => console.error("Failed to add sub-model") })

    const [ArrayOfModels, setArrayOfModels] = useState([])
    const [ modelQuantite, setModelQuantite ] = useState(1)

    // const [ OtherArrayOfModels, setOtherArrayOfModels ] = useState([])
    const [otherName ,setOtherName] = useState('')
    const [otherColor, setOtherColor] = useState('')
    const [otherTaille, setOtherTaille] = useState('')
    const [otherPrix, setOtherPrix] = useState('')

    const [ hideExtraModels, setHideExtraModels ] = useState(false)


    function resetManualFields(){
      // setOtherArrayOfModels('')
      setOtherName('')
      setOtherColor('')
      setOtherTaille('')
      setOtherPrix('')
    }

    function handeMaualModelAdd(){
      if(!otherName || !otherColor || !otherTaille || !otherPrix){
        toast.warn("Veuillez remplir tous les champs pour ajouter un modèle personnalisé !", defaultToast)
        return
      }

      const SEND = {
        query1 : [otherName, 0], 
        query2 : [otherTaille, 1, otherColor, otherPrix],
        path : null
      }

      addNewModel(SEND)

      resetManualFields()
    }


    function handleForm(data){
      if(data.proprietaire === 'default' || ArrayOfModels.length === 0) return
   
      const SEND = {
        produits : formatContenuCommade(ArrayOfModels),
        query1 : [data?.proprietaire || null, data?.date_livraison || null, data?.avance || 0, data?.remise || 0, (computeTotalCommande() - Number(data?.remise) - Number(data?.avance) + Number(data?.livraison))
        , data?.livraison || 0, data?.adresse || null]
      }
      
      mutate(SEND)

      if(isMutationError){
        console.error(mutationError)
        toast.error(`Erreur d'enregistrement...`, defaultToast)
        return
      }
      setHideExtraModels(true)
      toast.success(`Commande enregistrée`, defaultToast)
      closeModal()

    }


    function handleMiniForm(){
      if(!newModel || newModel === 'default' || !modelQuantite) return
      
      const newOBJ = modeles.find( m => m.id === newModel)
      // console.log(newModel, newOBJ)
      // ArrayOfModels.push(newOBJ)
      // console.log([...ArrayOfModels, {...newOBJ, quantite : modelQuantite}])
      setArrayOfModels([...ArrayOfModels, {...newOBJ, quantite : modelQuantite}])
      setNewModel('default')
      setModelQuantite(1)
      
      // console.log(ArrayOfModels)
    }

    function computeTotalCommande(){
      const total = ArrayOfModels.reduce((runningTotal, value) => {
        return runningTotal + (Number(value?.quantite) * Number(value?.prix))
      }, 0)

      return total
    }

    function formatContenuCommade(contenu){
      const newData = contenu?.map( item => ({item : item?.id, quantite : item?.quantite}) ) || null
      return newData
    }

    function dropProduct(index, id){

      const newArray = ArrayOfModels.reduce((acc, curr) =>{
        if (curr.id !== id) acc.push(curr)
        return acc
      }, [])

      console.log(newArray)

      setArrayOfModels(newArray)
    }

  return ReactDom.createPortal(
    
  
    <div className="popup">
        <div className="close-modal-contain">
            <div className="close-modal" onClick={closeModal}>
                {SVGS.close}
            </div>
        </div>

        { 
            <form onSubmit={handleSubmit(handleForm)} className="modal-content override-fsz">
                 
                <h2 className="add-client-title"> {editMode ? "Modifier" : "Créer"} une commande </h2>

                {/* FORM HEADER */}
                <div className="form-part">
                    <select {...register('proprietaire', { required: true })} defaultValue={"default"} className="input-select" >
                      <option value="default" disabled hidden> Choisir client... </option>
                      {
                        clients?.map((client, index) => (
                          <option value={client?.id} key={index}> {client?.prenom + " " + client?.nom} </option>
                        ))
                      }
                    </select>
                    <input type="date" {...register('date_livraison')} className="form-field" />
                </div>

                      {/* DISPAY SELECTED MODELS */}
                <div className="form-part">
                  {
                    ArrayOfModels?.map((model, index) => (
                      <div  className="form-product" key={index}>
                        <input type="text" className="form-field" value={`${model?.nom_modele} x${model?.quantite} (${model?.taille}, ${model?.couleur})`} disabled  />

                        <div className="minus" onClick={() => dropProduct(index, model?.id)}>
                          {SVGS.minus}
                        </div>
                      </div>
                    ))  
                  }

                </div>

                  {/* SELECT MODEL */}
                  <div className="add-product">
                    <select className="input-select" defaultValue="default" value={newModel} onChange={ (e) => setNewModel(Number(e.target.value)|| null)}>
                      <option value="default" disabled hidden> Modèle (taille, couleur) </option>
                      {
                        modeles?.map((md, index) => (
                          <option value={md?.id} key={index}> {md?.nom_modele} ({md?.taille}, {md?.couleur}) </option>
                        ))
                      }
                    </select> 
                    <input type="number" placeholder="Quantite" className="form-field" min={1} value={modelQuantite} onChange={(e) => setModelQuantite(Number(e.target.value) || 1)}/>
                    <div className="add-new-cmd" title='Ajouter' onClick={ handleMiniForm }> {SVGS.plusCircle} </div>
                  </div>


                      {/* INPUT CUSTOM MODEL */}
                  {
                  (hideExtraModels===false) 
                    ? <div className="add-product override-grid">
                        <input className="form-field" value={otherName} onChange={(e) => setOtherName(e.target.value)} type="text" placeholder="Autre modèle" />
                        <input className="form-field" value={otherColor} onChange={(e) => setOtherColor(e.target.value)} type="text" placeholder="Couleur" />
                        <input className="form-field" value={otherTaille} onChange={(e) => setOtherTaille(e.target.value)} type="text" placeholder="Taille" />
                        <input className="form-field" value={otherPrix} onChange={(e) => setOtherPrix(Number(e.target.value) || 0)} type="number" min="0" placeholder="Prix unitaire" />
                        {/* <div className="add-new-cmd" title='Ajouter' onClick={ handeMaualModelAdd }> {SVGS.plusCircle} </div> */}
                        <button className="sauvegarder" onClick={handeMaualModelAdd}>Sauvegarder</button>
                      </div>
                    : null
                  }

                      {/* FORM FOOTER */}
                  <div className="form-part">
                    <div className="form-part">
                      Avance : <input className="form-field" type="number" {...register('avance', {min : 0})} defaultValue={0} placeholder="Avance" />
                      Remise : <input className="form-field" type="number" {...register('remise', {min : 0})} defaultValue={0} placeholder="Avance" />
                      Livraison : <input className="form-field" type="number" {...register('livraison', {min : 0})} defaultValue={0} placeholder="Livraison" />
                      Adresse : <input className="form-field" type="text" {...register('adresse')} defaultValue={''} placeholder="Adresse" />
                    </div>
                    
                    <div>
                      Total : <span> { computeTotalCommande() } </span>
                    </div>

                  </div>
                <input type="submit" value="Enregistrer" className="validate-form" />
            </form> 
        }
        
    </div>
  
,document.getElementById('modal-portal'))
}

export default CommandesPanel