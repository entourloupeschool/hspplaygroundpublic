import styles from '../styles/Home.module.css';
import P5SmallWrapper from "./p5SmallCanvas";

const VignetteDrawing = ({f}: any) => {
    console.log('vignetteDrawing loads');
    return <>
        <div key={f.uid} className={styles.cardSmall}>
            <div>
                <strong>
                    <em>{f.name}</em>, {f.date}
                </strong>
                <p>
                    <em>{f.weather}, {Math.round(f.temp)}°C</em>
                </p>
            </div>
            
            <P5SmallWrapper drawing={f.drawing} />
        </div>                   
    </>
};

export default VignetteDrawing;
