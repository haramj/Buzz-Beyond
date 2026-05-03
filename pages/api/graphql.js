import { ApolloServer, gql } from "apollo-server-micro";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL;

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
    country: String
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
        population: res.data.city.population,
        country: res.data.city.country,
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

const startServer = apolloServer.start();

export const config = { 
  api: { 
    bodyParser: false 
  } 
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res); 
}