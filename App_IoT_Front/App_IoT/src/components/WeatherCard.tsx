import { FC } from "react";
import "../styles/WeatherCard.css";

interface WeatherCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

const WeatherCard: FC<WeatherCardProps> = ({ title, value, icon, loading }) => {
  return (
    <div className={`weather-card ${loading ? 'loading' : ''}`}>
      <div className="weather-content">
        {icon && <div className="weather-icon">{icon}</div>}
        <div className="weather-text">
          <h3 className="weather-title">{title}</h3>
          <div className="weather-value">
            {loading ? '...' : value}
          </div>
        </div>
      </div>
      {loading && <div className="card-loader"></div>}
    </div>
  );
};

export default WeatherCard;

