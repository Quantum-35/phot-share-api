import React from 'react'
import Users from './Users';

interface iProps {
    res: any,
}

export  const UserList: React.SFC<iProps> = ({res}) =>{
    console.log(res)
    const { data:{allUsers, totalUsers}, refetch } = res
  return (
    <div style={{margin: "1rem 2rem", width: "40rem"}}>
        <h1>Total Users: {totalUsers}</h1>
        <p>
            <button onClick={() => refetch()}>Refetch</button>
        </p>
        <h1 style={{textDecoration: "underline"}}>List of Registered Users</h1>
        <ol>
            {
                allUsers.map((user: any, index: number) => (
                    <li key={index}>{user.name}</li>
                ))
            }
        </ol>
    </div>
  )
}

export default UserList;
