"use client";
import { useEffect, useRef, useState } from 'react';

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [speed] = useState(100);
  const [score, setScore] = useState(0);
  const gridSize = 20;
  const tileCount = 30;

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        setDirection({ x: 1, y: 0 });
        break;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

        // Check collision with walls
        // if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        //   alert(`Game Over! Your score: ${score}`);
        //   setSnake([{ x: 10, y: 10 }]);
        //   setDirection({ x: 0, y: 0 });
        //   setScore(0);
        //   return [{ x: 10, y: 10 }];
        // }

        // Check collision with self
        // if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        //   alert(`Game Over! Your score: ${score}`);
        //   setSnake([{ x: 10, y: 10 }]);
        //   setDirection({ x: 0, y: 0 });
        //   setScore(0);
        //   return [{ x: 10, y: 10 }];
        // }

        newSnake.unshift(head);

        // Check if food is eaten
        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
          });
          setScore((prevScore) => prevScore + 1);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [direction, speed, food, score]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach((segment) => {
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  }, [snake, food]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Snake Game</h1>
      <p>Score: {score}</p>
      <canvas
        ref={canvasRef}
        width={gridSize * tileCount}
        height={gridSize * tileCount}
        style={{ border: '1px solid black' }}
      ></canvas>
    </div>
  );
};

export default SnakeGame;
