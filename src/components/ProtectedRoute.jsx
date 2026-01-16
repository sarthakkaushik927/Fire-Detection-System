import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ session, children }) => {
  if (!session) {
    // If no user session, redirect to Login
    return <Navigate to="/auth" replace />
  }
  // If session exists, show the Dashboard
  return children
}

export default ProtectedRoute