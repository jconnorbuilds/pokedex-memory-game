import { useEffect, useState } from 'react';

const SCENE_ROTATION_DEFAULT = { x: 40, y: 20, z: -5 };
const SCENE_ROTATION_POKEDEX_OPEN = { x: 15, y: 10, z: 0 };

export default function useSceneRotation(pokedexIsOpen) {
  const [sceneRotation, setSceneRotation] = useState(SCENE_ROTATION_DEFAULT);

  const baseSceneRotation = pokedexIsOpen
    ? SCENE_ROTATION_POKEDEX_OPEN
    : SCENE_ROTATION_DEFAULT;

  useEffect(() => {
    setSceneRotation(baseSceneRotation);
  }, [baseSceneRotation]);

  const createSingleAxisRotationSetter = (setState) => {
    return (axis, degrees) => setState((previous) => ({ ...previous, [axis]: degrees }));
  };

  const setSceneSingleAxisRotation = createSingleAxisRotationSetter(setSceneRotation);

  return { sceneRotation, setSceneSingleAxisRotation };
}
