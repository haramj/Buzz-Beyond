import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

// 인구수(population)를 가져오기 위해 쿼리 구조를 수정했습니다.
const GET_WEATHER_AND_FORECAST = gql`
  query GetWeatherAndForecast($city: String!) {
    getWeather(city: $city) {
      temp
      feels_like
      humidity
      wind_speed
      description
      icon
    }
    getForecast(city: $city) {
      population
      list {
        dt_txt
        temp
        description
        icon
      }
    }
  }
`;

export default function CityDetail() {
  const router = useRouter();
  const { city } = router.query;
  const [activeDate, setActiveDate] = useState(null);

  const { loading, error, data } = useQuery(GET_WEATHER_AND_FORECAST, {
    variables: { city },
    skip: !city,
  });

  if (loading) return <Layout><p className={styles.loading}>데이터를 불러오는 중입니다...</p></Layout>;
  if (error) return <Layout><p className={styles.error}>에러가 발생했습니다: {error.message}</p></Layout>;
  if (!data || !data.getWeather || !data.getForecast) return <Layout><p>날씨 정보를 찾을 수 없습니다.</p></Layout>;

  // 1. 데이터를 날짜별로 그룹화 (data.getForecast.list 참조)
  const allGroupedForecast = data.getForecast.list.reduce((acc, curr) => {
    const date = curr.dt_txt.split(' ')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(curr);
    return acc;
  }, {});

  // 2. 전체 날짜 중 상위 5개만 추출 (오늘 포함 5일)
  const forecastDates = allGroupedForecast 
    ? Object.keys(allGroupedForecast).slice(0, 5) 
    : [];

  return (
    <Layout>
      <section className={styles.detailSection}>
        {/* 1. 상단 지구본 + 타이틀 */}
        <div className={styles.headerWrapper}>
          <img src="/globe.png" alt="globe" className={styles.smallGlobe} />
          <h1>Weather Information for {city}</h1>
        </div>

        {/* 2. 메인 날씨 카드 */}
        <div className={styles.currentWeatherCard}>
          <div className={styles.weatherInfoLeft}>
            <div className={styles.weatherIconBox}>Weather<br/>Icon</div>
            <div className={styles.cityInfo}>
              <span className={styles.dateTimeText}>
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}. {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
              <h3>
                {city}, KR 
                <span className={styles.populationText}>
                  (인구수 : {data.getForecast.population.toLocaleString()})
                </span>
              </h3>
            </div>
          </div>

          <div className={styles.mainTemp}>
            <div className={styles.tempValue}>{data.getWeather?.temp.toFixed(2)}°C</div>
            <div className={styles.subWeatherInfo}>
              Feels like {data.getWeather?.feels_like.toFixed(1)}°C {data.getWeather?.description} 풍속 {data.getWeather?.wind_speed}m/s 습도 {data.getWeather?.humidity}%
            </div>
          </div>
        </div>

        {/* 3. 아코디언 */}
        <div className={styles.accordionContainer}>
          <div className={styles.accordionTitle}>5-day Forecast</div>
          {forecastDates.map((date) => (
            <div key={date} className={styles.accordionItem}>
              <div 
                className={styles.accordionHeader} 
                onClick={() => setActiveDate(activeDate === date ? null : date)}
              >
                {/* 날짜 포맷 (May 2 형식) */}
                <span>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className={styles.arrow} style={{ transform: activeDate === date ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ∨
                </span>
              </div>
                {activeDate === date && (
                    <div className={styles.accordionContent}>
                        {allGroupedForecast[date].map((item, idx) => (
                            <div key={idx} className={styles.forecastRow}>
                                {/* 왼쪽: 아이콘 + 시간 */}
                                <div className={styles.forecastLeft}>
                                <div className={styles.smallWeatherIcon}>Weather<br/>Icon</div>
                                <span className={styles.forecastTime}>
                                    {new Date(item.dt_txt).toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit', 
                                    hour12: true 
                                    }).replace(" ", "").toLowerCase()}
                                </span>
                            </div>

                            {/* 오른쪽: 상태 + 온도 */}
                            <div className={styles.forecastRight}>
                                <span className={styles.forecastStatus}>{item.description}</span>
                                <span className={styles.forecastTemp}>
                                    {item.temp.toFixed(2)}°C / {item.temp.toFixed(2)}°C
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                )}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}