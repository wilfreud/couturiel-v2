import { useNavigate } from 'react-router-dom'
import '../style/Modeles.css'


function Modeles(){
    const navigate = useNavigate()

    const paths = {
        getzner : 'getzner',
        supercent : 'supercent',
        accessoires : 'accessoires'
    }

    return(
        <div className="App-main-container">
            <div className="component-body cards-container">
                <div className="category-card" onClick={ () => navigate(paths.getzner)}>
                    <p className="category-card-title"> Getzner </p>
                </div>

                <div className="category-card" onClick={ () => navigate(paths.supercent)}>
                    <p className="category-card-title"> Supercent </p>
                </div>

                <div className="category-card" onClick={ () => navigate(paths.accessoires)}>
                    <p className="category-card-title"> Accessoires </p>
                </div>


            </div>
        </div>
    )
}

export default Modeles