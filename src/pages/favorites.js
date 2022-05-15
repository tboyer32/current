import React from 'react';
import AuthContext from '../components/AuthContext';
import Weather from '../components/Weather';

// import * as d3 from "d3";
import USGSDataProvider from '../components/USGSDataProvider';
import River from '../components/River';

export default function Favorites() {

  //TODO - get the favorite rivers for a user if there is a token
  //add a river component for each river faved by a user
  //deal with pagination (returned from API)

  const {token} = React.useContext(AuthContext);
  const [page, setPage] = React.useState(1);
  const [favs, setFavs] = React.useState(null);
  const pageType = 'favorite';

  //change this to use effect
  React.useEffect(() => {
    fetch('/view-favs.json', {
      method: 'POST',
      body: JSON.stringify({"page" : page}),
      headers: {
        'Authorization' : token,
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(resultData => {
      setFavs(resultData.usgsIds)
    });
  }, []);

  let values = null;
  let favsToRender = null;
  let valList = [];

  if(favs){
    for(let i in favs){
      values = {
        'usgsId' : favs[i],
        'pageType' : 'favorite'
      }
      valList.push(values);
    }
    favsToRender = valList.map((valList) =>
      // Correct! Key should be specified inside the array.
      <River key={valList['usgsId']} values={valList} />
    );
    console.log(favsToRender)
  }

  if(token && favs) { 
    return (
      <USGSDataProvider usgsIds={favs}>
        {favsToRender}
      </USGSDataProvider>
    );
  } else {
    return (
      <main>
        <p>Log in to see favorites</p>
      </main>
    )
  }
};