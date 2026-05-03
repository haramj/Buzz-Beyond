// pages/index.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react'; 
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

const CITIES = ['Seoul', 'Tokyo', 'Paris', 'London'];

export default function Home() {
  const router = useRouter();
  const [clickedCity, setClickedCity] = useState(null);

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
            const isSelected = clickedCity === city || router.asPath === `/${city}`;
            
            return (
              <Link key={city} href={`/${city}`} legacyBehavior>
                <a 
                  className={`${styles.cityButton} ${isSelected ? styles.selected : ''}`}
                  onClick={() => setClickedCity(city)} 
                >
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