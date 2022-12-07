import { useState } from 'react'
import  { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import logo from '../assets/logo.png'
import logotext from '../assets/text-cut.png'
import eye from '../assets/svg/eye.svg'
import '../style/Login.css'


function Login(){

    // Auth context n stuff
    const auth = useAuth()

    // States
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [showError, setShowError] = useState(false)

    // Routing n stuff
    const navigate = useNavigate()

    async function handleSubmit(e){

        e.preventDefault()
        setShowError(false)

        const canGO = await window.api.login({ passtype : 'login', password : password})
        
        if(canGO === false) {
            setShowError(true)
            return
        }

        auth.login()
        navigate("/app/home")        
    }

    return(
        <div id="login-page">
            <div id="header-images">
                <img src={logo} draggable={false} id="logo-png"alt="Tailor-brand" />
                <img src={logotext} draggable={false} id="logo-text" alt="Tailor-brand-text" />
            </div>

            <form id="form-field" onSubmit={handleSubmit}>
                <div 
                    id="type-password"  
                    onAnimationEnd={() => setShowError(false)} 
                    className={showError ? "error loginpass" : "loginpass"}
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
                    
                    Connexion
                </button>
            </form>


        </div>
    )
}

export default Login