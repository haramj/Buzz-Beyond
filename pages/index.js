// pages/index.js
import Link from 'next/link';
import { useRouter } from 'next/router'; // 추가
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

const CITIES = ['Seoul', 'Tokyo', 'Paris', 'London'];

export default function Home() {
  const router = useRouter(); // 라우터 객체 사용

  return (
    <Layout>
      <section className={styles.mainSection}>
        <h1 className={styles.title}>
          Welcome to <br />
          <span>Weather App!</span>
        </h1>
        
        <p className={styles.description}>
          Choose a city from the list below to check the weather.
        </p>

        <div className={styles.buttonGrid}>
          {CITIES.map((city) => {
            // 현재 주소가 해당 도시인지 확인 (Select 상태 결정)
            const isSelected = router.asPath === `/${city}`;
            
            return (
              <Link key={city} href={`/${city}`} legacyBehavior>
                <a className={`${styles.cityButton} ${isSelected ? styles.selected : ''}`}>
                  {city}
                </a>
              </Link>
            );
          })}
        </div>

        <div className={styles.imageWrapper}>
          <img src="/globe.png" alt="3D Globe" className={styles.globeImage} />
        </div>
      </section>
    </Layout>
  );
}