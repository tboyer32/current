import React, { useEffect } from 'react';
import AuthContext from '../components/AuthContext';

// import * as d3 from "d3";
import USGSDataProvider from '../components/USGSDataProvider';
import River from '../components/River';

export default function Favorites() {

  //TODO - get the favorite rivers for a user if there is a token
  //add a river component for each river faved by a user
  //deal with pagination (returned from API)

  const {token} = React.useContext(AuthContext);
  const [page, setPage] = React.useState(1);
  const [adjPages, setAdjPages] = React.useState(false);
  const [usgsIds, setUsgsIds] = React.useState(null);
  const [favsToRender, setFavsToRender] = React.useState(false);

  //change this to use effect
  React.useEffect(() => {
    setFavsToRender(false);

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
      setAdjPages({'nextPage' : resultData.nextPage, 'prevPage' : resultData.prevPage});
      setUsgsIds(resultData.usgsIds);

      let valList = []
      for(let i in resultData.usgsIds){
        const values = {
          'usgsId' : resultData.usgsIds[i],
          'pageType' : 'favorite'
        }
        valList.push(values);
      }
      
      setFavsToRender(valList.map((values) =>
        <River key={values['usgsId']} values={values} />
      ));

    });
  }, [page]);

  if(token && favsToRender) {
    return (
      <>
        <USGSDataProvider usgsIds={usgsIds}>
          {favsToRender}
        </USGSDataProvider>
        {adjPages.nextPage && <a href="#" onClick={() => setPage(page+1)}>nextPage</a>}
        {adjPages.prevPage && <a href="#" onClick={() => setPage(page-1)}>Previous Page</a>}
      </>
    );
  } else {
    return (
      <main>
        <p>Log in to see favorites</p>
      </main>
    )
  }
};