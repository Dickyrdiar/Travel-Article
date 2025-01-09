import { Navigate, Outlet } from "react-router-dom"

export const PrivateRoute: React.FC = () => {
  const userJwt = localStorage.getItem("token") === null ? false : true
  console.log("user", userJwt)

  return (
    <>
      {userJwt ? <Outlet /> : <Navigate to="/"  />}
    </>
  )
}