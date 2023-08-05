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
    });

    // const data={
    //     position: {x: 0, y: 0, z: 0},
    //     rotation: {x: 0, y: 0, z: 0},
    // }

    // const pane = new Pane();
    viewer.renderer.displayCanvasScaling = Math.min(window.devicePixelRatio, 1)

    const manager = await viewer.addPlugin(AssetManagerPlugin)

    
    await addBasePlugins(viewer)

    const importer = manager.importer

    // importer.addEventListener("onProgress", (ev)=> {
    //     const progress=ev.loaded/ev.total
    //     document.querySelector(".progress").setAttribute("style", `transform: scaleX(${progress})`)
    // });

    // importer.addEventListener("onLoad", () => {
    //     introAnimation();
    // });

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    await viewer.addPlugin(CanvasSnipperPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    // Import and add a GLB file.
    // await viewer.load("./assets/scene.glb")
    const model = await manager.addFromPath("./assets/ring-scene1.glb");
    // const object3d = model[0].modelObject;
    // const modelPosition = object3d.position;
    // const modelRotation = object3d.rotation;

    // const loaderElement = document.querySelector(".loader");

    // Load an environment map if not set in the glb file
    // await viewer.setEnvironmentMap((await manager.importer!.importSinglePath<ITexture>("./assets/environment.hdr"))!);

    // Add some UI for tweak and testing.
    // const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)
    // Add plugins to the UI to see their settings.
    // uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, CanvasSnipperPlugin)
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

    // pane.addInput(data, "position", {
    //     x: { step: 0.01 },
    //     y: { step: 0.01 },
    //     z: { step: 0.01 },
    // });
    // pane.addInput(data, "rotation", {
    //     x: { min: -6.28, max: 6.28, step: 0.001 },
    //     y: { min: -6.28, max: 6.28, step: 0.001 },
    //     z: { min: -6.28, max: 6.28, step: 0.001 },
    // });

    // pane.on("change", (e) => {
    //     if (e.presetKey === "rotation") {
    //         const {x, y, z } = e.value;
    //         modelRotation.set(x, y, z);
    //     } else {
    //         const {x, y, z } = e.value;
    //         modelPosition.set(x, y, z);
    //     }
    //     onUpdate();
    // })

    // function setupScrollAnimation() {
    //     // document.body.removeChild(loaderElement);

    //     const tl = gsap.timeline();

    //     tl.to(modelPosition, {
    //     x: -0.9,
    //     y: -0.43,
    //     z: 0,
    //     scrollTrigger: {
    //         trigger: ".first",
    //         start: "top top",
    //         end: "top top",
    //         scrub: 0.2,
    //         immediateRender: false,
    //     },
    //     onUpdate,
    //     })
    //     .to(modelPosition, {
    //         x: -1.36,
    //         y: -0.02,
    //         z: -0.22,
    //         scrollTrigger: {
    //         trigger: ".second",
    //         start: "top bottom",
    //         end: "top top",
    //         scrub: 0.2,
    //         immediateRender: false,
    //         },
    //         onUpdate,
    //     })
    //     .to(modelRotation, {
    //         x: 0.0,
    //         y: 0,
    //         z: -1.57,
    //         scrollTrigger: {
    //         trigger: ".second",
    //         start: "top bottom",
    //         end: "top top",
    //         scrub: 0.2,
    //         immediateRender: false,
    //         },
    //     })
    //     .to(modelPosition, {
    //         x: 0.38,
    //         y: -0.11,
    //         z: -1.06,
    //         scrollTrigger: {
    //           trigger: ".third",
    //           start: "top bottom",
    //           end: "top top",
    //           scrub: 0.2,
    //           immediateRender: false,
    //         },
    //         onUpdate,
    //       })
    
    //       .to(modelRotation, {
    //         x: 0.403,
    //         y: 0.957,
    //         z: -0.421,
    //         scrollTrigger: {
    //           trigger: ".third",
    //           start: "top bottom",
    //           end: "top top",
    //           scrub: 0.2,
    //           immediateRender: false,
    //         },
    //       })
    //       .to(modelPosition, {
    //         x: 0.00,
    //         y: -0.72,
    //         z: 1.31,
    //         scrollTrigger: {
    //           trigger: ".fourth",
    //           start: "top bottom",
    //           end: "top top",
    //           scrub: 0.2,
    //           immediateRender: false,
    //         },
    //         onUpdate,
    //       })
    
    //       .to(modelRotation, {
    //         x: -0.120,
    //         y: 1.598,
    //         z: 0.132,
    //         scrollTrigger: {
    //           trigger: ".fourth",
    //           start: "top bottom",
    //           end: "top top",
    //           scrub: 0.2,
    //           immediateRender: false,
    //         },
    //       })
    //       .to(".section--one--container1", {
    //         opacity: 0,
    //         scrollTrigger: {
    //           trigger: ".section--one--container1",
    //           start: "top top",
    //           end: "bottom top",
    //           scrub: true,
    //           immediateRender: false,
    //         },
    //       })
    //       .to(".section--one--container2", {
    //         opacity: 0,
    //         scrollTrigger: {
    //           trigger: ".second",
    //           start: "top bottom",
    //           end: "top center",
    //           scrub: true,
    //           immediateRender: false,
    //         },
    //       })
          
    //     console.log("setupScrollAnimation");

    // }

    // function onUpdate(){
    //     viewer.setDirty();
    // }

}

setupViewer()
