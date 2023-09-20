import { Entity, GltfContainer, InputAction, MeshCollider, MeshRenderer, PointerEventsResult, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { ScreenManager } from "./Screen/screenManager";
import { ScreenDisplay } from "./Screen/screenDisplay";

export class Podium {
    entity: Entity

    previousButton: Entity
    nextButton: Entity
    endButton: Entity
    startButton: Entity

    constructor() {
        this.entity = engine.addEntity()

        Transform.create(this.entity, {
            position: Vector3.create(8, 0, 3),
            rotation: Quaternion.fromEulerDegrees(0, -90, 0),
            scale: Vector3.create(1, 1, 1)
        })

        GltfContainer.create(this.entity, { src: "models/podium.glb" })


        // Podium screen
        ScreenManager.instance.screenDisplays.push(
            new ScreenDisplay(Vector3.create(0.35, 1.7, -0.06),
                Vector3.create(45, 90, 0),
                Vector3.create(0.2, 0.2, 0.2),
                this.entity))

        // Podium controls
        this.previousButton = engine.addEntity()
        Transform.create(this.previousButton, {
            parent: this.entity,
            position: Vector3.create(0.2, 1.5, 0),
            rotation: Quaternion.fromEulerDegrees(0, 0, 45),
            scale: Vector3.create(0.1, 0.05, 0.1)
        })
        MeshRenderer.setBox(this.previousButton)
        MeshCollider.setBox(this.previousButton)
        pointerEventsSystem.onPointerDown(
            this.previousButton,
            function () {
                ScreenManager.previous()
            },
            {
                button: InputAction.IA_POINTER,
                hoverText: "Previous"
            }
        )

        this.nextButton = engine.addEntity()
        Transform.create(this.nextButton, {
            parent: this.entity,
            position: Vector3.create(0.2, 1.5, -0.12),
            rotation: Quaternion.fromEulerDegrees(0, 0, 45),
            scale: Vector3.create(0.1, 0.05, 0.1)
        })
        MeshRenderer.setBox(this.nextButton)
        MeshCollider.setBox(this.nextButton)
        pointerEventsSystem.onPointerDown(
            this.nextButton,
            function () {
                ScreenManager.next()
            },
            {
                button: InputAction.IA_POINTER,
                hoverText: "Next"
            }
        )

        this.startButton = engine.addEntity()
        Transform.create(this.startButton, {
            parent: this.entity,
            position: Vector3.create(0.2, 1.5, 0.12),
            rotation: Quaternion.fromEulerDegrees(0, 0, 45),
            scale: Vector3.create(0.1, 0.05, 0.1)
        })
        MeshRenderer.setBox(this.startButton)
        MeshCollider.setBox(this.startButton)
        pointerEventsSystem.onPointerDown(
            this.startButton,
            function () {
                ScreenManager.toStart()
            },
            {
                button: InputAction.IA_POINTER,
                hoverText: "To Start"
            }
        )

        this.endButton = engine.addEntity()
        Transform.create(this.endButton, {
            parent: this.entity,
            position: Vector3.create(0.2, 1.5, -0.24),
            rotation: Quaternion.fromEulerDegrees(0, 0, 45),
            scale: Vector3.create(0.1, 0.05, 0.1)
        })
        MeshRenderer.setBox(this.endButton)
        MeshCollider.setBox(this.endButton)
        pointerEventsSystem.onPointerDown(
            this.endButton,
            function () {
                ScreenManager.toEnd()
            },
            {
                button: InputAction.IA_POINTER,
                hoverText: "To End"
            }
        )
    }


}