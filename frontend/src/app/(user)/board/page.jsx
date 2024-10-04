import React from 'react';
import styles from '@/styles/board.module.scss';

// Dummy data for tweets
const posts = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      handle: '@johndoe',
      avatar: 'https://via.placeholder.com/50',
    },
    content: 'This is a sample tweet!',
    timestamp: '2h',
  },
  {
    id: 2,
    user: {
      name: 'Jane Smith',
      handle: '@janesmith',
      avatar: 'https://via.placeholder.com/50',
    },
    content: 'Loving the React ecosystem!',
    timestamp: '4h',
  },
  {
    id: 3,
    user: {
      name: 'Alex Johnson',
      handle: '@alexj',
      avatar: 'https://via.placeholder.com/50',
    },
    content: 'Just attended a great React conference.',
    timestamp: '1d',
  },
  // Add more dummy tweets as needed
];


const ReplyIcon = () => <span className={styles.actionIcon}>💬</span>;
const RetweetIcon = () => <span className={styles.actionIcon}>🔁</span>;
const LikeIcon = () => <span className={styles.actionIcon}>❤️</span>;
const ShareIcon = () => <span className={styles.actionIcon}>➡️</span>;

const Board = () => {

  return (
    <div className={styles.board}>
      <header className={styles.boardHeader}>Board</header>
      <ul className={styles.boardList}>
        {posts.map((post) => (
          <li key={post.id} className={styles.boardItem}>
            <div className={styles.avatar}>
              <img
                src={post.user.avatar}
                alt={`${post.user.name} avatar`}
                className={styles.avatarImage}
              />
            </div>
            <div className={styles.boardContent}>
              <div className={styles.boardHeader}>
                <span className={styles.name}>{post.user.name}</span>
                <span className={styles.handle}>{post.user.handle}</span>
                <span className={styles.timestamp}>· {post.timestamp}</span>
              </div>
              <div className={styles.content}>{post.content}</div>
              <div className={styles.actions}>
                <button className={styles.actionButton}>
                  <ReplyIcon /> Reply
                </button>
                <button className={styles.actionButton}>
                  <RetweetIcon /> Retweet
                </button>
                <button className={styles.actionButton}>
                  <LikeIcon /> Like
                </button>
                <button className={styles.actionButton}>
                  <ShareIcon /> Share
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Board;