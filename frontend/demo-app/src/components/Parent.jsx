import React, { useState } from 'react';
import Details from './user/Details';
import User from './user/User';

const Parent = () => {
  const [name, setName] = useState('');
  const [showUser, setShowUser] = useState(false);

  const handleDetailsSubmit = (enteredName) => {
    setName(enteredName);
    setShowUser(true);
  };

  return (
    <>
      {!showUser ? (
        <Details onSubmit={handleDetailsSubmit} />
      ) : (
        <User name={name} />
      )}
    </>
  );
};

export default Parent;