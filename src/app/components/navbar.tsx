'use client'

import "./navbar.css";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
    const { data: session, status } = useSession();

    return (
        <nav className="navbar">
            <div className="navbar-title">CGT 390 Project 2</div>

            <div className="navbar-links">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/add-profile">Add Profile</Link>

                <div className="auth-section">
                    {status === "loading" ? (
                        <span>Loading...</span>
                    ) : session ? (
                        <>
                            <span className="user-email">{session?.user?.email}</span>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="sign-out-btn"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link href="/auth/signin" className="sign-in-link">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;