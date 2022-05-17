import React from "react";

const Weather = (props) => {

    const [riverProps, setRiverProps] = React.useState(props.river)

    const [weatherData, setWeatherData] = React.useState(null);

    //weather
    React.useEffect(() => {
        fetch(`/weather.json?lat=${riverProps.lat}&lon=${riverProps.lon}`)
        .then(response => response.json())
        .then(responseData => {
            setWeatherData(responseData);
        })
    }, [riverProps]);

    if(weatherData){
        return (
            <>
                <p>Weather: {weatherData.weather_desc}</p>
            </>
        )
    }

}

export default Weather;