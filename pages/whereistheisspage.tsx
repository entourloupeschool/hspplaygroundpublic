import Head from "next/head";
import styles from "../styles/Home.module.css";
import wiki from 'wikijs';
import useInterval from "../hooks/useIntervalts";
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import dynamic from "next/dynamic";

let unique_id = 0;

const toastTimer = 3000;
const toastPosition = 'bottom-center';

const ISS_POSITION_URL = 'https://api.wheretheiss.at/v1/satellites/25544';

const DynamicLeafletMapWrapper = dynamic(() => import('../components/leafletMapWrapper'), { ssr: false, loading: () => <div>Loading...</div> });

export async function getStaticProps() {
    console.log('getStaticProps of isspage loads');
    const iss__science_description: Promise<string | void>= wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php' })
	.page('Scientific_research_on_the_International_Space_Station')
	.then(page => page.summary());
    
    
  
    return {
      props: {
        iss__science_description: await iss__science_description,
        
      }, // will be passed to the page component as props
    }
};

type issDataType = {
    lat: number;
    lon: number;
    uid: number;
}

export default function WhereIsTheISSPage({iss__science_description}: any) {
    console.log('isspage loads');

    const [ ISSSpeed, setISSSpeed ] = useState<number>(0);
    const [ ISSAltitude, setISSAltitude ] = useState<number>(0);

    const [ ISS_POSITION_REFRESH_RATE, setISS_POSITION_REFRESH_RATE ] = useState<number>(2500);

    const [ featureISS, setFeatureISS ] = useState<issDataType[]>( [] );

    useInterval(async () => {
        const featureISS = await fetch(ISS_POSITION_URL)
        .then(response => response.json())
        .then(data => {
            console.log('data received');
            if (Math.round(ISSSpeed) !== Math.round(data.velocity)) {
                setISSSpeed(data.velocity);
            }
            if (Math.round(ISSAltitude) !== Math.round(data.altitude)) {
                setISSAltitude(data.altitude);
            };
    
            const ISS_POSITION_FEATURE = {
                lat: data.latitude,
                lon: data.longitude,
                uid: unique_id++
            };
    
            return ISS_POSITION_FEATURE;
        })
        .catch(error => {
            console.log(error);
            toast.warn('ISS\'s position could not be retrived', {
                position: toastPosition,
                autoClose: toastTimer,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return undefined;
        });

        if (featureISS){
            console.log('featureISS: ', featureISS);
            setFeatureISS([featureISS]);
        };

    }, ISS_POSITION_REFRESH_RATE);

    const handleChangeRate = () => {
        const value = (document.getElementById('rate') as HTMLInputElement).value;
        const valueToSet = parseFloat(value);

        if (valueToSet < 1.1) {
            toast.warn(`due to api call rules, the refresh rate must be higher than 1.1s`, {
                position: toastPosition,
                autoClose: toastTimer,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }else{
            setISS_POSITION_REFRESH_RATE(valueToSet*1000);
            toast.info(`refresh rate set to ${value}s`, {
                position: toastPosition,
                autoClose: toastTimer,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <div>
            <Head>
                <title>Where is the ISS</title>
                <meta name="description" content="Where is the ISS" />
            </Head>

                <div className={styles.setInfoContainer}>
                    <h1 className={styles.HSPtextDeco}>Where is the ISS ?</h1>

                    <DynamicLeafletMapWrapper arrayFeatures={featureISS}/>
                    
                    <div style={{display: 'flex', marginTop: '1rem', justifyContent: 'space-around'}}>
                        <div className={styles.card} >
                            <label htmlFor="rate">Refresh rate (in seconds) (&gt;1.1s!):</label>
                            <div className={styles.inputBtnGroup}>
                                <input type='number' className={styles.input} id="rate" placeholder={(ISS_POSITION_REFRESH_RATE/1000).toLocaleString()} style={{width: '100%'}}/>
                                <button className={styles.btnpositivesimple} style={{width: '3rem'}} onClick={() => handleChangeRate()}>set</button>
                            </div>
                        </div>
                        <div className={styles.card}>
                            <span>
                                <p>ISS speed: {Math.round(ISSSpeed)} km/h</p>
                            </span>
                            <span>
                                <p>ISS altitude: {Math.round(ISSAltitude)} km</p>
                            </span>
                        </div>
                    </div>
                    <ToastContainer/>
                </div>
                <div className={styles.setInfoContainer}>
                    <h1 className={styles.HSPtextDeco}>Science aboard the ISS ?</h1>
                    <p className={styles.description} style={{margin: '1rem'}}>
                        {iss__science_description}
                    </p>
                    <span key="wkjs">
                        Powered by <a className={styles.externalLink} href='https://www.npmjs.com/package/wikijs'>Wikijs</a>
                    </span>
                </div>
        </div>
    );
}