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
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

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

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log('touchEnd', e);
    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // yatay kaydırma
      if (deltaX > 0) {
        setDirection({ x: 1, y: 0 }); // sağa
      } else {
        setDirection({ x: -1, y: 0 }); // sola
      }
    } else {
      // dikey kaydırma
      if (deltaY > 0) {
        setDirection({ x: 0, y: 1 }); // aşağı
      } else {
        setDirection({ x: 0, y: -1 }); // yukarı
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

        // Duvarlarla çarpışmayı kontrol et
        // if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        //   alert(`Oyun Bitti! Skorunuz: ${score}`);
        //   setSnake([{ x: 10, y: 10 }]);
        //   setDirection({ x: 0, y: 0 });
        //   setScore(0);
        //   return [{ x: 10, y: 10 }];
        // }

        // Kendine çarpışmayı kontrol et
        // if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        //   alert(`Oyun Bitti! Skorunuz: ${score}`);
        //   setSnake([{ x: 10, y: 10 }]);
        //   setDirection({ x: 0, y: 0 });
        //   setScore(0);
        //   return [{ x: 10, y: 10 }];
        // }

        newSnake.unshift(head);

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

    ctx.fillStyle = 'green';
    snake.forEach((segment) => {
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  }, [snake, food]);

  return (
    <div
      style={{ textAlign: 'center' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h1>Snake Game</h1>
      <p>Skor: {score}</p>
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
