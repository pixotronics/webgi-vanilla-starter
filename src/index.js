import {
    ViewerApp,
    AssetManagerPlugin,
    addBasePlugins,
    CanvasSnipperPlugin,
} from "webgi";
import "./styles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Pane } from "tweakpane";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({scroller: ".mainContainer"});

async function setupViewer(){

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas'),
        useRgbm: false,
    });

    const data={
        position: {x: 0, y: 0, z: 0},
        rotation: {x: 0, y: 0, z: 0},
    }

    const pane = new Pane();
    viewer.renderer.displayCanvasScaling = Math.min(window.devicePixelRatio, 1)

    const manager = await viewer.addPlugin(AssetManagerPlugin)

    
    await addBasePlugins(viewer)

    const importer = manager.importer

    importer.addEventListener("onProgress", (ev)=> {
        const progress=ev.loaded/ev.total
        document.querySelector(".progress").setAttribute("style", `transform: scaleX(${progress})`)
    });

    importer.addEventListener("onLoad", () => {
        introAnimation();
    });

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    await viewer.addPlugin(CanvasSnipperPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    // Import and add a GLB file.
    // await viewer.load("./assets/scene.glb")
    const model = await manager.addFromPath("./assets/ring-scene2.glb");
    const object3d = model[0].modelObject;
    const modelPosition = object3d.position;
    const modelRotation = object3d.rotation;

    const loaderElement = document.querySelector(".loader");

    function introAnimation() {
        const t1=gsap.timeline()

        t1.to(".loader", {
            x: "150%",
            duration: 0.8,
            ease: "power4.inOut",
            delay: 1,
            onComplete: setupScrollAnimation
        })
    }

    pane.addInput(data, "position", {
        x: { step: 0.01 },
        y: { step: 0.01 },
        z: { step: 0.01 },
    });
    pane.addInput(data, "rotation", {
        x: { min: -6.28, max: 6.28, step: 0.001 },
        y: { min: -6.28, max: 6.28, step: 0.001 },
        z: { min: -6.28, max: 6.28, step: 0.001 },
    });

    pane.on("change", (e) => {
        if (e.presetKey === "rotation") {
            const {x, y, z } = e.value;
            modelRotation.set(x, y, z);
        } else {
            const {x, y, z } = e.value;
            modelPosition.set(x, y, z);
        }
        onUpdate();
    })

    function setupScrollAnimation() {
        document.body.removeChild(loaderElement);

        const tl = gsap.timeline();

        tl.to(modelPosition, {
        x: -0.9,
        y: -0.67,
        z: 0,
        scrollTrigger: {
            trigger: ".first",
            start: "top top",
            end: "top top",
            scrub: 0.2,
            immediateRender: false,
        },
        onUpdate,
        })
        .to(modelPosition, {
            x: 0.54,
            y: -0.27,
            z: 2.87,
            scrollTrigger: {
            trigger: ".second",
            start: "top bottom",
            end: "top top",
            scrub: 0.2,
            immediateRender: false,
            },
            onUpdate,
        })
        .to(modelRotation, {
            x: 0.088,
            y: -0.288,
            z: -0.097,
            scrollTrigger: {
            trigger: ".second",
            start: "top bottom",
            end: "top top",
            scrub: 0.2,
            immediateRender: false,
            },
        })
        .to(modelPosition, {
            x: -1.21,
            y: -0.40,
            z: 1.00,
            scrollTrigger: {
              trigger: ".third",
              start: "top bottom",
              end: "top top",
              scrub: 0.2,
              immediateRender: false,
            },
            onUpdate,
          })
    
          .to(modelRotation, {
            x: 0.300,
            y: 0.650,
            z: -0.131,
            scrollTrigger: {
              trigger: ".third",
              start: "top bottom",
              end: "top top",
              scrub: 0.2,
              immediateRender: false,
            },
          })
          .to(modelPosition, {
            x: 0.00,
            y: -0.77,
            z: 2,
            scrollTrigger: {
              trigger: ".fourth",
              start: "top bottom",
              end: "top top",
              scrub: 0.2,
              immediateRender: false,
            },
            onUpdate,
          })
          .to(modelRotation, {
            x: -0.4,
            y: 0,
            z: 0,
            scrollTrigger: {
              trigger: ".fourth",
              start: "top bottom",
              end: "top top",
              scrub: 0.2,
              immediateRender: false,
            },
          })
          .to(modelPosition, {
            x: 0.00,
            y: -0.35,
            z: 0.00,
            scrollTrigger: {
              trigger: ".fifth",
              start: "top bottom",
              end: "top top",
              scrub: 0.2,
              immediateRender: false,
            },
            onUpdate,
          })
          .to(modelRotation, {
            x: -0.768,
            y: 0,
            z: 0,
            scrollTrigger: {
              trigger: ".fifth",
              start: "top bottom",
              end: "top top",
              scrub: 0.2,
              immediateRender: false,
            },
          })
          .to(".section--one--container1", {
            opacity: 0,
            scrollTrigger: {
              trigger: ".section--one--container1",
              start: "top top",
              end: "bottom top",
              scrub: true,
              immediateRender: false,
            },
          })
          .to(".section--one--container2", {
            opacity: 0,
            scrollTrigger: {
              trigger: ".second",
              start: "top bottom",
              end: "top center",
              scrub: true,
              immediateRender: false,
            },
          })
          
        console.log("setupScrollAnimation");

    }

    function onUpdate(){
        viewer.setDirty();
    }

}

setupViewer()
