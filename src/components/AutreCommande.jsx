import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useQuery } from 'react-query'
import AutreFacture from './AutreFacture.jsx'
import { toast, ToastContainer } from 'react-toastify'
import '../style/AutreFacture.css'

function AutreCommande() {

    const navigate = useNavigate()

    const [ showFacture, setShowFacture ] = useState(false)
    const [ produits, setProduits ] = useState([])

    const { data : tenues } = useQuery('get-tenues', window.api.getAllTenues)
    const { data : accessoires } = useQuery('get-accessoires', window.api.getAllAccessoires)

    function goBack(){
        navigate(-1)
    }

    const SVGS = {
        back : <svg onClick={goBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
        </svg>,
        delete : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>,
        plus : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#272727" className="w-6 h-6">
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
        </svg>,
        edit : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
        <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
        </svg>,

        plusCircle : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#272727" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    }

    const defaultToast = {
        theme : 'dark',
        pauseOnFocusLoss : false, 
        pauseOnHover : false,
        autoClose : 4000
     }
  
    const { register, handleSubmit, getValues, reset } = useForm()

    function handleForm(data){
        // console.log(data)
        // console.log(getValues())
        toggleFacture()
    }

    function toggleFacture(){
        setShowFacture(!showFacture)
    }

    function prushProduct(){
        if(!getValues('quantite') || getValues('quantite') < 1 || !getValues('modele')) {
            toast.error("Quantité / modèle incorrecte", defaultToast)
            return
        }

        setProduits([...produits, getValues()])
        reset({modele : "", quantite : 1})
    }

    function computeTotal(){
        // console.log(produits)
        const total = produits?.reduce((previousValue, currentValue) => {
            const newValue = JSON.parse(currentValue?.modele)
            return previousValue + (Number(newValue?.prix) * Number(currentValue?.quantite))
        }, 0) || 0

        // console.log(total)
        return total 
    }



  return (
    <div className="main-container">
        <div className="go-back">
            {SVGS.back}
        </div>

        {
            showFacture
            ? <AutreFacture 
                closeModal={ toggleFacture }
                data={ {
                    proprietaire : getValues('proprietaire'),
                    telephone : getValues('telephone'), 
                    remise : getValues('remise'),
                    total : (computeTotal() - getValues('remise') || 0),
                    modeles : produits
                } }
                />
            : null
        }


        <form className="form-body override-autre-cmd-input" onSubmit={handleSubmit(handleForm)}>

            <div className="form-part">
                <input type="text" {...register('proprietaire', { required: true})} className="form-field" placeholder="Proprietaire" />
                <input type="text" {...register('telephone')} className="form-field" placeholder="Telephone" />
            </div>

            <div className="form-part">
                <select {...register('modele')} defaultValue="" className="input-select">
                    <option value="" disabled>Choisir modèle</option>
                    <optgroup label="Tenues">
                    {
                        tenues?.map((mod, index) => (
                          <option value={JSON.stringify(mod)} key={index}> {mod?.nom_modele} ({mod?.taille}, {mod?.couleur}) </option>
                        ))
                      }
                    </optgroup>

                    <optgroup label="Accessoires">
                    {
                        accessoires?.map((mod, index) => (
                          <option value={JSON.stringify(mod)} key={index}> {mod?.nom_modele} ({mod?.taille}, {mod?.couleur}) </option>
                        ))
                      }
                    </optgroup>
                </select>

                <input type="number" {...register('quantite')} className="form-field" placeholder="Quantite"/>
                <div className="add-new-cmd" onClick={ prushProduct } title="Ajouter"> { SVGS.plusCircle } </div>
            </div>

            <div className="form-part">
                <input type="text" {...register('remise')} className="form-field" placeholder="Remise" />
                <span className="golden"> Total : {computeTotal()} </span>
            </div>

            <input type="submit" value="Imprimer" className="validate-form"/>
        </form>
        <ToastContainer/>
    </div>
  )
}

export default AutreCommande