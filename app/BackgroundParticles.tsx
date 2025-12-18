"use client";

import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSnowPreset } from "@tsparticles/preset-snow";
import type { Container, Engine } from "@tsparticles/engine";

const Snow = () => {
  const [init, setInit] = useState(false);

  // This useEffect is used to initialize the tsparticles engine and load the snow preset
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      // load the snow preset
      await loadSnowPreset(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log("Particles container loaded", container);
  };

  // The options object defines the particles' behavior.
  // Using the preset simplifies the options greatly, but you can still override any property.
  const options = useMemo(
    () => ({
      preset: "snow",
      // You can add more customizations here to override the preset defaults
      // For example, to change the color of the snowflakes to red:
      // particles: {
      //   color: {
      //     value: "#ff0000",
      //   },
      // },
      // Or to make them fall slower:
      // particles: {
      //   move: {
      //     speed: 0.5,
      //   },
      // },
    }),
    []
  );

  // If the engine is not initialized, return null or a loading indicator
  if (!init) {
    return null;
  }

  // The Particles component will fill its parent container.
  // Ensure the parent element (or the Particles component itself) has a defined size and position styling.
  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={options}
      // Add custom styles for the canvas to cover the whole screen and be behind other content
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1, // Ensure it's in the background
      }}
    />
  );
};

export default Snow;