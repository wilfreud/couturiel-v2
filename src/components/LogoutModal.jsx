import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import ReactDom from 'react-dom'
import logo from '../assets/logo.png'
import '../style/CloseModal.css'


function CloseModal({closeModal}){
// console.log(closeModal)

    const navigate = useNavigate()
    const auth = useAuth()

    function handleLogout(){
        auth.logout()

        navigate('/')
    }

    return ReactDom.createPortal(
        <div className="popup close-modal-popup">
            <img src={logo} alt="Tailor brand" className="logo"/>

            <h2 className="modal-question"> Confirmer la deconnexion ? </h2>

            <div className="popup-buttons">
                <button className="popup-button yes" onClick={handleLogout}> Oui </button>
                <button className="popup-button no" onClick={() => closeModal(false)}> Non </button>
            </div>
            
        </div>
    , document.getElementById('modal-portal'))
}

export default CloseModal