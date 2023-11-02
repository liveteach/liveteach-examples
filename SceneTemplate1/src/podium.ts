import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { PodiumButton } from "./podiumButton";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom";

export class Podium {
    entity: Entity
    buttonsEntity: Entity

    previousButton: PodiumButton
    nextButton: PodiumButton
    endButton: PodiumButton
    startButton: PodiumButton
    presentationButton: PodiumButton
    videoButton: PodiumButton
    modelButton: PodiumButton
    powerButton: PodiumButton

    constructor() {
        this.entity = engine.addEntity()
        this.buttonsEntity = engine.addEntity()

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

        // Podium controls
        this.previousButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, 0),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Previous",
            function () {
                ClassroomManager.screenManager?.previous()
            }
        )

        this.nextButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, -0.12),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Next",
            ()=>{
                ClassroomManager.screenManager?.next()
            }
        )

        this.startButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, 0.12),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "To Start",
            ()=>{
                ClassroomManager.screenManager?.toStart()
            }
        )

        this.endButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, -0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "To End",
            ()=>{
                ClassroomManager.screenManager?.toEnd()
            }
        )

        this.presentationButton = new PodiumButton(
            this.entity,
            Vector3.create(0.43, 1.73, 0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Presentation",
            ()=>{
                ClassroomManager.screenManager?.showPresentation()
            }
        )

        this.videoButton = new PodiumButton(
            this.entity,
            Vector3.create(0.375, 1.67, 0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Movie",
            ()=>{
                ClassroomManager.screenManager?.showVideo()
            }
        )

        this.modelButton = new PodiumButton(
            this.entity,
            Vector3.create(0.3, 1.6, 0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "3D",
            ()=>{
                ClassroomManager.screenManager?.showModel()
            }
        )

        this.powerButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, 0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Power",
            ()=>{
                ClassroomManager.screenManager?.powerToggle()
            }
        )
    }
}