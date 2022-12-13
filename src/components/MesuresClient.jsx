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
                        <span className="boldit">Client: </span>
                        <span className="actual-info">{data?.prenom} {data?.nom} </span>
                    </div>

                    <div className="client-info">
                        <span className="boldit">Téléphone: </span>
                        <span className="actual-info">{data?.tel} </span>
                    </div>
                </div>


            <div className="mesures">
                
                <div className="mesure-cell"> TOUR DE CEINTURE : 
                    <span className="data"> { data?.tour_ceinture } </span> 
                </div>
                
                <div className="mesure-cell"> FESSE : 
                    <span className="data"> { data?.fesse } </span> 
                </div>
                
                <div className="mesure-cell"> CUISSE : 
                    <span className="data"> { data?.cuisse } </span> 
                </div>
                
                <div className="mesure-cell"> LONGUEUR PANTALON : 
                    <span className="data"> { data?.longueur_pantalon } </span> 
                </div>
                
                <div className="mesure-cell"> BAS PANTALON : 
                    <span className="data"> { data?.bas_pantalon } </span> 
                </div>
                
                <div className="mesure-cell"> TOUR DE COU : 
                    <span className="data"> { data?.tour_cou } </span> 
                </div>
                
                <div className="mesure-cell"> EPAULES : 
                    <span className="data"> { data?.epaules } </span> 
                </div>
                
                <div className="mesure-cell"> TOUR DE POITRINE : 
                    <span className="data"> { data?.tour_poitrine } </span> 
                </div>
                
                <div className="mesure-cell"> TOUR DE BRAS : 
                    <span className="data"> { data?.tour_bras } </span> 
                </div>
                
                <div className="mesure-cell"> MANCHE : 
                    <span className="data"> { data?.manche } </span> 
                </div>
                
                <div className="mesure-cell"> TOUR DE MANCHE : 
                    <span className="data"> { data?.tour_manche } </span> 
                </div>
                
                <div className="mesure-cell"> LONGUEUR HAUT : 
                    <span className="data"> { data?.longueur_haut } </span> 
                </div>
                
                <div className="mesure-cell"> BLOUSE : 
                    <span className="data"> { data?.blouse } </span> 
                </div>

                <div className="mesure-cell"> TAILLE : 
                    <span className="data"> { data?.taille } </span> 
                </div>

                <div className="mesure-cell"> MOLLET : 
                    <span className="data"> { data?.mollet } </span> 
                </div>
            </div>

                <div className="infos-facture facture-part">

                </div>
            </div>

        </div>
    , document.getElementById('modal-portal'))

}

export default MesuresClient