import React from 'react';
import './profile-card.css';

type ProfileCardProps = {
  title: string;
  bio: string;
  email: string;
  phone: string;
  image_url: string;
  name: string;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ title, bio, email, phone, image_url, name }) => {
  return (
    <div className="profile-card">
      <img className="profile-image" src={image_url} alt={title} />
      <div className="profile-content">

        <h2 className="profile-title">{title}</h2>
        <h2 className="profile-name">{name}</h2>
        
        <p className="profile-bio">{bio}</p>
        <p className="profile-email">{email}</p>
        <p className="profile-phone">{phone}</p>
      </div>
    </div>
  );
};

export default ProfileCard;