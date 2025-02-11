export default function SetAngleInput({ axis, label, value, axisRotationSetter }) {
  return (
    <div className="angle-input">
      <label htmlFor={`${label}-angle`} style={{ display: 'none' }}>
        {label}
      </label>
      <input
        name={`${label}-angle`}
        type="number"
        placeholder={`${axis} angle`}
        style={{ padding: '0 1ch', borderRadius: '8px', border: 'none', width: '75px' }}
        value={value}
        onChange={(e) => {
          axisRotationSetter(+e.target.value);
        }}
      ></input>
    </div>
  );
}
