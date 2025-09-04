import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
import ModelView from "./ModelView";
import { yellowImg } from "../utils";
import * as THREE from "three";
import { View } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { models, sizes } from "../constants/index";
import { animateWithGsapTimeline } from "../utils/animations";

const Model = () => {
  const [size, setSize] = useState("small"); // model size
  const [model, setModel] = useState({
    // model details
    title: "iphone 15 Pro in Natural Titanium",
    color: ["#8F8A81", "#ffe7b9", "#6f6c64"],
    img: yellowImg,
  });

  // currently crashing the page, something to do with the THREE import
  //camera control for the model view
  const cameraControlSmall = useRef();
  const cameraControlLarge = useRef();

  // model
  const small = useRef(new THREE.Group());
  const large = useRef(new THREE.Group());

  const [eventSource, setEventSource] = useState(null);

  // rotation
  const [smallRotation, setSmallRotation] = useState(0);
  const [largeRotation, setLargeRotation] = useState(0);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    gsap.to("#heading", {
      y: 0,
      opacity: 1,
    });
  }, []);

  useEffect(() => {
    if (size === 'large') {
      
    }
    

    if (size === 'small') {

    }
  }, [size]);

  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      setEventSource(rootElement);
    }
  }, []);

  return (
    <section className="common-padding ">
      <div className="screen-max-width">
        <h1 id="heading" className="section-heading">
          Take a closer look.
        </h1>
        <div className="flex flex-col items-center mt-5">
          <div className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative ">
            <ModelView
              index={1}
              groupRef={small}
              gsapType="view1"
              controlRef={cameraControlSmall}
              setRotationState={setSmallRotation}
              item={model}
              size={size}
            />

            <ModelView
              index={2}
              groupRef={large}
              gsapType="view2"
              controlRef={cameraControlLarge}
              setRotationState={setLargeRotation}
              item={model}
              size={size}
            />

            <Canvas
              style={{
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: "hidden",
              }}
              eventSource={eventSource}
            >
              <View.Port />
            </Canvas>
            
          </div>
          <div className="mx-auto w-full ">
            <p className="text-sm font-light text-center mb-5">{model.title}</p>
            <div className="flex-center">
              <ul className="color-container">
                {models.map((item, i) => (
                  <li
                    key={i}
                    className="w-6 h-6 rounded-full mx-2 cursor-pointer"
                    style={{ backgroundColor: item.color[0] }}
                    onClick={() => setModel(item)}
                  ></li>
                ))}
              </ul>

              <button className="size-btn-container">
                {sizes.map(({ label, value }) => (
                  <span
                    key={label}
                    className="size-btn"
                    style={{
                      backgroundColor: size === value ? "white" : "transparent",
                      color: size === value ? "black" : "white",
                    }}
                    onClick={() => setSize(value)} // set size to value ("small" or "large")
                  >
                    {label}
                  </span>
                ))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Model;
