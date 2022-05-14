import React from "react";
import RiverDataContext from './RiverDataContext';

const Weather = (props) => {
    const riverProps = React.useContext(RiverDataContext);

    const [weatherData, setWeatherData] = React.useState(null);

    //weather
    React.useEffect(() => {
        fetch(`/weather.json?lat=${riverProps.lat}&lon=${riverProps.lon}`)
        .then(response => response.json())
        .then(responseData => {
            setWeatherData(responseData);
        })
    }, []);

    if(weatherData){
        return (
            <>
                <p>{weatherData.weather_desc}</p>
            </>
        )
    }

    return

}

export default Weather;