import React from "react";

const Weather = (props) => {

    const [riverProps, setRiverProps] = React.useState(props.river)
    const [weatherData, setWeatherData] = React.useState(null);
    const [weatherCondition, setWeatherCondition] = React.useState(null);

    //weather
    React.useEffect(() => {
        fetch(`/weather.json?lat=${riverProps.lat}&lon=${riverProps.lon}`)
        .then(response => response.json())
        .then(responseData => {
            setWeatherData(responseData);
        })
    }, [riverProps]);

    React.useEffect(() => {
        if(weatherData){
            const condId = weatherData.condition_id;

            if(condId >= 200 && condId < 300) {
                setWeatherCondition('storm');
            } else if (condId >= 300 && condId < 500) {
                setWeatherCondition('lightRain');
            } else if (condId >= 500 && condId < 600) {
                setWeatherCondition('rain');
            } else if (condId >= 600 && condId < 800) {
                setWeatherCondition('snow');
            } else if (condId === 800) {
                setWeatherCondition('clear');
            } else if (condId === 801 || condId === 802){
                setWeatherCondition('partCloud');
            } else if (condId === 803 || condId === 804){
                setWeatherCondition('clouds');
            } else {
                setWeatherCondition('none');
            }
        }
    }, [weatherData]);

    if(weatherData){
        return (
            <>
                <div className={"weather " + weatherCondition}> </div>
            </>
        )
    }

}

export default Weather;