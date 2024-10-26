import { useState } from 'react';

export default function Scoreboard({ score, bestScore }) {
  return (
    <>
      <span>Score: {score} </span>
      <span>Best score: {bestScore}</span>
    </>
  );
}
