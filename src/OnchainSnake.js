import React from "react";
import { useRef, useEffect, useState } from "react";
import { Component } from "react";
import {
  snakeContract,
  loadLatestPosition,
} from "./util/interact.js";

class OnchainSnake extends Component {
    grid = 8;
    count = 0;

    snake = {
        // snake position in the screen
        x: 160,
        y: 160,
      
        // snake velocity. moves one grid length every frame in either the x or y direction
        dx: this.grid,
        dy: 0,
      
        // keep track of all grids the snake body occupies
        cells: [],
      
        // length of the snake. grows when eating an apple
        maxCells: 4
    }

    apple = {
        // apple position in the screen
        x: 320,
        y: 320
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    draw = () => {
        const ctx = this.refs.canvas.getContext("2d");
        ctx.fillStyle = "green";
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, this.refs.canvas.width,   
                     this.refs.canvas.height);           
        ctx.beginPath();
        ctx.arc(this.state.bird.x, this.state.bird.y, 
               this.state.bird.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    onKeyDown = (e) => {
        // prevent snake from backtracking on itself by checking that it's
        // not already moving on the same axis (pressing left while moving
        // left won't do anything, and pressing right while moving left
        // shouldn't let you collide with your own body)

        var snake = this.snake;
        var grid = this.grid;

        // left arrow key
        if (e.which === 37 && snake.dx === 0) {
            snake.dx = -grid;
            snake.dy = 0;
        }
        // up arrow key
        else if (e.which === 38 && snake.dy === 0) {
            snake.dy = -grid;
            snake.dx = 0;
        }
        // right arrow key
        else if (e.which === 39 && snake.dx === 0) {
            snake.dx = grid;
            snake.dy = 0;
        }
        // down arrow key
        else if (e.which === 40 && snake.dy === 0) {
            snake.dy = grid;
            snake.dx = 0;
        }
    }

    update = () => {
        const canvas = this.refs.canvas;
        const context = canvas.getContext("2d");
        
        var grid = this.grid;
        var apple = this.apple;
        var snake = this.snake;
        var score = this.refs.score;
        var getRandomInt = this.getRandomInt;

        requestAnimationFrame(this.update);

        // slow game loop to 15 fps instead of 60 (60/15 = 4)
        if (++this.count < 4) {
          return;
        }
      
        this.count = 0;
        context.clearRect(0,0,canvas.width,canvas.height);
      
        // move snake by it's velocity
        snake.x += snake.dx;
        snake.y += snake.dy;
      
        // wrap snake position horizontally on edge of screen
        if (snake.x < 0) { 
            snake.x = canvas.width - grid;
        }
        else if (snake.x >= canvas.width) {
            snake.x = 0;
        }
      
        // wrap snake position vertically on edge of screen
        if (snake.y < 0) {
            snake.y = canvas.height - grid;
        }
        else if (snake.y >= canvas.height) {
            snake.y = 0;
        }
      
        // keep track of where snake has been. front of the array is always the head
        snake.cells.unshift({x: snake.x, y: snake.y});
      
        // remove cells as we move away from them
        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }
      
        // draw apple
        context.fillStyle = 'red';
        context.fillRect(apple.x, apple.y, grid-1, grid-1);
      
        // draw snake one cell at a time
        context.fillStyle = 'green';
        snake.cells.forEach(function(cell, index) {
      
            // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
            context.fillRect(cell.x, cell.y, grid-1, grid-1);
      
            // snake ate apple
            if (cell.x === apple.x && cell.y === apple.y) {
                snake.maxCells++;
                score.innerText = snake.maxCells;
            
                // canvas is 800x800 which is 100x100 grids
                apple.x = getRandomInt(0, 50) * grid;
                apple.y = getRandomInt(0, 50) * grid;
            }
        
            // check collision with all cells after this one (modified bubble sort)
            for (var i = index + 1; i < snake.cells.length; i++) {

                // snake occupies same space as a body part. reset game
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                    snake.x = 160;
                    snake.y = 160;
                    snake.cells = [];
                    snake.maxCells = 4;
                    snake.dx = grid;
                    snake.dy = 0;
            
                    apple.x = getRandomInt(0, 25) * grid;
                    apple.y = getRandomInt(0, 25) * grid;
                }
            }
        });
    }

    componentDidMount() {
        requestAnimationFrame(this.update);

        // listen to keyboard events to move the snake
        document.addEventListener('keydown', this.onKeyDown);
    }

    render() {
        return (
            <div id="container">
                <div id="score-container">Score : <div id="score-text" ref="score">0</div></div>
                <canvas width="800" height="800" id="game" ref="canvas"></canvas>
            </div>
        );
    }
};

export default OnchainSnake;