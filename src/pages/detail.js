import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Detail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const usgs_id = searchParams.get('id');

  //pass id as prop to river component

  const River = (usgs_id) => {
    //get instantaneous values
    //get weather
    //get historical values
  }

  //D3 parse data and graph component with river parent component

  //favorite/unfav button component with river parent component

  return (
    <main>
      <h3>River Detail View</h3>
      <p> This is the river detail page</p>
    </main>
  );
};
