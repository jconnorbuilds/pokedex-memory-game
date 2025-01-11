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

export default function PokedexLidDisplay({ pokemon, evolutionChain }) {
  defaults.font.family = "'Turret Road', 'Roboto'";
  defaults.font.weight = 500;

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

  const generateDataset = (pokemon) => {
    const stats = pokemon ? pokemon.data.stats : undefined;
    return {
      label: pokemon ? pokemon.name : '',
      data: stats?.map((stat) => stat.base_stat),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 0.9)',
      borderWidth: 2,
      pointColor: 'rgba(153, 102, 255)',
      pointHoverBorderColor: '#FFF',
      pointHoverBorderWidth: 3,
      pointHoverRadius: 5,
      pointStyle: 'rect',
      pointHitRadius: 10,
      pointSize: 4,
    };
  };

  const generateDatasets = (evolutionChain, datasets = []) => {
    const dataset = generateDataset(evolutionChain.pkmn);
    datasets.push(dataset);
    if (Array.isArray(evolutionChain.evolvesTo)) {
      evolutionChain.evolvesTo.forEach((child) => {
        return generateDatasets(child, datasets);
      });
    }

    return datasets;
  };

  let datasets = evolutionChain ? generateDatasets(evolutionChain) : [];

  const data = pokemon
    ? {
        labels: statNamesFormatted,
        datasets: [...datasets],
      }
    : {};

  const options = {
    datasets: {},
    elements: {
      line: {
        tension: 0.15,
      },
      point: {
        pointBorderWidth: 0,
      },
    },
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
