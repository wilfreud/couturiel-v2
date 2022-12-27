import ReactDom from 'react-dom'
import { useReactToPrint } from 'react-to-print'
import  { useRef } from 'react'
import { useQuery } from 'react-query'
import '../style/Facture.css'
import logo from '../assets/logo-alt.png'
import FB from '../assets/svg/facebook.svg'
import IG from '../assets/svg/insta.svg'
import WB from '../assets/svg/whatsapp.svg'

function FactureClient({ closeModal, data }) {
console.log(data)

  const { data : facturationInfos } = useQuery('get-facturation-infos', window.api.getFacturesCount, { refetchOnWindowFocus : false })

  const SVGS = {
    close : <svg onClick={closeModal} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
  
}

  function FACT_PREFIX(){
    // console.log(facturationInfos)
    const formatID = String(facturationInfos?.count).padStart(4, 0)
    // const month = new Date().getMonth() + 1
    // const formatedMonth = String(month).padStart(2, 0)
    
    return `M-${formatID}`
  }

// console.log((data?.modeles))

  const IDS = data?.modeles?.map(e => {
    const REFI = JSON.parse(e?.modele)
    // console.log(REFI)
    return { id : Number(REFI?.id), new_qtt : (Number(REFI.quantite) - Number(e?.quantite)) } 
  })

  async function decrementStock(){
    for(const dxd of IDS){
      await window.api.manualAutoDecrement([ dxd?.new_qtt, dxd?.id ])
      console.log("Decrementing...")
    }
    
  }

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content : () => componentRef.current,
    onAfterPrint : () => {
      decrementStock()
      window.api.addEntryToCaisse({entree : data?.total, libelle_entree : FACT_PREFIX(), sortie : null, libelle_sortie : null})
        .catch((err) => console.err("Error saving this in entries ::: ", err))
      window.api.setFacturesCount(facturationInfos?.count + 1)
        .catch((err) => console.error("Error updating facture count ! :::", err))
      closeModal()
    }
  })

  const INFOS = {
    adresse : 'Dieuppeul 4',
    telephone : '78 149 47 36 / 33 867 34 23'
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
            
            <div className='facture-header-section'>
              <h1 className='drop-h1-margin'>CLIENT</h1>

              <div className="client-infos">
                <div className="client-info-inline">
                  <span>Nom : </span>
                  <span className='dot-it'>{data?.proprietaire}</span>
                </div>  

                <div className="client-info-inline">
                  <span>Adresse : </span>
                  <span className='dot-it'>  </span>
                </div>

                <div className="client-info-inline">
                  <span>Telephone : </span>
                  <span className='dot-it'> {data?.telephone} </span>
                </div>

              </div>
            </div>

            <div className='facture-header-section'>
              <div className="facture-logo-container">
                <img src={logo} alt="Magci logo" id="logo" className='facture-override-logo'/>
              </div>
              

              <div className="client-infos">
              <h1 className='drop-h1-margin'>FACTURE</h1>

                <div className="client-info-inline">
                  <span>N° : </span>
                  <span> {FACT_PREFIX()} </span> 
                </div>

                <div className="client-info-inline">
                  <span>Date : </span>
                  <span className='dot-it'> {TODAY.getDate()}/{TODAY.getMonth() + 1}/{TODAY.getFullYear()} </span>
                </div>
              </div>
            </div>

          </div>

          <div className="content-facture facture-part">

            <div className="facture-table-header facture-table-row">
              <div className="table-cell">QTE</div>
              <div className="table-cell">DESCRIPTION</div>
              <div className="table-cell">PRIX</div>
              <div className="table-cell">TOTAL</div>
            </div>

            {
              data?.modeles?.map((element, index) => {
                const RESU = JSON.parse(element.modele)
                // console.log([RESU.prix, RESU.quantite])
                return (
                <div className="facture-table-row facture-table-body" key={index}>
                  <div className="table-cell"> {element?.quantite} </div>
                  <div className="table-cell"> {RESU?.nom_modele} </div>
                  <div className="table-cell"> {RESU?.prix} </div>
                  <div className="table-cell"> {element?.quantite * RESU?.prix} </div>
                </div>
                )
              })
            }

            <div className="facture-table-header facture-table-row ignore-style">
              <div className="table-cell"></div>
              <div className="table-cell"></div>
              <div className="table-cell">Remise</div>
              <div className="table-cell"> { data?.remise || 0 } FCFA </div>
            </div>

            <div className="facture-table-header facture-table-row ignore-style">
              <div className="table-cell"></div>
              <div className="table-cell"></div>
              <div className="table-cell">Sous Total</div>
              <div className="table-cell"> {(Number(data?.total) + Number(data?.avance)) || 0 } FCFA </div>
            </div>

            <div className="facture-table-header facture-table-row ignore-style">
              <div className="table-cell"></div>
              <div className="table-cell"></div>
              <div className="table-cell">Livraison</div>
              <div className="table-cell"> { data?.livraison || 0 } FCFA </div>
            </div>

            <div className="facture-table-header facture-table-row ignore-style">
              <div className="table-cell"></div>
              <div className="table-cell"></div>
              <div className="table-cell bold-cell">Accompte</div>
              <div className="table-cell bold-cell"> { data?.avance || 0 } FCFA </div>
            </div>

            <div className="facture-table-header facture-table-row ignore-style">
              <div className="table-cell"></div>
              <div className="table-cell"></div>
              <div className="table-cell bold-cell">A PAYER</div>
              <div className="table-cell bold-cell"> { data?.total || 0 } FCFA </div>
            </div>

          </div>

          <div className="facture-part pay-part">
            <h3 className="pay-part-title">MODES DE PAIEMENT</h3>
            <div className="pay-div">
              <span>Orange Money </span>
              <span>77 556 04 21</span>
            </div>

            <div className="pay-div">
              <span>Wave </span>
              <span>77 556 04 21</span>
            </div>

            <div className="pay-div">
              <span>Espèces</span>
              <span></span>
            </div>

            <div className="pay-div">
              <span>Chèque</span>
              <span></span>
            </div>
          </div>

          <div className="facture-part social-contact">
            <div className="social-item">
              <img src={WB} alt="whatsapp" />
              <p>+221 77 556 04 21</p>
            </div>

            <div className="social-item">
              <img src={IG} alt="instagram" />
              <p>@maxidkr</p>
            </div>

            <div className="social-item">
              <img src={FB} alt="facebook" />
              <p>@maaagci</p>
            </div>
          </div>

          {/* <div className="footer-facture facture-part">
            
            <div className="text-container toute-lettres">
              <p>La présente facture s'arrête à la somme de</p>
            </div>

            <div className="text-container director">
              <p className="underline"> Le Directeur </p>
            </div>

          </div> */}
        </div>
    </div>
  , document.getElementById('modal-portal'))
}

export default FactureClient