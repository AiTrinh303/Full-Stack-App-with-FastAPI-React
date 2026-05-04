import React from 'react'
import {SignIn, SignUp, SignedIn, SignedOut} from '@clerk/clerk-react'

export function AuthPage() {
    return (
        <div>
            <SignedOut>
                <SignIn routing="path" path="/sign-in" />
                <SignUp routing="path" path="/sign-up" />
            </SignedOut>
            <SignedIn>
                <div className="redirect-message">
                    <p>You are already signed in. Redirecting to the home page...</p>
                </div>
            </SignedIn>
        </div>
    )
}