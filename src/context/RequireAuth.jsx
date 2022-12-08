import {Navigate} from 'react-router-dom'
import {useAuth} from './AuthProvider'

export const RequireAuth = ({ children }) => {
    const auth = useAuth()

    if(!auth.auth.logged){
        return <Navigate to='/' />
    }

    return children
}