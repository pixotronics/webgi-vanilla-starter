import {
    ViewerApp,
    AssetManagerPlugin,
    addBasePlugins,
    timeout,
} from "webgi"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "./styles.css"

gsap.registerPlugin(ScrollTrigger)

async function setupViewer(){

    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        useRgbm: true,
    })

    const manager = await viewer.addPlugin(AssetManagerPlugin)
    await addBasePlugins(viewer)

    viewer.renderer.refreshPipeline()

    await manager.addFromPath("./assets/camera.glb")

    const camera = viewer.scene.activeCamera
    if(camera.controls) camera.controls.enabled = false

    await timeout(50) // Wait 50ms

    gsap.timeline()
    .fromTo(camera.position,{x: 3.6, y: -0.04, z: -3.93}, {x: -3.6, y: -0.04, z: -3.93, duration: 4, delay: 1, onUpdate: updatePositions})
    .fromTo(camera.target, {x: 8.16, y: -0.13, z: 0.51}, {x: 0.16, y: -0.13, z: 0.51, duration: 4, onUpdate: updatePositions }, '-=4')
    .fromTo('.header--container', {opacity: 0, y: '-100%'}, {opacity: 1, y: '0%', ease: "power1.inOut", duration: 0.8}, '-=1')
    .fromTo('.hero--content', {opacity: 0, x: '-50%'}, {opacity: 1, x: '0%', ease: "power4.inOut", duration: 1.8, onComplete: setupScrollAnimation}, '-=1')

    function setupScrollAnimation(){
        const tl = gsap.timeline({ default: {ease: 'none'}})

        // PERFORMANCE SECTION
        tl.to(camera.position, {x: -2.5, y: 0.2, z: -3.5,
            scrollTrigger: { trigger: ".cam-view-2",  start: "top bottom", end: "top top", scrub: true, immediateRender: false},
            onUpdate: updatePositions
        })
        .to(camera.target,{x: -0.6, y: -0.1, z: 0.9,
            scrollTrigger: { trigger: ".cam-view-2",  start: "top bottom", end: "top top", scrub: true, immediateRender: false },
            onUpdate: updatePositions
        })
        .to('.hero--content', {opacity: 0, xPercent: '-100', ease: "power4.out",
            scrollTrigger: { trigger: ".cam-view-2", start: "top bottom", end: "top top", scrub: 1, immediateRender: false, pin: '.hero--content'
        }})
        .fromTo('.performance--content', {opacity: 0, x: '110%'}, {opacity: 1, x: '0%', ease: "power4.out",
            scrollTrigger: { trigger: ".cam-view-2", start: "top bottom", end: 'top top', scrub: 1, immediateRender: false, pin: '.performance--container'
        }})

        // // POWER SECTION
        .to(camera.position,  {x: -0.07, y: 5.45, z: -3.7,
            scrollTrigger: { trigger: ".cam-view-3",  start: "top bottom", end: "top top", scrub: true, immediateRender: false },
            onUpdate: updatePositions
        })
        .to(camera.target, {x: -0.04, y: -0.52, z: 0.61,
            scrollTrigger: { trigger: ".cam-view-3",  start: "top bottom", end: "top top", scrub: true, immediateRender: false },
            onUpdate: updatePositions
        })
        .to('.performance--content', {autoAlpha: 0, ease: "power4.out",
            scrollTrigger: { trigger: ".cam-view-3", start: "top bottom", end: 'top center', scrub: 1, immediateRender: false,
        }})
        .fromTo('.power--content', {opacity: 0, x: '-110%'}, {opacity: 1, x: '0%', ease: "power4.out",
            scrollTrigger: { trigger: ".cam-view-3", start: "top 20%", end: 'top top', scrub: 1, immediateRender: false
        }})
        .fromTo('.power--features--img', {opacity: 0, x: '110%'}, {opacity: 1, x: '0%', ease: "power4.out",
            scrollTrigger: { trigger: ".cam-view-3", start: "top 20%", end: 'top top', scrub: 1, immediateRender: false
        }})

        // // AUTOFOCUS SECTION
        .to(camera.position,{x: -5.5, y: 1.7, z: 5,
            scrollTrigger: { trigger: ".cam-view-4",  start: "top bottom", end: "top top", scrub: true, immediateRender: false },
            onUpdate: updatePositions
        })
        .to(camera.target, {x: 0.04, y: 0.2, z: 0.6,
            scrollTrigger: { trigger: ".cam-view-4",  start: "top bottom", end: "top top", scrub: true, immediateRender: false },
            onUpdate: updatePositions
        })
        .fromTo('.autofocus--content', {opacity: 0, y: '130%'}, {opacity: 1, y: '0%', duration: 0.5, ease: "power4.out",
            scrollTrigger: { trigger: ".cam-view-4", start: "top 20%", end: "top top", scrub: 1, immediateRender: false
        }})

    }

    function updatePositions(){
        camera.positionUpdated(false)
        camera.targetUpdated(true)
    }


    window.scrollTo(0,0)

}

setupViewer()
