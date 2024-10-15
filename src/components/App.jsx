import { useState, useEffect } from 'react';
import '../styles/App.css';
import Scoreboard from './Scoreboard.jsx';
import CardTable from './CardTable.jsx';

const initialCards = [
  { id: 0, value: 0 },
  { id: 1, value: 1 },
  { id: 2, value: 2 },
  { id: 3, value: 3 },
  { id: 4, value: 4 },
  { id: 5, value: 5 },
];

const getColors = async () => {
  const response = await fetch('https://csscolorsapi.com/api/colors/cyan', {
    mode: 'no-cors',
  });

  return response;
};

export default function App() {
  const [cards, setCards] = useState(initialCards);
  const [colors, setColors] = useState(null);

  useEffect(() => {
    const getColors = async () => {
      setColors(null);
      const response = await fetch('https://csscolorsapi.com/api/colors');
      const data = await response.json();
      if (!ignore) {
        console.log(data);
        // setColors(data);
      }
    };

    let ignore = false;
    getColors();

    return () => {
      ignore = true;
    };
  });

  return (
    <>
      <CardTable cards={cards} />
      <Scoreboard />
    </>
  );
}
