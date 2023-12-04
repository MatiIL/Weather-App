import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WeatherData from '../weatherTypes';
import { convertToCelsius } from '../../utils';
import { Card } from 'react-bootstrap';
import { weatherIconMapping } from '../weatherIconMapping';
import { useAppDispatch } from '../../state/hooks';
import { setCurrentWeather } from '../../features/currentWeather/currentSlice';
import { fetchDailyForecasts } from '../../features/dailyForecast/forecastSlice';

interface WeatherCardProps {
    data: WeatherData;
    name?: string;
    id?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, name, id }) => {
    const location = useLocation();
    const onFavoritesPage = location.pathname.includes('/favorites');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const getDayAbbreviation = (data: number): string => {
        const date = new Date(data);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const abbreviatedDay = dayOfWeek.slice(0, 3);
        return abbreviatedDay;
    };

    const handleClick = async (
        e: React.MouseEvent<HTMLAnchorElement>,
        id: string | undefined,
        name: string | undefined,
        temp: number,
        icon: number,
        weatherText: string
    ) => {

        if (id !== undefined && name !== undefined) {
            dispatch(
                setCurrentWeather({
                    id,
                    name,
                    weatherText,
                    weatherIcon: icon,
                    temparature: temp,
                }));
            await dispatch(fetchDailyForecasts(id));
            navigate('/');
        }
    }

    return (
        onFavoritesPage ? (
            <Card onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                handleClick(e, id, name, data.temparature, data.weatherIcon, data.weatherText)}
            >
                <Card.Body>
                    <Card.Text>
                        {name}
                    </Card.Text>
                    {convertToCelsius(data.temparature)}&deg;c
                </Card.Body>
                <Card.Img
                    variant="bottom"
                    src={weatherIconMapping[data.weatherIcon]}
                    alt={data.weatherText}
                />
            </Card>
        ) : (
            <Card>
                <Card.Body>
                    <Card.Text>
                        {data.timestamp && getDayAbbreviation(data.timestamp)}
                    </Card.Text>
                    {convertToCelsius(data.temparature)}&deg;c
                </Card.Body>
                <Card.Img
                    variant="bottom"
                    src={weatherIconMapping[data.weatherIcon]}
                    alt={data.weatherText}
                />
            </Card>
        )
    );

}

export default WeatherCard;