import React from "react";
import { useRef, useEffect, useState } from "react";
import {
  snakeContract,
  loadLatestPosition,
} from "./util/interact.js";

const OnchainSnake = props => {
    //state variables
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("No connection to the network."); //default message
    const [newMessage, setNewMessage] = useState("");

    const canvasRef = useRef(null)

    const draw = ctx => {
        ctx.fillStyle = '#000000'
        ctx.beginPath()
        ctx.arc(50, 100, 20, 0, 2*Math.PI)
        ctx.fill()
    }

    //called only once
    useEffect(async () => {
        const message = await loadLatestPosition();
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        draw(context);
    }, [draw]);

    return (
        <div id="container">
            <div id="score">Score : <div id="score-text">0</div></div>
            <canvas width="800" height="800" id="game" ref={canvasRef} {...props}></canvas>
        </div>
    );
};

export default OnchainSnake;