import { Routes, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import Sidebar from '../components/Sidebar'
import Home from './Home'
import Clients from './Clients'
import Commandes from './Commandes'
import Modeles from './Modeles'
import Comptabilite from './Comptabilite'
import Caisse from '../components/Caisse'
import ComptaGenerale from '../components/ComptaGenerale'
import Produits from '../components/Produits'
import Salaires from '../components/Salaires'
import AutreCommande from '../components/AutreCommande'
import Stats from '../components/Stats'
import '../style/AppWrapper.css'


function AppWrapper(){

    const queryClient = new QueryClient()

    return(
        <div className="App-protected">
            
            <QueryClientProvider client={queryClient}>
            <Sidebar />
                <Routes>
                    <Route path="home" element={<Home />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="modeles" element={<Modeles />} />
                    <Route path="modeles/:categorie" element={<Produits />} />
                    <Route path="commandes" element={<Commandes />} />
                    <Route path="comptabilite" element={<Comptabilite />} />
                    <Route path="comptabilite/caisse" element={<Caisse />} />
                    <Route path="comptabilite/comptagene" element={<ComptaGenerale />} />
                    <Route path="comptabilite/salaires" element={<Salaires />} />
                    <Route path="comptabilite/autreCommande" element={<AutreCommande />} />
                    <Route path="comptabilite/graphe" element={<Stats />} />
                </Routes>
                <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
            </QueryClientProvider>
        </div>
    )
}

export default AppWrapper