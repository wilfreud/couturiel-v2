import ReactDom from 'react-dom'
import { useQuery } from 'react-query'
import '../style/ClientView.css'

function ClientView( {closeModal, ID} ){
    
    const {isLoading, data, isError, error} = useQuery(['find-one-client', ID], () => {
        return window.api.getClientAllInfos(ID)
    }, {
        cacheTime : false
    })

    const closeBtnStyle = {
        width : '40px',
        cursor : 'pointer'
    }
    
    const SVGS = {
        close : <svg xmlns="http://www.w3.org/2000/svg" onClick={closeModal} style={closeBtnStyle} viewBox="0 0 24 24" fill="red" className="w-6 h-6">
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
      </svg>
      
    }
    
    if(isLoading) return ReactDom.createPortal( 
        <div>
            { SVGS?.close }
            <h2> Chargement des informations... </h2>
        </div>
        ,  document.getElementById('modal-portal'))

    if(isError) {
        console.error(error.message)
        return ReactDom.createPortal(
        <div>
            <div className="close-modal">
                    {SVGS.close}
                </div>
            <h2 style={{ color : "red"}}> Erreur lors du chargement des informations </h2>
        </div>
        , document.getElementById('modal-portal'))
    }
    
        return ReactDom.createPortal(
        <div className="popup">
            <div className="close-modal-contain">
                <div className="close-modal">
                    {SVGS.close}
                </div>
            </div>

            <h2 className="username"> {data?.prenom} {data?.nom} </h2>
            <div className="meta-infos"> 
                 <span className="data"> { data?.tel } </span> 
                 - 
                 <span className="data"> { data?.adresse } </span> 
            </div>
            <div className="mesures">
                
                <div className="mesure-cell"> TOUR DE CENTURE : 
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
        </div>

    , document.getElementById('modal-portal'))
}


export default ClientView