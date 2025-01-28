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

export default function PokedexLidDisplay({ currentPokemon, evolutionChain }) {
  defaults.font.family = "'Turret Road', 'Roboto'";
  defaults.font.weight = 500;

  const stats = currentPokemon ? Object.values(currentPokemon)[0]?.data.stats : undefined;
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
    const currentPkmnColor = 'rgba(75, 192, 192, 0.6)';
    const currentPkmnBorderColor = 'rgba(75, 192, 192, 1)';
    const otherPkmnColor = 'rgba(192, 75, 192, 0.5)';
    const otherPkmnBorderColor = 'rgba(192, 75, 192, 1)';
    const isCurrentPkmn = pokemon.name === currentPokemon.name;

    const stats = pokemon ? pokemon.data.stats : undefined;
    return {
      label: pokemon ? pokemon.name : '',
      data: stats?.map((stat) => stat.base_stat),
      backgroundColor: isCurrentPkmn ? currentPkmnColor : otherPkmnColor,
      borderColor: isCurrentPkmn ? currentPkmnBorderColor : otherPkmnBorderColor,
      order: isCurrentPkmn ? 0 : 1,
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

  // Recursivley generate datasets for each pokemon in the evolution chain
  const generateDatasets = (evolutionChain, datasets = []) => {
    // Push the dataset of the current pokemon to the array
    const dataset = generateDataset(evolutionChain.pkmn);
    datasets.push(dataset);

    // Recursively check if pokemon evolve, and generate datasets for each evolution
    const pokemonEvolves = Array.isArray(evolutionChain.evolvesTo);
    if (pokemonEvolves) {
      evolutionChain.evolvesTo.forEach((child) => generateDatasets(child, datasets));
    }

    return datasets;
  };

  let datasets = currentPokemon && evolutionChain ? generateDatasets(evolutionChain) : [];

  const data = currentPokemon
    ? {
        labels: statNamesFormatted,
        datasets: [...datasets],
      }
    : {};

  const options = {
    datasets: {},
    elements: {
      line: {
        tension: 0,
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
        {currentPokemon ? <Radar data={data} options={options}></Radar> : null}
      </div>
    </>
  );
}
