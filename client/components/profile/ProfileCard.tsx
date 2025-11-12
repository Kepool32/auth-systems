import React from 'react';

interface ProfileCardProps {
  login: string;
  email: string;
  username: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ login, email, username }) => {
  return (
    <div className="bg-white p-6 rounded shadow-md mb-4">
      <p>
        <strong>Login:</strong> {login}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Username:</strong> {username}
      </p>
    </div>
  );
};

export default ProfileCard;
