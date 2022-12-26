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

            <h3 className="username"> {data?.prenom} {data?.nom} ({data?.tel}) </h3>
            <div className="meta-infos"> 
                 <span className="data"> { data?.email } </span> 
                 <br /> 
                 <span className="data notes"> { data?.notes } </span> 
            </div>
            <hr className='separate-client-data' />
            <div className="mesures">
                
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
        </div>

    , document.getElementById('modal-portal'))
}


export default ClientView