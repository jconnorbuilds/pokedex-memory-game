import styles from '../styles/AngleInput.module.css';

export default function AngleInput({ axis, label, value, axisRotationSetter }) {
  return (
    <div className={styles.angleInput}>
      <label htmlFor={`${label}-angle`}>{axis}∠</label>
      <input
        name={`${label}-angle`}
        type="number"
        placeholder={`${axis}`}
        value={value}
        onChange={(e) => {
          axisRotationSetter(e.target.value);
        }}
      ></input>
      °
    </div>
  );
}
