import { createContext } from 'react';

import * as Game from './constants.js';

export const GameContext = createContext({
  level: Game.LEVELS['Easy'],
  generation: 1,
});
