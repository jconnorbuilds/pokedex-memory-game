function Scene({ rotation, children }) {
  const sceneTransform = {
    transform: `
  rotateY(${rotation.y}deg)
  rotateX(${rotation.x}deg)
  rotateZ(${rotation.z}deg)`,
  };

  return (
    <div id="scene" className="scene" style={sceneTransform}>
      {children}
    </div>
  );
}

export default Scene;
