import React from 'react';
import styles from '@/styles/leftSidebar.module.scss';
import Link from 'next/link';

const LeftSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/">동아리</Link></li>
          <li><Link href="/">내 동아리</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default LeftSidebar;