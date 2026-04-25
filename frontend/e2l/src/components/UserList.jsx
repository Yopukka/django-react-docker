import { useState, useEffect } from "react"
import { getUser } from "../api/user"

export default function UserList(){

    const [users, setUsers] = useState([])

    const loadUser = async () =>{
        const response = await getUsers()
        setUsers(response.data)
    }
    
    useEffect(()=>{
        loadUser()
    },[])


    return(
        <div className="mt-8">
            <h1 className="text-3xl font-bold text-sky-900">Usuarios activos</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 mt-5 gap-5">
                {users.map(user =>(
                    <div key={user.id} className = "p-4 rounded-lg shadow">
                    <p><span className="font-bold">Nombre: </span>{user.first_name}</p>
                    <p>{user.last_name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}