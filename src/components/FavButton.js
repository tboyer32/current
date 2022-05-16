import React from 'react';
import AuthContext from './AuthContext';

const FavButton = (props) => {
    const {token} = React.useContext(AuthContext);

    const [userFavorites, setUserFavorites] = React.useState(
        localStorage.getItem('userFavorites') || []
    );
    
    const usgsId = props.river.usgsId;
    let favArray = [];
    let riverIndex = null;

    if(userFavorites.length){
        favArray = userFavorites.split(',');
        riverIndex = favArray.indexOf(usgsId);   
    }

    const unFav = () => {

        favArray.splice(riverIndex, 1);
        setUserFavorites(favArray.toString());
        localStorage.setItem('userFavorites', favArray);
        
        fetch('/unfav-river', {
            method: 'POST',
            body: JSON.stringify({"usgsId" : usgsId}),
            headers: {
                'Authorization' : token,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(resultData => {
            console.log(resultData);
        });

        props.onRemove(usgsId)
    }

    const fav = () => {
    
        favArray.push(usgsId);
        setUserFavorites(favArray.toString());
        localStorage.setItem('userFavorites', favArray);

        fetch('/fav-river', {
            method: 'POST',
            body: JSON.stringify({"usgsId" : usgsId}),
            headers: {
                'Authorization' : token,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(resultData => {
            console.log(resultData);
        });
    }
    
    if(token){
        return (
            userFavorites.includes(props.river.usgsId) === true ? <button onClick={unFav}>unfav</button> : <button onClick={fav}>fav</button>
        )
    }else{
        return (
            <p>Log in to favorite this river</p>
        )
    }
}

export default FavButton;
