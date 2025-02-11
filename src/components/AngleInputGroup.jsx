import InputGroup from './InputGroup.jsx';
import AngleInput from './AngleInput.jsx';

export default function AngleInputGroup({
  labelPrefix,
  target,
  setSceneSingleAxisRotation,
}) {
  return (
    <InputGroup>
      {['x', 'y', 'z'].map((axis) => {
        return (
          <AngleInput
            key={`${labelPrefix}-${axis}`}
            axis={axis}
            label={`${labelPrefix}-${axis}`}
            value={target[axis]}
            axisRotationSetter={(value) => setSceneSingleAxisRotation(axis, value)}
          />
        );
      })}
    </InputGroup>
  );
}
