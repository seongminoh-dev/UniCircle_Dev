'use client';

import React from 'react';
import styles from '@/styles/header.module.scss';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const Header = () => {
  const auth = useAuth();
  const router = useRouter();
  
  const handleLogout = () => {
    try{
      auth.signOut();
      router.push("/auth/login");
    }
    catch (e) {
      console.log(e);
      alert("Logout failed");
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.title}>uniCircle</div>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
};

export default Header;