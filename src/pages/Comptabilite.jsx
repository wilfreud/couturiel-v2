import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../style/Comptabilite.css'

function Comptabilite(){
    const navigate = useNavigate()
    const NAV_OPTIONS = {
        caisse : "caisse",
        cg : 'comptagene',
        salaires : 'salaires',
        autre_commande : 'autreCommande'
    }


    return (
        <div className="App-main-container">
            
            <div className="compta-options">
                <div className="option-ocur" onClick={() =>{ navigate(NAV_OPTIONS.caisse)} }>
                    <p>Caisse</p>
                </div>

                <div className="option-ocur" onClick={() =>{ navigate(NAV_OPTIONS.cg)} }>
                    <p>Comptabilite <br /> Generale</p>
                </div>

                <div className="option-ocur" onClick={() =>{ navigate(NAV_OPTIONS.salaires)} }>
                    <p>Salaires</p>
                </div>

                <div className="option-ocur" onClick={() =>{ navigate(NAV_OPTIONS.autre_commande)} }>
                    <p>Autre Facture</p>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Comptabilite