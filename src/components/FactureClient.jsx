import ReactDom from 'react-dom'
import { useReactToPrint } from 'react-to-print'
import  { useRef } from 'react'
import { useQuery } from 'react-query'
import '../style/Facture.css'
import logo from '../assets/logo-alt.png'

function FactureClient({ closeModal, ID }) {

  const { data : factureData } = useQuery('get-facture-content', () => window.api.getFacturesInfos(ID.commande), { 
    refetchOnWindowFocus : false
  })

  const { data : clientData } = useQuery('get-facture-client-infos', () => window.api.getClientBasicInfos(ID.client), {
    refetchOnWindowFocus : false
  })

  const { data : facturationInfos } = useQuery('get-facturation-infos', window.api.getFacturesCount, { refetchOnWindowFocus : false })

  const SVGS = {
    close : <svg onClick={closeModal} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
  
}

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content : () => componentRef.current,
    onAfterPrint : () => {
      window.api.setFacturesCount(facturationInfos?.count + 1)
        .catch((err) => console.error("Error updating facture count ! :::", err))
      closeModal()
    }
  })

  const INFOS = {
    adresse : 'Dakar, Medina, Rue 17 x 6',
    telephone : '77 284 93 93 / 78 115 45 15'
  }

  function FACT_PREFIX(){
    // console.log(facturationInfos)
    const formatID = String(facturationInfos?.count).padStart(3, 0)
    const month = new Date().getMonth() + 1
    const formatedMonth = String(month).padStart(2, 0)
    
    return `BWC-${formatedMonth}-${formatID}`
  }

  const TODAY = new Date()

  return ReactDom.createPortal(
    <div className="facture-modal-container">
      <button onClick={handlePrint} className="export"> EXPORTER </button>
      
      <div className="close-modal-contain in-facture">
          <div className="close-modal">
              {SVGS.close}
          </div>
      </div>
    
        <div className="facture-itself" ref={componentRef} >

          <div className="header-facture facture-part">
            <img src={logo} alt="Tailor logo" id="logo" />

            <div className="header-desc">
              <h3> {INFOS.adresse} </h3>
              <p> {INFOS.telephone} </p>
            </div>
          </div>

          <div className="client-facture facture-part">

            <div className="client-info">
              <span className="boldit">Facture N° {FACT_PREFIX()}</span>
              <span className="actual-info">  </span>
            </div>

            <div className="client-info">
              <span className="underline">Date</span>
              <span className="actual-info"> : {TODAY.getDate()} / {TODAY.getMonth()+1} / {TODAY.getFullYear()} </span>
            </div>

            <div className="client-info">
              <span className="underline">Client</span>
              <span className="actual-info"> : {clientData?.prenom} {clientData?.nom} </span>
            </div>

            <div className="client-info">
              <span className="underline">Téléphone</span>
              <span className="actual-info"> : {clientData?.tel} </span>
            </div>

            <div className="client-info">
              <span className="underline">Adresse</span>
              <span className="actual-info"> : {clientData?.adresse} </span>
            </div>


          </div>

          <div className="content-facture facture-part">

            <div className="facture-table-header facture-table-row">
              <div className="table-cell">DESIGNATION</div>
              <div className="table-cell">QUANTITE</div>
              <div className="table-cell">PRIX UNITAIRE</div>
              <div className="table-cell">PRIX TOTAL</div>
            </div>

            {
              factureData?.map((element, index) => (
                <div className="facture-table-row facture-table-body" key={index}>
                  <div className="table-cell"> {element?.nom_modele} </div>
                  <div className="table-cell"> {element?.quantite} </div>
                  <div className="table-cell"> {element?.prix} </div>
                  <div className="table-cell"> {element?.quantite * element?.prix} </div>
                </div>
              ))
            }

            <div className="facture-table-header facture-table-row ignore-style">
              <div className="table-cell">Remise</div>
              <div className="table-cell"></div>
              <div className="table-cell"></div>
              <div className="table-cell"> { factureData ? factureData[0]?.remise : 0 } FCFA </div>
            </div>

            <div className="facture-table-header facture-table-row ignore-style">
              <div className="table-cell">Avance</div>
              <div className="table-cell"></div>
              <div className="table-cell"></div>
              <div className="table-cell"> { factureData ? factureData[0]?.avance : 0 } FCFA </div>
            </div>

            <div className="facture-table-header facture-table-row ignore-style">
              <div className="table-cell">TOTAL</div>
              <div className="table-cell"></div>
              <div className="table-cell"></div>
              <div className="table-cell"> { factureData ? factureData[0]?.total : 0 } FCFA </div>
            </div>

          </div>

          <div className="footer-facture facture-part">
            
            <div className="text-container toute-lettres">
              <p>La présente facture s'arrête à la somme de</p>
            </div>

            <div className="text-container director">
              <p className="underline"> Le Directeur </p>
            </div>

          </div>
        </div>
    </div>
  , document.getElementById('modal-portal'))
}

export default FactureClient