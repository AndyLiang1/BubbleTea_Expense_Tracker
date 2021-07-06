import {createContext} from 'react'

export const AuthContext = createContext({logged_in: false, name : "", id: 0})