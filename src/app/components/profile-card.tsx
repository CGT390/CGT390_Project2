'use client';
import React from 'react';
import Link from 'next/link';
import './profile-card.css';

type ProfileCardProps = {
  id: number | string;   // ✅ add id
  title: string;
  bio: string;
  email: string;
  phone: string;
  image_url: string;
  name: string;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ id, title, bio, email, phone, image_url, name }) => {
  return (
    <Link href={`/profiles/${id}`} className="profile-card-link">  {/* ✅ wrap in Link */}
        <div className="profile-card">
          <img className="profile-image" src={image_url} alt={name} />
          <div className="profile-content">
            <h2 className="profile-title">{title}</h2>
            <h2 className="profile-name">{name}</h2>
            <p className="profile-bio">{bio}</p>
            <p className="profile-email">{email}</p>
            <p className="profile-phone">{phone}</p>
          </div>
        </div>
    </Link>
  );
};

export default ProfileCard;