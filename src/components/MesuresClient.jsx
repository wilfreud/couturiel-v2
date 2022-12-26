import ReactDom from 'react-dom'
import { useReactToPrint } from 'react-to-print'
import  { useRef } from 'react'
import { useQuery } from 'react-query'
import logo from '../assets/logo-alt.png'
import '../style/MesuresFactures.css'


function MesuresClient({ closeModal, ID }){

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
      content : () => componentRef.current,
    //   onAfterPrint : closeModal
    })

    const SVGS = {
        close : <svg onClick={closeModal} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
      </svg>
      
    }

    const { data } = useQuery('fetch-facture-client-infos-', () => window.api.getClientAllInfos(ID), { refetchOnWindowFocus : false})

    return ReactDom.createPortal(
        <div className="facture-modal-container">
            <button onClick={handlePrint} className="export"> EXPORTER </button>
      
            <div className="close-modal-contain in-facture">
                <div className="close-modal">
                    {SVGS.close}
                </div>
            </div>


            <div className="facture-itself override" ref={componentRef} >

                <div className="header-facture facture-part override">
                    <img src={logo} alt="Logo de Tailor" id="logo" />
                </div>

                <div className="body-facture facture-part override">
                    <div className="client-info">
                        <span className="underline">Client</span>
                        <span className="actual-info"> : {data?.prenom} {data?.nom} </span>
                    </div>

                    <div className="client-info">
                        <span className="underline">Téléphone</span>
                        <span className="actual-info"> : {data?.tel} </span>
                    </div>
                </div>


            <div className="mesures override">
                
                <div className="mesure-cell"> Cou : 
                    <span className="data"> { data?.cou } </span> 
                </div>
                
                <div className="mesure-cell"> Epaule : 
                    <span className="data"> { data?.epaule } </span> 
                </div>
                
                <div className="mesure-cell"> Poitrine : 
                    <span className="data"> { data?.poitrine } </span> 
                </div>
                
                <div className="mesure-cell"> Taille : 
                    <span className="data"> { data?.taille } </span> 
                </div>
                
                <div className="mesure-cell"> Ceinture : 
                    <span className="data"> { data?.ceinture } </span> 
                </div>
                
                <div className="mesure-cell"> Petite hanche : 
                    <span className="data"> { data?.petite_hanche } </span> 
                </div>
                
                <div className="mesure-cell"> Hanche : 
                    <span className="data"> { data?.hanche } </span> 
                </div>
                
                <div className="mesure-cell"> Hauteur Taille : 
                    <span className="data"> { data?.hauteur_taille } </span> 
                </div>
                
                <div className="mesure-cell"> L manche 1 : 
                    <span className="data"> { data?.l_manche_1 } </span> 
                </div>
                
                <div className="mesure-cell"> L manche 2 : 
                    <span className="data"> { data?.l_manche_2 } </span> 
                </div>
                
                <div className="mesure-cell"> L haut 1 : 
                    <span className="data"> { data?.l_haut_1 } </span> 
                </div>
                
                <div className="mesure-cell"> L haut 2 : 
                    <span className="data"> { data?.l_haut_2 } </span> 
                </div>
                
                <div className="mesure-cell"> L veste/manteau : 
                    <span className="data"> { data?.l_veste_ou_manteau } </span> 
                </div>
                
                <div className="mesure-cell"> L jupe T H : 
                    <span className="data"> { data?.l_jupe_t_h } </span> 
                </div>
                
                <div className="mesure-cell"> Long jupe 1 : 
                    <span className="data"> { data?.long_jupe_2 } </span> 
                </div>
                
                <div className="mesure-cell"> Long jupe 2 : 
                    <span className="data"> { data?.long_jupe_1 } </span> 
                </div>
                
                <div className="mesure-cell"> L robe 1 : 
                    <span className="data"> { data?.l_robe_1 } </span> 
                </div>
                
                <div className="mesure-cell"> L robe 2 : 
                    <span className="data"> { data?.l_robe_2 } </span> 
                </div>
                
                <div className="mesure-cell"> L pant : 
                    <span className="data"> { data?.l_pant } </span> 
                </div>
                
                <div className="mesure-cell"> Tour de bras : 
                    <span className="data"> { data?.tour_de_bras } </span> 
                </div>
                
                <div className="mesure-cell"> Dessus poitrine : 
                    <span className="data"> { data?.dessus_poitrine } </span> 
                </div>
                
            </div>

                <div className="infos-facture facture-part">

                </div>
            </div>

        </div>
    , document.getElementById('modal-portal'))

}

export default MesuresClient