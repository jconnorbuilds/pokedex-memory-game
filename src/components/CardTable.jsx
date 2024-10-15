import Card from './Card.jsx';

export default function CardTable({ cards }) {
  return (
    <div className="card-table">
      {cards.map((card) => {
        return <Card key={card.id} />;
      })}
    </div>
  );
}
