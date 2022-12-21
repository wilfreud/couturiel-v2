import {createContext, useState, useContext} from 'react'

const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({logged : false})


    function login(){
        setAuth({logged : true})
    }

    function logout(){
        setAuth({logged : false})
    }

    return(

        <AuthContext.Provider value={{auth, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}