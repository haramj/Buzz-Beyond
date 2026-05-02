import { ApolloServer, gql } from "apollo-server-micro";
import axios from "axios";

const API_KEY = "99ce98e85f10347f1b5389449e6af85b"; 
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const typeDefs = gql`
  type Weather {
    temp: Float
    feels_like: Float
    humidity: Int
    wind_speed: Float
    description: String
    icon: String
  }

  type Forecast {
    dt_txt: String
    temp: Float
    description: String
    icon: String
  }

  type ForecastData {
    list: [Forecast]
    population: Int  # 인구수 타입 추가
  }

  type Query {
    getWeather(city: String!): Weather
    # 반환 타입을 [Forecast]에서 ForecastData로 변경하여 인구수까지 포함
    getForecast(city: String!): ForecastData
  }
`;

const resolvers = {
  Query: {
    getWeather: async (_, { city }) => {
      const res = await axios.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
      const { main, weather, wind } = res.data;
      return {
        temp: main.temp,
        feels_like: main.feels_like,
        humidity: main.humidity,
        wind_speed: wind.speed,
        description: weather[0].description,
        icon: weather[0].icon,
      };
    },
    getForecast: async (_, { city }) => {
      const res = await axios.get(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
      return {
        population: res.data.city.population, // 인구수 추가
        list: res.data.list.map((item) => ({
          dt_txt: item.dt_txt,
          temp: item.main.temp,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        })),
      };
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

// ⭐ 수정된 핵심 부분: 서버 시작을 변수에 담습니다.
const startServer = apolloServer.start();

export const config = { 
  api: { 
    bodyParser: false 
  } 
};

// ⭐ 수정된 핵심 부분: 명확한 비동기 핸들러 함수를 export 합니다.
export default async function handler(req, res) {
  // CORS 설정 (필요한 경우)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer; // 서버가 시작될 때까지 기다립니다.
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res); // 핸들러를 실행합니다.
}