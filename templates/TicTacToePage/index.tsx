"use client";
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import { Board } from '@/types/Board';
import { hasFourInARow } from '@/utilities/TicTacToeEngine';
import { computersMove } from '@/utilities/AlphaBeta';
import { Cell } from '@/types/Cell';


export const TicTacToePage: NextPage = () => {
  const [board, setBoard] = useState<Board>([
    [' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ]);
  const [isXTurn, setIsXTurn] = useState(true);
  const [gameWon, setGameWon] = useState(false);

  // Reset the game after a win
  useEffect(() => {
    if (gameWon) {
      // Show winning state, then reset after a delay
      const timeout = setTimeout(() => {
        handleReset();
        setGameWon(false); // Reset gameWon to allow a new game to start
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timeout);
    }
  }, [gameWon]);

  const handleReset = () => {
    setBoard([
      [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]);
    setIsXTurn(true);
  };

  useEffect(() => {

    if (!isXTurn && !gameWon) {
      // Artificial delay to simulate the computer "thinking"
      const delay = 600; // Delay in milliseconds (e.g., 1000ms = 1 second)
      setTimeout(() => {
        const computerMove = computersMove(board);
        if (computerMove) {
          makeMoveAndUpdateBoard(computerMove, 'O'); // 'O' represents the computer's move
        }
      }, delay);
    }
  }, [isXTurn, board, gameWon]);

  const makeMoveAndUpdateBoard = (move: {row: number, col: number}, player: Cell) => {
    const newBoard = [...board];
    if (newBoard[move.row][move.col] === ' ') {
      newBoard[move.row][move.col] = player;
      setBoard(newBoard);

      if (hasFourInARow(newBoard, move.row, move.col, player)) {
        setGameWon(true);
      } else {
        setIsXTurn(!isXTurn); // Switch turns
      }
    }
  };

  const handleClick = (row: number, col: number) => {
    if (board[row][col] === ' ' && !gameWon && isXTurn) {
      makeMoveAndUpdateBoard({row, col}, 'X');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-12 font-serif">Fire På Stribe!</h1>

      <div className="grid grid-row-3 gap-4">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-4 cursor-pointer ">
            {row.map((cell, colIndex) => (
              <button
                className="h-40 w-40 border rounded-lg border-blue-400 bg-blue-400 flex items-center justify-center font-bold font-mono text-9xl"
                key={colIndex}
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {cell === 'X' ? <Image src="./green.svg" width={100} height={100} alt="X" /> : cell === 'O' ? <Image src="./pink.svg" width={100} height={100} alt="O" /> : null}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
