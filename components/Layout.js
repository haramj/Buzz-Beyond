// components/Layout.js
import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.wrapper}>
      <main className={styles.container}>
        {children}
      </main>
    </div>
  );
}