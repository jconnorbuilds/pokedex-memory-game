import { useState } from 'react';

export default function SetAngleInput({ axis, label, value, setAngle }) {
  // console.log(value);
  return (
    <div className="angle-input">
      <label htmlFor={`${axis}-angle`} style={{ display: 'none' }}>
        {label}
      </label>
      <input
        name={`${axis}-angle`}
        type="number"
        placeholder={`${axis} angle`}
        data-axis={axis}
        onInput={(e) => setAngle(e.target.value, axis)}
        style={{ padding: '0 1ch', borderRadius: '8px', border: 'none', width: '75px' }}
        value={value}
      ></input>
    </div>
  );
}
