import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import useWindowSize from '../hooks/useWindowSize';

const getGridSize = (width) => {
  if (width < 600) {
    return 10;
  } else {
    return 20;
  }
};

const createEmptyGrid = (size) => {
  return Array.from({ length: size }).map(() => Array(size).fill(false));
};

const GameOfLife = () => {
  const { width } = useWindowSize();
  const [gridSize, setGridSize] = useState(getGridSize(width));
  const [grid, setGrid] = useState(createEmptyGrid(gridSize));
  const [running, setRunning] = useState(false);
  const [showModal, setShowModal] = useState(true);

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

  const countNeighbors = (grid, x, y) => {
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
  };

  const runGame = useCallback(() => {
    setGrid((g) => {
      return g.map((rows, x) =>
        rows.map((cell, y) => {
          const neighbors = countNeighbors(g, x, y);
          if (cell && (neighbors < 2 || neighbors > 3)) {
            return false;
          }
          if (!cell && neighbors === 3) {
            return true;
          }
          return cell;
        })
      );
    });
  }, [gridSize]); // eslint-disable-line

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        runGame();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [running, runGame]);

  const handlePlay = () => {
    setRunning(true);
  };

  const handlePause = () => {
    setRunning(false);
  };

  const handleStop = () => {
    setRunning(false);
    setGrid(createEmptyGrid(gridSize));
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
        <button onClick={handlePlay} disabled={running}>Play</button>
        <button onClick={handlePause} disabled={!running}>Pause</button>
        <button onClick={handleStop}>Stop</button>
      </div>
      <button className='help' onClick={() => setShowModal(true)}>?</button>
      <Modal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default GameOfLife;
