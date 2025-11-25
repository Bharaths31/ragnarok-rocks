import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import { motion } from 'framer-motion';

const Games: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'menu' | 'snake' | 'tictactoe'>('menu');

  // Snake State
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([15, 15]);
  const [direction, setDirection] = useState([0, 1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Tic-Tac-Toe State
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  // Snake Logic
  useEffect(() => {
    if (activeGame === 'snake' && !gameOver) {
      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowUp': if (direction[1] !== 1) setDirection([0, -1]); break;
          case 'ArrowDown': if (direction[1] !== -1) setDirection([0, 1]); break;
          case 'ArrowLeft': if (direction[0] !== 1) setDirection([-1, 0]); break;
          case 'ArrowRight': if (direction[0] !== -1) setDirection([1, 0]); break;
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      gameLoopRef.current = setInterval(() => {
        setSnake((prev) => {
          const head = [prev[0][0] + direction[0], prev[0][1] + direction[1]];
          // Collision with walls
          if (head[0] < 0 || head[0] >= 20 || head[1] < 0 || head[1] >= 20) {
            setGameOver(true);
            return prev;
          }
          // Collision with self
          if (prev.some(s => s[0] === head[0] && s[1] === head[1])) {
            setGameOver(true);
            return prev;
          }

          const newSnake = [head, ...prev];
          if (head[0] === food[0] && head[1] === food[1]) {
            setScore(s => s + 1);
            setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
          } else {
            newSnake.pop();
          }
          return newSnake;
        });
      }, 150);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      };
    }
  }, [activeGame, direction, gameOver, food]);

  const resetSnake = () => {
    setSnake([[10, 10]]);
    setFood([15, 15]);
    setDirection([0, 1]);
    setGameOver(false);
    setScore(0);
  };

  // Tic-Tac-Toe Logic
  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    checkWinner(newBoard);
  };

  const checkWinner = (squares: string[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinner(squares[a]);
        return;
      }
    }
    // @ts-ignore
    if (!squares.includes(null)) setWinner('Draw');
  };

  const resetTicTacToe = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 shiny-text">Arcade</h1>

      {activeGame === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-panel-dark p-6 rounded-xl aspect-video flex flex-col items-center justify-center gap-4 hover:border-neon-purple transition-colors cursor-pointer"
            onClick={() => setActiveGame('snake')}
          >
            <h2 className="text-2xl font-bold text-neon-purple">Snake</h2>
            <p className="text-gray-400">Classic retro fun</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-panel-dark p-6 rounded-xl aspect-video flex flex-col items-center justify-center gap-4 hover:border-neon-green transition-colors cursor-pointer"
            onClick={() => setActiveGame('tictactoe')}
          >
            <h2 className="text-2xl font-bold text-neon-green">Tic-Tac-Toe</h2>
            <p className="text-gray-400">Challenge a friend</p>
          </motion.div>
        </div>
      )}

      {activeGame === 'snake' && (
        <div className="flex flex-col items-center">
          <div className="flex justify-between w-full max-w-[400px] mb-4">
             <button onClick={() => setActiveGame('menu')} className="text-gray-400 hover:text-white">Back to Menu</button>
             <span className="text-neon-purple font-bold">Score: {score}</span>
          </div>
          <div className="relative bg-black border-4 border-neon-purple rounded-lg w-[400px] h-[400px] overflow-hidden grid grid-cols-20 grid-rows-20">
             {/* Simple grid rendering for snake */}
             {Array.from({ length: 400 }).map((_, i) => {
               const x = i % 20;
               const y = Math.floor(i / 20);
               const isSnake = snake.some(s => s[0] === x && s[1] === y);
               const isFood = food[0] === x && food[1] === y;
               return (
                 <div
                   key={i}
                   className="w-full h-full"
                   style={{
                     backgroundColor: isSnake ? '#bd00ff' : isFood ? '#00ff9f' : 'transparent',
                     width: '20px', height: '20px', position: 'absolute', left: x * 20, top: y * 20
                   }}
                 />
               );
             })}
             {gameOver && (
               <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                 <h2 className="text-3xl font-bold text-red-500 mb-4">Game Over</h2>
                 <button onClick={resetSnake} className="px-6 py-2 bg-neon-purple text-white rounded-full">Try Again</button>
               </div>
             )}
          </div>
          <p className="mt-4 text-gray-500 text-sm">Use Arrow Keys to move</p>
        </div>
      )}

      {activeGame === 'tictactoe' && (
        <div className="flex flex-col items-center">
           <div className="flex justify-between w-full max-w-[300px] mb-4">
             <button onClick={() => setActiveGame('menu')} className="text-gray-400 hover:text-white">Back to Menu</button>
             <span className="text-neon-green font-bold">{winner ? (winner === 'Draw' ? 'Draw!' : `Winner: ${winner}`) : `Player: ${isXNext ? 'X' : 'O'}`}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 bg-neon-green/20 p-2 rounded-xl">
             {board.map((cell, i) => (
               <div
                 key={i}
                 onClick={() => handleCellClick(i)}
                 className="w-24 h-24 bg-black/40 rounded-lg flex items-center justify-center text-5xl font-bold text-white cursor-pointer hover:bg-white/10"
               >
                 <span className={cell === 'X' ? 'text-neon-blue' : 'text-neon-purple'}>{cell}</span>
               </div>
             ))}
          </div>
          {winner && (
            <button onClick={resetTicTacToe} className="mt-6 px-6 py-2 bg-neon-green text-black rounded-full font-bold">
              Play Again
            </button>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Games;
