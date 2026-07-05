import React, { useEffect, useState } from 'react';

const BackgroundGrid = () => {
  const [nodes, setNodes] = useState([]);
  const [dots, setDots] = useState([]);

  useEffect(() => {
    const generatedNodes = Array.from({ length: 8 }).map((_, i) => ({
      id: `node-${i}`,
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
      delay: `${Math.random() * 4}s`,
    }));

    const generatedDots = Array.from({ length: 20 }).map((_, i) => ({
      id: `dot-${i}`,
      top: `${Math.random() * 90 + 5}%`,
      left: `${Math.random() * 90 + 5}%`,
      delay: `${Math.random() * 3}s`,
    }));

    setNodes(generatedNodes);
    setDots(generatedDots);
  }, []);

  return (
    <div className="dev-grid-container">
      <div className="dev-grid" />
      <div className="dev-scanline" />
      {nodes.map((node) => (
        <div
          key={node.id}
          className="dev-glow-node"
          style={{
            top: node.top,
            left: node.left,
            animationDelay: node.delay,
          }}
        />
      ))}
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="dev-blink-dot"
          style={{
            top: dot.top,
            left: dot.left,
            animationDelay: dot.delay,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundGrid;
