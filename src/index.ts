import {
    ViewerApp,
    AssetManagerPlugin,
    addBasePlugins,
    timeout,
    SSRPlugin,
    mobileAndTabletCheck,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSAOPlugin,
    GroundPlugin,
    FrameFadePlugin,
    BloomPlugin, TemporalAAPlugin, RandomizedDirectionalLightPlugin, AssetImporter,
} from "webgi"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "./styles.css"

gsap.registerPlugin(ScrollTrigger)

const lensObjectNames = [
    'Circle002',
    '+Sphere001001',
    'new',
    '+Plane008001',
    '+SideButtons001',
    'Rings2001',
    '+Rings1001',
    '+Circle003001',
    '+Sphere003001',
    '+Circle001001',
    'Text001',
    'Plane006001',
    '+Plane005001',
    '+Sphere001',
    '+Cylinder001',
    '+BODY044001',
]

async function setupViewer(){

    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        useRgbm: true,
        useGBufferDepth: true,
    })

    const isMobile = mobileAndTabletCheck()

    viewer.renderer.displayCanvasScaling = Math.min(window.devicePixelRatio, 1)

    // viewer.renderer.rendererObject.shadowMap.type = PCFSoftShadowMap

    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position.clone()
    const target = camera.target.clone()
    const loaderElement = document.querySelector('.loader') as HTMLElement
    const header = document.querySelector('.header') as HTMLElement
    const bodyButton =  document.querySelector('.button--body') as HTMLElement

    // await addBasePlugins(viewer)
    // adding manually

    await viewer.addPlugin(GBufferPlugin)
    // await viewer.addPlugin(FullScreenPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(true, true))
    const ssr = await viewer.addPlugin(SSRPlugin)
    const ssao = await viewer.addPlugin(SSAOPlugin)
    // await viewer.addPlugin(DiamondPlugin)
    await viewer.addPlugin(FrameFadePlugin)
    // await viewer.addPlugin(GLTFAnimationPlugin)
    await viewer.addPlugin(GroundPlugin)
    // await viewer.addPlugin(ContactShadowGroundPlugin)
    const bloom = await viewer.addPlugin(BloomPlugin)
    // await viewer.addPlugin(AnisotropyPlugin)
    // await viewer.addPlugin(ThinFilmLayerPlugin)
    // await viewer.addPlugin(NoiseBumpMaterialPlugin)
    // await viewer.addPlugin(CustomBumpMapPlugin)
    // await viewer.addPlugin(ClearcoatTintPlugin)
    // await viewer.addPlugin(VelocityBufferPlugin, false)
    await viewer.addPlugin(TemporalAAPlugin)
    // await viewer.addPlugin(CameraViewPlugin)
    await viewer.addPlugin(RandomizedDirectionalLightPlugin, false)
    // await viewer.addPlugin(HDRiGroundPlugin, false)
    // await viewer.addPlugin(DepthOfFieldPlugin, false)
    // await viewer.addPlugin(SSContactShadows, false)
    // await viewer.addPlugin(KTX2LoadPlugin)

    ssr!.passes.ssr.passObject.lowQualityFrames = 0
    bloom.pass!.passObject.bloomIterations = 2
    ssao.passes.ssao.passObject.material.defines.NUM_SAMPLES = 4

    //Loader
    const importer = manager.importer as AssetImporter

    // Callbacks for start, progress, load complete and stop.
    importer.addEventListener("onStart", (ev) => {
        target.set(8.16, -0.13, 0.51)
        position.set(3.6, -0.04,-3.93)
        onUpdate()
        // console.log("onStart", ev);
        // document.getElementById("progressState").textContent =
        // "Progress: " + (ev.loaded / ev.total) * 100 + "%";
    });
    importer.addEventListener("onProgress", (ev) => {
        // console.log("onProgress", (ev.loaded / ev.total));
        const progressRatio = (ev.loaded / ev.total)
        // loadingBarElement.style.transform = `scaleX(${progressRatio})`
        document.querySelector('.progress')?.setAttribute('style',`transform: scaleX(${progressRatio})`)
        // "Progress: " + (ev.loaded / ev.total) * 100 + "%";
    });
    importer.addEventListener("onLoad", (ev) => {
        // console.log("onLoad", ev)
        introAnimation()
        // document.getElementById("progressState").textContent =
        // "Progress: " + "Loaded";
    });
    importer.addEventListener("onStop", (ev) => {
        // console.log("onStop", ev);
        // document.getElementById("progressState").textContent =
        // "Progress: " + "Stopped";
    });

    viewer.renderer.refreshPipeline()

    await manager.addFromPath("./assets/camera.glb")

    const lensObjects: any[] = []
    for (const obj of lensObjectNames) {
        const o = viewer.scene.findObjectsByName(obj)[0]
        o.userData.__startPos = o.position.z
        o.userData.__deltaPos = -Math.pow(Math.abs(o.position.z)*1.5, 1.25)

        lensObjects.push(o)
    }

    if(camera.controls) camera.controls.enabled = false

    if(isMobile){
        ssr.passes.ssr.passObject.stepCount /= 2
        bloom.enabled = false
        camera.setCameraOptions({fov:65})
    }

    window.scrollTo(0,0)

    await timeout(50) // Wait 50ms

    function introAnimation(){
        const introTL = gsap.timeline()
        introTL
        .to('.loader', {x: '150%', duration: 0.8, ease: "power4.inOut", delay: 1})
        .fromTo(position, {x: 3.6, y: -0.04, z: -3.93}, {x: -3.6, y: -0.04, z: -3.93, duration: 4, onUpdate}, '-=0.8')
        .fromTo(target, {x: 3.16, y: -0.13, z: 0.51}, {x: 0.86, y: -0.13, z: 0.51, duration: 4, onUpdate}, '-=4')
        .fromTo('.header--container', {opacity: 0, y: '-100%'}, {opacity: 1, y: '0%', ease: "power1.inOut", duration: 0.8}, '-=1')
        .fromTo('.hero--scroller', {opacity: 0, y: '150%'}, {opacity: 1, y: '0%', ease: "power4.inOut", duration: 1}, '-=1')
        .fromTo('.hero--content', {opacity: 0, x: '-50%'}, {opacity: 1, x: '0%', ease: "power4.inOut", duration: 1.8, onComplete: setupScrollAnimation}, '-=1')
    }

    function setupScrollAnimation(){
        document.body.setAttribute("style", "overflow-y: scroll")
        document.body.removeChild(loaderElement)


        const tl = gsap.timeline({ default: {ease: 'none'}})

        // PERFORMANCE SECTION
        tl.to(position, {x: -2.5, y: 0.2, z: -3.5,
            scrollTrigger: { trigger: ".cam-view-2",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }, onUpdate
        })

        .to(target,{x: -0.6, y: -0.1, z: 0.9,
            scrollTrigger: { trigger: ".cam-view-2",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }, onUpdate
        })
        .to('.hero--scroller', {opacity: 0, y: '150%',
            scrollTrigger: { trigger: ".cam-view-2", start: "top bottom", end: "top center", scrub: 1, immediateRender: false, pin: '.hero--scroller--container',
        }})

        .to('.hero--content', {opacity: 0, xPercent: '-100', ease: "power4.out",
            scrollTrigger: { trigger: ".cam-view-2", start: "top bottom", end: "top top", scrub: 1, immediateRender: false, pin: '.hero--content',
            // snap: { snapTo: 1, duration: 0.8, ease: "power4.inOut"}
        }}).addLabel("start")

        .fromTo('.performance--content', {opacity: 0, x: '110%'}, {opacity: 1, x: '0%', ease: "power4.out",
            scrollTrigger: { trigger: ".cam-view-2", start: "top bottom", end: 'top top', scrub: 1, immediateRender: false, pin: '.performance--container',
                // snap: { snapTo: 2, duration: 0.8, ease: "power4.inOut"}
        }})
        .addLabel("Performance")

        // // POWER SECTION
        .to(position,  {x: -0.07, y: 5.45, z: -3.7,
            scrollTrigger: { trigger: ".cam-view-3",  start: "top bottom", end: "top top", scrub: true, immediateRender: false,
            // snap: { snapTo: 3, duration: 0.8, ease: "power4.inOut"}
        }, onUpdate
        })
        .to(target, {x: -0.04, y: -0.52, z: 0.61,
            scrollTrigger: { trigger: ".cam-view-3",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }, onUpdate
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
        .addLabel("Power")


        // // AUTOFOCUS SECTION
        .to(position,{x: -5.5, y: 1.7, z: 5,
            scrollTrigger: { trigger: ".cam-view-4",  start: "top bottom", end: "top top", scrub: true, immediateRender: false,
            // snap: { snapTo: 4, duration: 0.8, ease: "power4.inOut"}
        }, onUpdate
        })
        .to(target, {x: 0.04, y: 0.2, z: 0.6,
            scrollTrigger: { trigger: ".cam-view-4",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }, onUpdate
        })
        .fromTo('.autofocus--content', {opacity: 0, y: '130%'}, {opacity: 1, y: '0%', duration: 0.5, ease: "power4.out",
            scrollTrigger: { trigger: ".cam-view-4", start: "top 20%", end: "top top", scrub: 1, immediateRender: false
        }})
        .addLabel("Autofocus")

        // Explore SECTION
        .to(position,{x: -0.3, y: -0.3, z: -4.85,
            scrollTrigger: { trigger: ".cam-view-5",  start: "top bottom", end: "top top", scrub: true, immediateRender: false,
            // snap: { snapTo: 5, duration: 0.8, ease: "power4.inOut"}
        }, onUpdate
        })
        .to(target, {x: -0.9, y: -0.17, z: 0.1,
            scrollTrigger: { trigger: ".cam-view-5",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }, onUpdate
        })
        .fromTo('.explore--content', {opacity: 0, x: '130%'}, {opacity: 1, x: '0%', duration: 0.5, ease: "power4.out",
            scrollTrigger: { trigger: ".cam-view-5", start: "top bottom", end: "top top", scrub: 1, immediateRender: false
        }})
        .addLabel("Explore")

        let tm = {x: 0}
        const expandUpdate = ()=> {
            for (const o of lensObjects) {
                o.position.z = o.userData.__startPos + tm.x * o.userData.__deltaPos
            }
            viewer.setDirty()
            viewer.renderer.resetShadows()
        }
        // Test SECTION
        tl.to(tm,{x: 1,
            scrollTrigger: { trigger: ".cam-view-6",  start: "top bottom", end: "top top", scrub: true, immediateRender: false,
            }, onUpdate: expandUpdate
        })
        tl.to(tm,{x: 1,
            scrollTrigger: { trigger: ".cam-view-7",  start: "top bottom", end: "top top", scrub: true, immediateRender: false,
            }, onUpdate: expandUpdate
        })
        tl.to(tm,{x: 0,
            scrollTrigger: { trigger: ".cam-view-5",  start: "top bottom", end: "top top", scrub: true, immediateRender: false,
            }, onUpdate: expandUpdate
        })
    }

    let needsUpdate = true;
    function onUpdate(){
        needsUpdate = true;
    }

    viewer.addEventListener('preFrame', ()=>{
        if(needsUpdate){
            camera.position.copy(position)
            camera.target.copy(target)
            camera.positionUpdated(false)
            camera.targetUpdated(true)
            needsUpdate = false;
        }
    })

    // INTERFACE ELEMENTS
    const exploreView = document.querySelector('.cam-view-5') as HTMLElement
    const canvasView = document.getElementById('webgi-canvas') as HTMLElement
    const exitContainer = document.querySelector('.exit--container') as HTMLElement

    // KNOW MORE EVENT
    document.querySelector('.button-know-more')?.addEventListener('click', () => {
        const element = document.querySelector('.cam-view-2')
        window.scrollTo({top: element?.getBoundingClientRect().top, left: 0, behavior: 'smooth'})
    })

    // EXPLORE ALL FEATURES EVENT
    document.querySelector('.button-explore')?.addEventListener('click', () => {
        exploreView.setAttribute("style", "pointer-events: none")
        canvasView.setAttribute("style", "pointer-events: all")
        header.setAttribute("style", "position: fixed")
        document.body.setAttribute("style", "overflow-y: hidden")
        document.body.setAttribute("style", "cursor: grab")
        exploreAnimation()
    })

    function exploreAnimation(){
        const tlExplore = gsap.timeline()

        tlExplore.to(position,{x: 5, y: 0.3, z: -4.5, duration: 2.5, onUpdate})
        .to(target, {x: 0.16, y: -0.13, z: 0.5, duration: 2.5, onUpdate}, '-=2.5')
        .fromTo('.header', {opacity: 0}, {opacity: 1, duration: 1.5, ease: "power4.out"}, '-=2.5')
        .to('.explore--content', {opacity: 0, x: '130%', duration: 1.5, ease: "power4.out", onComplete: onCompleteExplore}, '-=2.5')
    }

    function onCompleteExplore(){
        exitContainer.setAttribute("style", "display: flex")
        if(camera.controls) camera.controls.enabled = true
    }

    document.querySelector('.button--exit')?.addEventListener('click', () => {
        exploreView.setAttribute("style", "pointer-events: all")
        canvasView.setAttribute("style", "pointer-events: none")
        document.body.setAttribute("style", "overflow-y: auto")
        exitContainer.setAttribute("style", "display: none")
        header.setAttribute("style", "position: absolute")
        exitAnimation()
    })

    // EXIT EVENT
    function exitAnimation(){
        if(camera.controls) camera.controls.enabled = false

        const tlExit = gsap.timeline()

        tlExit.to(position,{x: -0.3, y: -0.3, z: -4.85, duration: 1.2, ease: "power4.out", onUpdate})
        .to(target, {x: -0.9, y: -0.17, z: 0.1, duration: 1.2, ease: "power4.out", onUpdate}, '-=1.2')
        .to('.explore--content', {opacity: 1, x: '0%', duration: 0.5, ease: "power4.out"}, '-=1.2')
        setLensAppearance(true)
        lensOnly = false
    }

    // VIEW BODY EVENT
    let lensOnly = false
    bodyButton.addEventListener('click', () => {
        if(lensOnly){
            setLensAppearance(true)
            lensOnly = false
            bodyButton.innerHTML = "view body only"
        } else{
            setLensAppearance(false)
            lensOnly = true
            bodyButton.innerHTML = "view with lens"
        }
    })


    function setLensAppearance(_value: boolean){
        for (const o of lensObjects) {
            o.visible = _value
        }
        viewer.scene.setDirty({sceneUpdate: true})
    }
}

setupViewer()
