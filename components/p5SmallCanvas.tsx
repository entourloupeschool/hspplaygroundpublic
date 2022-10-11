import React, { useRef, useEffect } from 'react';
import type { ReactNode } from "react";
import p5 from "p5";
import p5Types from 'p5';
import { useRouter } from 'next/router';
import style from '../styles/Home.module.css';

const dimensioned = 1/4;
const imageDim = 1/2;

interface P5SmallWrapperProps {
    /** If true, the canvas will resize to window whenever the window is resized */
    autoResizeToWindow?: boolean;
    children?: ReactNode | HTMLElement;
    drawing?: any;
};

/**
 * A wrapper component for running P5 sketches. Handles rendering and cleanup.
 */
const P5SmallWrapper = ({ autoResizeToWindow = true, children, drawing}: P5SmallWrapperProps): JSX.Element => {
    const router = useRouter();
    const canvasRef = useRef<HTMLDivElement>(null);
    const parsedDrawing = JSON.parse(drawing);
    const popedDrawing = parsedDrawing.pop();

    const redimDrawingHeight = popedDrawing.drawingHeight * dimensioned;
    const redimDrawingWidth = popedDrawing.drawingWidth * dimensioned;


    useEffect(() => {
        console.log('useEffect smallp5wrapper');
        const sketch = (p: p5Types) => {
            //See annotations in JS for more information
            p.setup = (): void => {
                // Canvas version
                p.createCanvas(redimDrawingWidth, redimDrawingHeight);
                p.background(popedDrawing.drawingBcolor);
                p.stroke(popedDrawing.drawingScolor);
                p.strokeWeight(popedDrawing.drawingSweight);
                p.noFill();
    
                for (var i = 0; i < parsedDrawing.length; i++){
                    var path = parsedDrawing[i];
                    p.beginShape();
                    for (var j = 0; j < path.length; j++){
                        path[j].x *= imageDim;
                        path[j].y *= imageDim;
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
    }, [ autoResizeToWindow, router.events, parsedDrawing, popedDrawing.drawingBcolor, popedDrawing.drawingScolor, popedDrawing.drawingSweight, redimDrawingHeight, redimDrawingWidth ]);

    return (
    <>
        <div id='canvasDiv' ref={canvasRef} className={style.sketchPopup} style={{width: redimDrawingWidth, height: redimDrawingHeight}}>
        </div>
    </>
    );
};

export default P5SmallWrapper;