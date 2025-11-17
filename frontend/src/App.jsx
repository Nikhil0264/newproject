

import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import { Navigate, Route,Routes } from 'react-router';
import HomePage from './pages/HomePage';

import ProblemPage from './pages/ProblemPage';
import { Toaster } from 'react-hot-toast';
import DashboardPage from './pages/DashboardPage';

function App() {
   const {isSignedIn,isLoaded} = useUser();
   if(!isLoaded) return null;
  return (
    <>
      <Routes>
      <Route path="/" element={!isSignedIn ? <HomePage/> : <Navigate to = {"/dashboard"} />} />
      <Route path="/dashboard" element={isSignedIn ? <DashboardPage/> : <Navigate to = {"/"} />} />
      <Route path="/problem" element={isSignedIn ? <ProblemPage/> : <Navigate to = {"/"} />} />
      </Routes>
    <Toaster  toastOptions={{duration:2000}}/>
    </>
    
  );
};


export default App;
