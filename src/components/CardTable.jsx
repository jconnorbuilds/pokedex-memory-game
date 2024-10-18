import Card from './Card.jsx';

export default function CardTable({ cards }) {
  console.log(cards);
  return (
    <div className="card-table">
      {cards.map((card) => {
        return <Card color={card.color} key={card.id} />;
      })}
    </div>
  );
}
