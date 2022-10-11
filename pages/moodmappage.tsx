import Head from "next/head";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import { GetStaticProps } from 'next';
import prisma from '../lib/prisma';

let unique_id = 0;

type DataFromPrisma = {
  id: number;
  createdAt: Date;
  mood: string;
  weather: string;
  temp: number;
  lat: number;
  lon: number;
  drawing: string;
};

function fromDateToString(date:any): string {

  const currentdate = new Date( date ); 
  const datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
  
   return datetime;
}

const DynamicLeafletMapWrapper = dynamic(() => import('../components/leafletMapWrapper'), { ssr: false, loading: () => <div>Loading...</div> });

const DynamicVignetteDrawing = dynamic(() => import('../components/vignetteDrawing'), { ssr: false, loading: () => <div>Loading...</div> });
const DynamicP5Wrapper = dynamic(() => import('../components/p5Canvas'), { ssr: false, loading: () => <div>Loading...</div> });

export const getStaticProps: GetStaticProps = async () => {
  console.log('getStaticProps of moodmappage loads');

  const data = await prisma.mood.findMany();

  const allMoods = JSON.parse(JSON.stringify(data));

  return { 
    props: {
      allMoods: allMoods
    }
  };
};

const MoodMapPage = ({ allMoods }: any): JSX.Element => {
  console.log('moodmappage loads');

  const featureMood: [] = allMoods.map((mood: DataFromPrisma) => {
    const correctDate = fromDateToString(mood.createdAt);

    const moodFeature = {
      lat: mood.lat,
      lon: mood.lon,
      name: mood.mood,
      weather: mood.weather,
      temp: mood.temp,
      drawing: mood.drawing,
      uid: unique_id++,
      date: correctDate
    };

    return moodFeature;
  });

  return (
    <div>
      <Head>
        <title>Mood map</title>
        <meta name="description" content="Mood map" />
      </Head>
      <div className={styles.setInfoContainer}>
        <h1 className={styles.HSPtextDeco}>Send your mood</h1>

        <DynamicP5Wrapper />

      </div>
      <div className={styles.setInfoContainer}>
        <h1 className={styles.HSPtextDeco}>The Mood Map</h1>

        <DynamicLeafletMapWrapper arrayFeatures={featureMood}/>

        <div className={styles.setInfoContainerSub} style={{display: 'flex', marginTop: '1rem', justifyContent: 'space-around'}}>
          {featureMood.map((f: any) => (
            f.name
              ?
              <>
                <DynamicVignetteDrawing f={f} />
              </>
              :null                                    
                          
          ))}
        </div>
      </div>
    </div>
  );
}

export default MoodMapPage;