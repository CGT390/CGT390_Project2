"use client"
import { userData } from '../data';
import './add-profile.css';

const AddProfile = () => {

    return (
        <>
            <h1 className="main-title">About Me</h1>
            <h2 className="main-name">{userData.name}</h2>
            <div className="main-email">{userData.email}</div>
            <div className="main-bio">
                {userData.bio}
            </div>
        </>
    );
};

export default AddProfile; 
