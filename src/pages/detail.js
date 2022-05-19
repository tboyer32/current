import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Weather from '../components/Weather';
import RiverChart from '../components/RiverChart';

// import * as d3 from "d3";
import USGSDataProvider from '../components/USGSDataProvider';
import River from '../components/River';


//TODO: Need db river_id to manage favorites
//TODO: Get all data (whether one or many rivers) in one big component. Then pass to children

export default function Detail(props) {  
  const [searchParams] = useSearchParams();
  
  //only doing this on the detail page
  const usgsId = searchParams.get('id');

  const values = {
    'usgsId' : usgsId,
    'pageType' : 'detail'
  }

  return (
    <>
      <main className="detail">
        <USGSDataProvider usgsIds={[usgsId]}>
          <River values={values} >
            <Weather />
            <RiverChart />
          </River>
        </USGSDataProvider>
      </main>
    </>
  );

};
