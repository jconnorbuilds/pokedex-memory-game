import { useState, useEffect } from 'react';
import COLOR_DATA from '../colors.json';
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
  const response = await fetch('https://csscolorsapi.com/api/colors/cyan', {});

  return response;
};

export default function App() {
  const [cards, setCards] = useState(initialCards);
  const [colors, setColors] = useState(null);

  useEffect(() => {
    const fetchColors = () => {
      setColors(null);
      const result = COLOR_DATA; // Uses hard-coded color data for now
      if (!ignore) setColors(result);
      return result;
    };

    let ignore = false;
    const allColors = fetchColors();

    // Needs a way to make colors not so close together. Maybe just hand pick them?
    const getRandomColorIdx = () => Math.floor(Math.random() * allColors.length);
    const getRandomColor = () => allColors[getRandomColorIdx()];

    // Only run if cards haven't had the color prop added
    if (cards.some((card) => !card.color)) {
      const cardsWithColorProp = initialCards.map((card) =>
        Object.defineProperty(card, 'color', { value: { ...getRandomColor() } }),
      );
      setCards(cardsWithColorProp);
    }

    return () => {
      ignore = true;
    };
  }, [cards.length]);

  return colors ? (
    <>
      <CardTable cards={cards} />
      <Scoreboard />
    </>
  ) : (
    <div>Loading cards...</div>
  );
}
