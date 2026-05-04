import React from 'react'
import { SignedIn, SignedOut, UserButton, RedirectToSignIn } from '@clerk/clerk-react'
import {Outlet, Link} from 'react-router-dom'

export function Layout() {
    return (
        <>
            <header className="flex justify-between items-center p-4">
                <nav className="flex gap-4 items-center">
                    <SignedIn>
                        <Link to="/">Home</Link>
                        <Link to="/history">History</Link>
                    </SignedIn>

                    <SignedOut>
                        <Link to="/sign-in">Sign In</Link>
                        <Link to="/sign-up">Sign Up</Link>
                    </SignedOut>
                </nav>

                <SignedIn>
                    <UserButton />
                </SignedIn>
            </header>
            <main className="p-4">
                <SignedOut>
                    <RedirectToSignIn />
                </SignedOut>
                <SignedIn>
                    <Outlet />
                </SignedIn>
            </main>
        </>
    )
}
