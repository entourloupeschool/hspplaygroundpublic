import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import type { ReactNode } from "react";
import p5 from "p5";
import styles from '../styles/Home.module.css';
import p5Types from 'p5';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

var drawing: any = [];
var currentPath: any = [];
var isDrawing: boolean = false;

const toastTimer = 3000;
const toastPosition = 'bottom-center';

function startPath() {
    isDrawing = true;
    currentPath = [];
    drawing.push(currentPath);
};

function endPath() {
    isDrawing = false;
};

type dataToSave = {
    weather: string
    temp: number
    mood: string
    drawing: string
    lat: number
    lon: number
}; 

async function fetchWeatherData(lat: number, lon: number) {
    const response = await fetch('/api/fetchWeather',{
        method: 'POST',
        body: JSON.stringify({'lat': lat, 'lon': lon})
    });
    
    if (response.ok) {
        // successful
        return await response.json();

    } else {
        console.error(response.statusText);
        toast.error('Something went wrong when we tried to fetch the local weather', {
            position: toastPosition,
            autoClose: toastTimer,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        // unknown error
        return false;
    }
}

async function saveData(data: dataToSave) {
    const response = await fetch('/api/saveMood', {
        body: JSON.stringify(data),
        method: "POST"
    });

    if (response.ok) {
        // successful
        toast.success('Your mood and drawing have been saved, reload the page and refresh the map to see your input', {
            position: toastPosition,
            autoClose: toastTimer+4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return await response.json();

    } else {
        console.error(response.statusText);
        toast.error('Something went wrong, try again later', {
            position: toastPosition,
            autoClose: toastTimer,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        // unknown error
        return false;
    }

};

type colorType = {
    value: string;
    label: string;
    rgb: string;
};

const colors: colorType[] = [
    {value: 'red', label: 'Red', rgb: 'rgb(255, 0, 0)'},
    {value: 'green', label: 'Green', rgb: 'rgb(0, 204, 0)'},
    {value: 'blue', label: 'Blue', rgb: 'rgb(0, 0, 255)'},
    {value: 'yellow', label: 'Yellow', rgb: 'rgb(255, 204, 0)'},
    {value: 'orange', label: 'Orange', rgb: 'rgb(255, 102, 0)'},
    {value: 'purple', label: 'Purple', rgb: 'rgb(153, 0, 204)'},
    {value: 'black', label: 'Black', rgb: 'rgb(0, 0, 0)'},
    {value: 'white', label: 'White', rgb: 'rgb(255, 255, 255)'},
    {value: 'brown', label: 'Brown', rgb: 'rgb(139,69,19)'},
    {value: 'grey', label: 'Grey', rgb: 'rgb(128, 128, 128)'},
    {value: 'pink', label: 'Pink', rgb: 'rgb(255, 153, 204)'}
];

const weightStroke: {value: number, label: number}[] = [];
for (let i = 1; i < 18; i++) {
    weightStroke.push({value: i, label: i});
};

interface P5WrapperProps {
    /** If true, the canvas will resize to window whenever the window is resized */
    autoResizeToWindow?: boolean;
    children?: ReactNode | HTMLElement;

};

/**
 * A wrapper component for running P5 sketches. Handles rendering and cleanup.
 */
const P5Wrapper = ({ autoResizeToWindow = true, children}: P5WrapperProps): JSX.Element => {
    const router = useRouter();
    const canvasRef = useRef<HTMLDivElement>(null);

    const [ bkgrdColor, setBkgrdColor ] = useState<string>(colors[6].rgb);
    const [ strokeColor, setStrokeColor ] = useState<string>(colors[7].rgb);
    const [ strokeWeight, setStrokeWeight ] = useState<number>(4);

    const handleChangePColor = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setStrokeColor(value);
    };

    const handleChangeBColor = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setBkgrdColor(value);
    };

    const handleChangePWeight = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setStrokeWeight(parseInt(value));
    };
    
    useEffect(() => {
        const sketch = (p: p5Types) => {
            //See annotations in JS for more information
            p.setup = (): void => {
                p.createCanvas(canvasRef.current!.clientWidth, canvasRef.current!.clientHeight);
    
                p.mousePressed = () => {
                    startPath();
                };
                p.mouseReleased = () => {
                    endPath()
                };
    
                p.select('#resetBtn')!.mousePressed(() => {
                    drawing = [];
                });
    
                p.select('#saveBtn')!.mousePressed(() => {
                    if (p.select('#moodinput')!.value()){
                        if ('geolocation' in navigator) {
                            /* geolocation is available */
                            console.log('geolocation is available');
                            navigator.geolocation.getCurrentPosition(async (position) => {
     
                                const currentLocalWeather = await fetchWeatherData(position.coords.latitude, position.coords.longitude);
                                console.log(currentLocalWeather);
                                if (currentLocalWeather?.weather !== undefined) {
                                    console.log('currentLocalWeather is available');
                                    const mood = p.select('#moodinput')!.value().toString();
    
                                    drawing.push({drawingWidth: canvasRef.current!.clientWidth, drawingHeight: canvasRef.current!.clientHeight, drawingBcolor: bkgrdColor, drawingScolor: strokeColor, drawingSweight: strokeWeight});
    
                                    const data: dataToSave = {
                                        lat: position.coords.latitude,
                                        lon: position.coords.longitude,
                                        drawing: JSON.stringify(drawing),
                                        weather: currentLocalWeather.weather[0].description,
                                        temp: currentLocalWeather.main.temp,
                                        mood: mood
                                    };
    
                                    await saveData(data);
    
                                };
                              });
                          } else {
                            /* geolocation IS NOT available */
                            console.log('geolocation IS NOT available');
                            toast.error('the mood map needs your position to work', {
                                position: toastPosition,
                                autoClose: toastTimer,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                          };
                    }else{
                        toast.info('Please state your mood', {
                            position: toastPosition,
                            autoClose: toastTimer,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    };
     
                });
            };
            
            p.draw = () => {
                p.background(bkgrdColor);
    
                if (isDrawing) {
                    var point = {
                        x: p.mouseX,
                        y: p.mouseY
                    };
                    currentPath.push(point);
                };
    
                p.stroke(strokeColor);
                p.strokeWeight(strokeWeight);
                p.noFill();
          
                for (var i = 0; i < drawing.length; i++){
                    var path = drawing[i];
                    p.beginShape();
                    for (var j = 0; j < path.length; j++){
                        p.vertex(path[j].x, path[j].y);
                    }
                    p.endShape();
                };
            };
          };
        const canvas = new p5(sketch, canvasRef.current!);

        if (autoResizeToWindow) {
            canvas.windowResized = () => {
                canvas.resizeCanvas(canvasRef.current!.clientWidth, canvasRef.current!.clientHeight);
            };
        }

        return () => canvas.remove();
    }, [ autoResizeToWindow, router.events, bkgrdColor, strokeColor, strokeWeight ]);

    return (
    <>
        <div>
            <p>Go on, draw your mood.</p>
            <div ref={canvasRef} className={styles.moduleContainer}>
            </div>
            <div className={styles.setInfoContainerSub} style={{display: 'flex', marginTop: '1rem', justifyContent: 'space-around'}}>
                <div className={styles.card}>
                    <div>
                        <label htmlFor='backgroundcolor'>
                            background color :
                        <select name='backgroundcolor' id='backgroundcolor' value={bkgrdColor} onChange={handleChangeBColor} style={{marginLeft: '0.5rem'}}>
                            {colors.map((color: colorType): JSX.Element => {
                                return (
                                    <option key={color.value} value={color.rgb}>{color.label}</option>
                                );
                            })}
                        </select>
                        </label>
                    </div>
                    <div>
                        <label htmlFor='pencolor'>
                            pen color :
                        <select name='pencolor' id='pencolor' value={strokeColor} onChange={handleChangePColor} style={{marginLeft: '0.5rem'}}>
                            {colors.map((color: colorType): JSX.Element => {
                                return (
                                    <option key={color.value} value={color.rgb}>{color.label}</option>
                                );
                            })}
                        </select>
                        </label>
                    </div>
                    <div>
                        <label htmlFor='weight'>
                            pen weight :
                        <select name='weight' id='weight' value={strokeWeight} onChange={handleChangePWeight} style={{marginLeft: '0.5rem'}}>
                            {weightStroke.map((weight: {value: number, label: number}): JSX.Element => {
                                return (
                                    <option key={weight.value} value={weight.value}>{weight.label}</option>
                                );
                            })}
                        </select>
                        </label>
                    </div>
                </div>

                <div className={styles.card} style={{alignItems: 'center'}}>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <label htmlFor='moodinput'>state your mood</label>
                        <input type='text' id='moodinput' style={{width: '10rem'}}className={styles.input}></input>
                    </div>
                    <button id='saveBtn' className={styles.btnpositivesimple} style={{marginTop:'0.5rem'}}>
                        send
                    </button>
                    <button className={styles.btnnegativesimple} style={{marginTop:'0.5rem'}} id='resetBtn'>clear canvas</button>

                </div>                
            </div>
            <ToastContainer/>
        </div>
    </>
    );
};

export default P5Wrapper;