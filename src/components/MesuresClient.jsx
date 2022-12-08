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


            <div className="mesures">
                
                <div className="mesure-cell"> C : 
                    <span className="data"> { data?.c } </span> 
                </div>
                
                <div className="mesure-cell"> E : 
                    <span className="data"> { data?.e } </span> 
                </div>
                
                <div className="mesure-cell"> M : 
                    <span className="data"> { data?.m } </span> 
                </div>
                
                <div className="mesure-cell"> La : 
                    <span className="data"> { data?.la } </span> 
                </div>
                
                <div className="mesure-cell"> Lb : 
                    <span className="data"> { data?.lb } </span> 
                </div>
                
                <div className="mesure-cell"> S : 
                    <span className="data"> { data?.s } </span> 
                </div>
                
                <div className="mesure-cell"> K : 
                    <span className="data"> { data?.k } </span> 
                </div>
                
                <div className="mesure-cell"> F : 
                    <span className="data"> { data?.f } </span> 
                </div>
                
                <div className="mesure-cell"> Lp : 
                    <span className="data"> { data?.lp } </span> 
                </div>
                
                <div className="mesure-cell"> Br : 
                    <span className="data"> { data?.br } </span> 
                </div>
                
                <div className="mesure-cell"> Ba : 
                    <span className="data"> { data?.ba } </span> 
                </div>
                
                <div className="mesure-cell"> Poignée : 
                    <span className="data"> { data?.poignee } </span> 
                </div>
                
                <div className="mesure-cell"> Mollet : 
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