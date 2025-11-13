
import './App.css'
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'

function App() {
  
  return (
    <>
      <h1>Welcome to the App</h1>
      <SignedOut>
          <SignInButton mode="modal">
            <button className=''>
              Login
            </button>
          </SignInButton>
      </SignedOut>
      <SignedIn>
          <SignOutButton model="modal"/>
      </SignedIn>
      <UserButton/>
    </>
  )
};

export default App;
