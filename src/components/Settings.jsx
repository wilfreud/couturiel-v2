import ReactDom from 'react-dom'
import { useMutation } from 'react-query'
import { useForm } from 'react-hook-form'
import '../style/Settings.css'
import {ToastContainer, toast} from 'react-toastify'
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom'


function Settings({ closeModal }){
    
    const navigate = useNavigate()
const location = useLocation()
console.log(location.pathname)
    const { register : registerLoginForm, handleSubmit : handleSubmitLogin, getValues : getLoginPasswordValue, reset : resetLogin } = useForm()
    const { register : registerLoginOther, handleSubmit : handleSubmitOther, getValues : getLoginOtherdValue, reset : resetOther } = useForm()
    const { register : registerLoginSecondOther, handleSubmit : handleSubmitSecondOther, getValues : getLoginSecondOther, reset : resetSecondOther } = useForm()

    const { mutate, isError, error } = useMutation(window.api.changePassword)

    const SVGS = {
        close : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
      </svg> 
    }

    const defaultToast = {
        theme : 'dark',
        pauseOnFocusLoss : false, 
        pauseOnHover : false,
        autoClose : 4000
    }

    async function handleFormLogin(data){
        if(!data?.oldPassword) return
        if(!data?.password || !data?.confirmPassword) return 
        if(data?.password !== data?.confirmPassword) {
            toast.warn("Les nouveaux mots de passe sont differents !!!", defaultToast)
            return
        }

        const canGo = await window.api.login({passtype : 'login', password : data?.oldPassword})
        
        if(!canGo){
            toast.warn("Ancien mot de passe incorrect !!", defaultToast)
            return
        }

        // console.log(data)
        const SEND = [data?.password, 'login']
        
        mutate(SEND)

        if(isError){
            toast.error("Erreur !", defaultToast)
            console.error("Erreur MAJ mdp :::", error)
        }

        toast.success("Mot de passe de connexion modifié", defaultToast)
        resetLogin()

    }

    async function handleFormOther(data){
        if(!data?.oldPassword) return
        if(!data?.password || !data?.confirmPassword) return 
        if(data?.password !== data?.confirmPassword) {
            toast.warn("Les nouveaux mots de passe sont differents !!!", defaultToast)
            return
        }

        const canGo = await window.api.login({passtype : 'alter', password : data?.oldPassword})
        
        if(!canGo){
            toast.warn("Ancien mot de passe incorrect !!", defaultToast)
            return
        }
        // console.log(data)
        const SEND = [data?.password, 'alter']
        
        mutate(SEND)

        if(isError){
            toast.error("Erreur !", defaultToast)
            console.error("Erreur MAJ mdp :::", error)
        }

        toast.success("Mot de passe de modifications modifié", defaultToast)
        resetOther()

    }

    async function handleFormSecondOther(data){
        if(!data?.oldPassword) return
        if(!data?.password || !data?.confirmPassword) return 
        if(data?.password !== data?.confirmPassword) {
            toast.warn("Les nouveaux mots de passe sont differents !!!", defaultToast)
            return
        }

        const canGo = await window.api.login({passtype : 'delete', password : data?.oldPassword})
        
        if(!canGo){
            toast.warn("Ancien mot de passe incorrect !!", defaultToast)
            return
        }
        // console.log(data)
        const SEND = [data?.password, 'delete']
        
        mutate(SEND)

        if(isError){
            toast.error("Erreur !", defaultToast)
            console.error("Erreur MAJ mdp :::", error)
        }

        toast.success("Mot de passe de suppression modifié", defaultToast)
        resetSecondOther()

    }

    return ReactDom.createPortal(
        <div className="popup settings">
            <div className="close-modal-contain">
                <div className="close-modal" onClick={() => {
                    navigate('home')
                    closeModal()
                }}>
                    {SVGS.close}
                </div>
            </div>


            <div className="modal-container">

                <div className="settings-nav">
                    <NavLink to='settings/connexion' className='link-ti'>Connexion</NavLink>
                    <NavLink to='settings/edit' className='link-ti'>Modifications</NavLink>
                    <NavLink to='settings/delete' className='link-ti'>Suppression</NavLink>
                </div>

                <Routes>
                    <Route path="settings/connexion" element={
                        <form className="modal-content insettings" onClick={handleSubmitLogin(handleFormLogin)}>
                        <h2 className="golden "> Connexion </h2>
                        <input type="password" className="form-field" {...registerLoginForm('oldPassword')} placeholder="Ancien mot de passe" />
                        <input type="password" className="form-field" {...registerLoginForm('password')} placeholder="Nouveau mot de passe" />
                        <input type="password" className="form-field" {...registerLoginForm('confirmPassword')} placeholder="Répéter mot de passe" />
                        <input type="submit" className="validate-form" defaultValue="Sauvegarder" />
                    </form>
                    } />


                    <Route path="settings/edit" element={
                        <form className="modal-content insettings" onClick={handleSubmitOther(handleFormOther)}>
                        <h2 className="golden "> Modifications </h2>
                        <input type="password" className="form-field" {...registerLoginOther('oldPassword')} placeholder="Ancien mot de passe" />
                        <input type="password" className="form-field" {...registerLoginOther('password')} placeholder="Nouveau mot de passe" />
                        <input type="password" className="form-field" {...registerLoginOther('confirmPassword')} placeholder="Répéter mot de passe" />
                        <input type="submit" className="validate-form" defaultValue="Sauvegarder" />
                    </form>
                    } />


                    <Route path="settings/delete" element={
                        <form className="modal-content insettings" onClick={handleSubmitSecondOther(handleFormSecondOther)}>
                        <h2 className="golden "> Suppressions </h2>
                        <input type="password" className="form-field" {...registerLoginSecondOther('oldPassword')} placeholder="Ancien mot de passe" />
                        <input type="password" className="form-field" {...registerLoginSecondOther('password')} placeholder="Nouveau mot de passe" />
                        <input type="password" className="form-field" {...registerLoginSecondOther('confirmPassword')} placeholder="Répéter mot de passe" />
                        <input type="submit" className="validate-form" defaultValue="Sauvegarder" />
                    </form>
                    } />
                </Routes>

                {/* <form className="modal-content insettings" onClick={handleSubmitLogin(handleFormLogin)}>
                    <h2 className="golden "> Connexion </h2>
                    <input type="password" className="form-field" {...registerLoginForm('oldPassword')} placeholder="Ancien mot de passe" />
                    <input type="password" className="form-field" {...registerLoginForm('password')} placeholder="Nouveau mot de passe" />
                    <input type="password" className="form-field" {...registerLoginForm('confirmPassword')} placeholder="Répéter mot de passe" />
                    <input type="submit" className="validate-form" defaultValue="Sauvegarder" />
                </form>

                <form className="modal-content insettings" onClick={handleSubmitOther(handleFormOther)}>
                    <h2 className="golden "> Modifications </h2>
                    <input type="password" className="form-field" {...registerLoginOther('oldPassword')} placeholder="Ancien mot de passe" />
                    <input type="password" className="form-field" {...registerLoginOther('password')} placeholder="Nouveau mot de passe" />
                    <input type="password" className="form-field" {...registerLoginOther('confirmPassword')} placeholder="Répéter mot de passe" />
                    <input type="submit" className="validate-form" defaultValue="Sauvegarder" />
                </form>

                <form className="modal-content insettings" onClick={handleSubmitSecondOther(handleFormSecondOther)}>
                    <h2 className="golden "> Suppressions </h2>
                    <input type="password" className="form-field" {...registerLoginSecondOther('oldPassword')} placeholder="Ancien mot de passe" />
                    <input type="password" className="form-field" {...registerLoginSecondOther('password')} placeholder="Nouveau mot de passe" />
                    <input type="password" className="form-field" {...registerLoginSecondOther('confirmPassword')} placeholder="Répéter mot de passe" />
                    <input type="submit" className="validate-form" defaultValue="Sauvegarder" />
                </form> */}
            </div>
        <ToastContainer />
        </div>


    , document.getElementById('modal-portal'))
}

export default Settings