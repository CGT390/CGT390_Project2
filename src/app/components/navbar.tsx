'use client'
import "./navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-title">CGT 390 Project 2</ul>
            <ul className="navbar-links">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;