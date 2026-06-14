"use client"

import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const userDataContext = createContext()

const UserContext = ({children}) => {
    const serverUrl = "http://localhost:8000"
    const [userData, setuserData] = useState(null)
    const [loding, setloding] = useState(true)

    const handleCurrentUser = async () => {
        setloding(true)
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`, {withCredentials: true})
            setuserData(result.data)
            return result.data
        } catch (error) {
            setuserData(null)
            console.log(error)
            return null
        }finally {
            setloding(false)
        }
      
    }

    const login = async (email, password) => {
        const result = await axios.post(
            `${serverUrl}/api/auth/signin`,
            { email, password },
            { withCredentials: true }
        )
        setuserData(result.data)
        return result.data
    }

    const logout = async () => {
        await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
        setuserData(null)
    }

    useEffect(() => {
        let isMounted = true

        axios.get(`${serverUrl}/api/user/current`, {withCredentials: true})
            .then((result) => {
                if (isMounted) setuserData(result.data)
            })
            .catch((error) => {
                if (isMounted) {
                    setuserData(null)
                    console.log(error)
                }
            })
            .finally(() => {
                if (isMounted) setloding(false)
            })

        return () => {
            isMounted = false
        }
    }, [])

    const value = {
    serverUrl,
    userData,
    setuserData,
    isLoggedIn: Boolean(userData),
    login,
    logout,
    refreshCurrentUser: handleCurrentUser,
    loding
      }
    
  return <userDataContext.Provider value={value}>
    {children}
  </userDataContext.Provider>
}

export default UserContext
