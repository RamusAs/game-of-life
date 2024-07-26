import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import useWindowSize from '../hooks/useWindowSize';

const getGridSize = (width) => {
  if (width < 600) {
    return 10;
  } else if (width < 900) {
    return 20;
  } else {
    return 30;
  }
};

const createEmptyGrid = (size) => {
  return Array.from({ length: size }).map(() => Array(size).fill(false));
};

const gridsEqual = (grid1, grid2) => {
  for (let i = 0; i < grid1.length; i++) {
    for (let j = 0; j < grid1[i].length; j++) {
      if (grid1[i][j] !== grid2[i][j]) {
        return false;
      }
    }
  }
  return true;
};

const GameOfLife = () => {
  const { width } = useWindowSize();
  const [gridSize, setGridSize] = useState(getGridSize(width));
  const [grid, setGrid] = useState(createEmptyGrid(gridSize));
  const [running, setRunning] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const size = getGridSize(width);
    setGridSize(size);
    setGrid(createEmptyGrid(size));
  }, [width]);

  const handleCellClick = (row, col) => {
    const newGrid = grid.map((rows, rIdx) =>
      rows.map((cell, cIdx) => (rIdx === row && cIdx === col ? !cell : cell))
    );
    setGrid(newGrid);
  };

  const countNeighbors = useCallback((grid, x, y) => {
    const directions = [
      [0, 1], [0, -1], [1, 0], [-1, 0],
      [1, 1], [1, -1], [-1, 1], [-1, -1],
    ];

    return directions.reduce((acc, [dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;
      if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
        return acc + (grid[newX][newY] ? 1 : 0);
      }
      return acc;
    }, 0);
  }, [gridSize]);

  const runGame = useCallback(() => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((rows, x) =>
        rows.map((cell, y) => {
          const neighbors = countNeighbors(prevGrid, x, y);
          if (cell && (neighbors < 2 || neighbors > 3)) {
            return false;
          }
          if (!cell && neighbors === 3) {
            return true;
          }
          return cell;
        })
      );

      if (newGrid.flat().every(cell => !cell)) {
        setMessage('La population a été décimée.');
        setRunning(false);
      } else if (gridsEqual(prevGrid, newGrid)) {
        setMessage('La population a atteint une stabilité.');
        setRunning(false);
      }

      return newGrid;
    });
  }, [countNeighbors]);

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        runGame();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [running, runGame]);

  const handlePlay = () => {
    setMessage('');
    setRunning(true);
  };

  const handlePause = () => {
    setRunning(false);
  };

  const handleStop = () => {
    setRunning(false);
    setGrid(createEmptyGrid(gridSize));
    setMessage('');
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 20px)` }}>
        {grid.map((rows, rowIdx) =>
          rows.map((col, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              onClick={() => handleCellClick(rowIdx, colIdx)}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[rowIdx][colIdx] ? 'white' : 'black',
                border: 'solid 1px grey',
              }}
            />
          ))
        )}
      </div>
      <div style={{ marginTop: 20 }}>
        <button onClick={handlePlay} disabled={running || grid.flat().every(cell => !cell)}>Play</button>
        <button onClick={handlePause} disabled={!running}>Pause</button>
        <button onClick={handleStop}>Stop</button>
      </div>
      <button className='help' onClick={() => setShowModal(true)}>?</button>
      <Modal show={showModal} onClose={() => setShowModal(false)} />
      {message && <p className='message'>{message} <button onClick={() => setMessage('')}>x</button></p>}
    </div>
  );
};

export default GameOfLife;
