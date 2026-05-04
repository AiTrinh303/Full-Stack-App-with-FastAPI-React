import React from 'react'
import {SignedIn, SignedOut, UserButton} from '@clerk/clerk-react'
import {Outlet, Link, Navigate} from 'react-router-dom'

export function Layout() {
    return (
        <div>
            <header className="flex justify-between items-center p-4">
                <div className="flex gap-4">
                    <Link to="/">Home</Link>
                    <Link to="/history">History</Link>
                </div>

                <div className="flex gap-4 items-center">
                    <SignedOut>
                        <Link to="/sign-in">Sign In</Link>
                        <Link to="/sign-up">Sign Up</Link>
                    </SignedOut>

                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}
