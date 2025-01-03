import styles from '../styles/PokedexLidDisplay.module.css';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  defaults,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function PokedexLidDisplay({ pokemon }) {
  defaults.font.family = "'Turret Road', 'Roboto'";
  defaults.font.weight = 500;

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
          color: ['rgba(75, 192, 192, 0.6)', 'rebeccapurple'],
          lineWidth: 3,
        },
        grid: {
          color: '#888',
        },
        pointLabels: {
          display: true,
          padding: 0,
          color: '#CCC',
        },
        suggestedMax: 180,
        ticks: {
          backdropColor: '#0006',
          color: '#CCC',
          textStrokeColor: 'green',
          textStrokeWidth: 2,
        },
      },
    },

    plugins: {
      legend: {
        align: 'start',
        position: 'chartArea',
      },
    },
  };

  return (
    <>
      <div className={styles.lidDisplay}>
        <div className={styles.statsMenu}>
          <button>Stats</button>
          <button>Compare</button>
        </div>
        {pokemon ? <Radar data={data} options={options}></Radar> : null}
      </div>
    </>
  );
}
