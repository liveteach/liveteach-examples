import { Entity, GltfContainer, InputAction, Material, MeshCollider, MeshRenderer, PointerEventsResult, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { ScreenManager } from "./Screen/screenManager";
import { ScreenDisplay } from "./Screen/screenDisplay";
import { PodiumButton } from "./podiumButton";

export class Podium {
    entity: Entity
    buttonsEntity: Entity
    muteButtonGraphic: Entity

    previousButton: PodiumButton
    nextButton: PodiumButton
    endButton: PodiumButton
    startButton: PodiumButton
    presentationButton: PodiumButton
    videoButton: PodiumButton
    modelButton: PodiumButton
    muteButton: PodiumButton
    playButton: PodiumButton
    powerButton: PodiumButton

    constructor() {
        this.entity = engine.addEntity()
        this.buttonsEntity = engine.addEntity()
        this.muteButtonGraphic = engine.addEntity()

        Transform.create(this.entity, {
            position: Vector3.create(8, 0, 3),
            rotation: Quaternion.fromEulerDegrees(0, -90, 0),
            scale: Vector3.create(1, 1, 1)
        })

        GltfContainer.create(this.entity, { src: "models/podium.glb" })

        Transform.create(this.buttonsEntity,{
            parent:this.entity
        })

        GltfContainer.create(this.buttonsEntity, {src: "models/podium_buttons_on.glb"})

        Transform.create(this.muteButtonGraphic,{
            parent:this.entity
        })

        GltfContainer.create(this.muteButtonGraphic, {src: "models/podium_Mute_on.glb"})


        // Podium screen
        ScreenManager.screenDisplays.push(
            new ScreenDisplay(Vector3.create(0.35, 1.7, -0.06),
                Vector3.create(45, 90, 0),
                Vector3.create(0.2, 0.2, 0.2),
                true,
                this.entity))

        // Podium controls
        this.previousButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, 0),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Previous",
            function () {
                ScreenManager.previous()
            }
        )

        this.nextButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, -0.12),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Next",
            ()=>{
                ScreenManager.next()
            }
        )

        this.startButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, 0.12),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "To Start",
            ()=>{
                ScreenManager.toStart()
            }
        )

        this.endButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, -0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "To End",
            ()=>{
                ScreenManager.toEnd()
            }
        )

        this.presentationButton = new PodiumButton(
            this.entity,
            Vector3.create(0.43, 1.73, 0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Presentation",
            ()=>{
                ScreenManager.showPresentation()
            }
        )

        this.videoButton = new PodiumButton(
            this.entity,
            Vector3.create(0.375, 1.67, 0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Movie",
            ()=>{
                ScreenManager.showVideo()
            }
        )

        this.modelButton = new PodiumButton(
            this.entity,
            Vector3.create(0.28, 1.56, 0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "3D",
            ()=>{
                ScreenManager.showModel()
            }
        )

        let self = this
        this.muteButton = new PodiumButton(
            this.entity,
            Vector3.create(0.31, 1.625, 0.26),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.03, 0.025, 0.04),
            "Mute",
            ()=>{
                ScreenManager.toggleMute(self)
            }
        )

        this.playButton = new PodiumButton(
            this.entity,
            Vector3.create(0.31, 1.625, 0.22),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.03, 0.025, 0.04),
            "Play/Pause",
            ()=>{
                ScreenManager.playPause()
            }
        )

        this.powerButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, 0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Power",
            ()=>{
                ScreenManager.powerToggle(self)
            }
        )

        ScreenManager.powerToggle(this) // Turn off podium on scene load
    }


}