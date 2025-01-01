import styles from '../styles/PokedexLidDisplay.module.css';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function PokedexLidDisplay({ pokemon }) {
  console.log(pokemon);
  const blankData = {};
  const stats = pokemon?.data.stats;
  const statNamesFormatted = stats?.map((stat) => {
    const statNames = {
      hp: 'HP',
      attack: 'ATT.',
      defense: 'DEF.',
      'special-attack': 'SP. ATT.',
      'special-defense': 'SP. DEF.',
      speed: 'SPD.',
    };
    return statNames[stat.stat.name];
  });
  const data = pokemon
    ? {
        labels: statNamesFormatted,
        datasets: [
          {
            label: pokemon?.name,
            data: stats?.map((stat) => stat.base_stat),
            lineColor: '#eee',
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 0.9)',
            borderWidth: 2,
            pointColor: 'rgba(153, 102, 255)',
            pointHoverBorderColor: '#FFF',
            pointHoverBorderWidth: 3,
            pointBorderWidth: 0,
            pointHoverRadius: 5,
            pointStyle: 'rect',
            pointHitRadius: 10,
            pointSize: 4,
            tension: 0.15,
          },
        ],
      }
    : blankData;

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        angleLines: {
          color: '#DDD',
        },
        grid: {
          color: '#444',
        },
        pointLabels: {
          display: true,
          padding: 0,
        },
        suggestedMax: 200,
        ticks: {
          backdropColor: '#0006',
          color: '#bbb',
        },
      },
    },
    plugins: {
      legend: {
        align: 'start',
        position: 'chartArea',
        // padding: 50,
        // height: 50,
        // display: false,
      },
    },
  };

  return (
    <>
      <div className={styles.lidDisplay}>
        {pokemon ? <Radar data={data} options={options}></Radar> : null}
      </div>
    </>
  );
}
