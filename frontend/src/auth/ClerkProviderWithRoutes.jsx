import {ClerkProvider} from '@clerk/clerk-react'  
import { BrowserRouter } from 'react-router-dom'

const PUBLICSHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLICSHABLE_KEY) {
  throw new Error('Missing Clerk publishable key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file.')
}

export default function ClerkProviderWithRoutes ({ children }) {
  return (
    <ClerkProvider publishableKey={PUBLICSHABLE_KEY}>
      <BrowserRouter>
       {children}
      </BrowserRouter>
    </ClerkProvider>
  )
}
