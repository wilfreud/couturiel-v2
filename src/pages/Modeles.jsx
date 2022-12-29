import { useNavigate } from 'react-router-dom'
import '../style/Modeles.css'


function Modeles(){
    const navigate = useNavigate()

    const paths = {
        tenues : 'tenues',
        accessoires : 'accessoires',
        matieres_premieres : 'matieres_premieres'
    }

    return(
        <div className="App-main-container carousel">
            <div className="component-body cards-container">
                <div className="category-card" onClick={ () => navigate(paths.tenues)}>
                    <p className="category-card-title"> Tenues </p>
                </div>

                <div className="category-card" onClick={ () => navigate(paths.accessoires)}>
                    <p className="category-card-title"> Accessoires </p>
                </div>

                <div className="category-card" onClick={ () => navigate(paths.matieres_premieres)}>
                    <p className="category-card-title"> Matières Premières </p>
                </div>


            </div>
        </div>
    )
}

export default Modeles