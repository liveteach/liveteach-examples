import { Entity, GltfContainer, InputAction, Material, MeshCollider, MeshRenderer, PointerEventsResult, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { ScreenManager } from "./Screen/screenManager";
import { ScreenDisplay } from "./Screen/screenDisplay";

export class Podium {
    entity: Entity

    previousButton: Entity
    nextButton: Entity
    endButton: Entity
    startButton: Entity
    presentationButton: Entity
    videoButton: Entity
    modelButton: Entity
    powerButton: Entity

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
        // Previous Button
        this.previousButton = engine.addEntity()
        Transform.create(this.previousButton, {
            parent: this.entity,
            position: Vector3.create(0.2, 1.5, 0),
            rotation: Quaternion.fromEulerDegrees(0, 0, 45),
            scale: Vector3.create(0.1, 0.05, 0.1)
        })
        MeshRenderer.setBox(this.previousButton)
        MeshCollider.setBox(this.previousButton)
        Material.setPbrMaterial(this.previousButton, {
            alphaTexture: Material.Texture.Common({
                src: 'images/alpha.png'
              })
          })
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

        // Next Button
        this.nextButton = engine.addEntity()
        Transform.create(this.nextButton, {
            parent: this.entity,
            position: Vector3.create(0.2, 1.5, -0.12),
            rotation: Quaternion.fromEulerDegrees(0, 0, 45),
            scale: Vector3.create(0.1, 0.05, 0.1)
        })
        MeshRenderer.setBox(this.nextButton)
        MeshCollider.setBox(this.nextButton)
        Material.setPbrMaterial(this.nextButton, {
            alphaTexture: Material.Texture.Common({
                src: 'images/alpha.png'
              })
          })
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

        // Start Button
        this.startButton = engine.addEntity()
        Transform.create(this.startButton, {
            parent: this.entity,
            position: Vector3.create(0.2, 1.5, 0.12),
            rotation: Quaternion.fromEulerDegrees(0, 0, 45),
            scale: Vector3.create(0.1, 0.05, 0.1)
        })
        MeshRenderer.setBox(this.startButton)
        MeshCollider.setBox(this.startButton)
        Material.setPbrMaterial(this.startButton, {
            alphaTexture: Material.Texture.Common({
                src: 'images/alpha.png'
              })
          })
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

        // End Button
        this.endButton = engine.addEntity()
        Transform.create(this.endButton, {
            parent: this.entity,
            position: Vector3.create(0.2, 1.5, -0.24),
            rotation: Quaternion.fromEulerDegrees(0, 0, 45),
            scale: Vector3.create(0.1, 0.05, 0.1)
        })
        MeshRenderer.setBox(this.endButton)
        MeshCollider.setBox(this.endButton)
        Material.setPbrMaterial(this.endButton, {
            alphaTexture: Material.Texture.Common({
                src: 'images/alpha.png'
              })
          })
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

        // Presentation Button
        this.presentationButton = engine.addEntity()
        Transform.create(this.presentationButton, {
            parent: this.entity,
            position: Vector3.create(0.43, 1.73, 0.24),
            rotation: Quaternion.fromEulerDegrees(0, 0, 45),
            scale: Vector3.create(0.1, 0.05, 0.1)
        })
        MeshRenderer.setBox(this.presentationButton)
        MeshCollider.setBox(this.presentationButton)
        Material.setPbrMaterial(this.presentationButton, {
            alphaTexture: Material.Texture.Common({
                src: 'images/alpha.png'
              })
          })
        pointerEventsSystem.onPointerDown(
            this.presentationButton,
            function () {
                ScreenManager.showPresentation()
            },
            {
                button: InputAction.IA_POINTER,
                hoverText: "Presentation"
            }
        )

        // Video Button
        this.videoButton = engine.addEntity()
        Transform.create(this.videoButton, {
            parent: this.entity,
            position: Vector3.create(0.375, 1.67, 0.24),
            rotation: Quaternion.fromEulerDegrees(0, 0, 45),
            scale: Vector3.create(0.1, 0.05, 0.1)
        })
        MeshRenderer.setBox(this.videoButton)
        MeshCollider.setBox(this.videoButton)
        Material.setPbrMaterial(this.videoButton, {
            alphaTexture: Material.Texture.Common({
                src: 'images/alpha.png'
              })
          })
        pointerEventsSystem.onPointerDown(
            this.videoButton,
            function () {
                ScreenManager.showVideo()
            },
            {
                button: InputAction.IA_POINTER,
                hoverText: "Movie"
            }
        )

        // Model Button
        this.modelButton = engine.addEntity()
        Transform.create(this.modelButton, {
            parent: this.entity,
            position: Vector3.create(0.3, 1.6, 0.24),
            rotation: Quaternion.fromEulerDegrees(0, 0, 45),
            scale: Vector3.create(0.1, 0.05, 0.1)
        })
        MeshRenderer.setBox(this.modelButton)
        MeshCollider.setBox(this.modelButton)
        Material.setPbrMaterial(this.modelButton, {
            alphaTexture: Material.Texture.Common({
                src: 'images/alpha.png'
              })
          })
        pointerEventsSystem.onPointerDown(
            this.modelButton,
            function () {
                ScreenManager.showModel()
            },
            {
                button: InputAction.IA_POINTER,
                hoverText: "3D"
            }
        )

        // Power
        this.powerButton = engine.addEntity()
        Transform.create(this.powerButton, {
            parent: this.entity,
            position: Vector3.create(0.2, 1.5, 0.24),
            rotation: Quaternion.fromEulerDegrees(0, 0, 45),
            scale: Vector3.create(0.1, 0.05, 0.1)
        })
        MeshRenderer.setBox(this.powerButton)
        MeshCollider.setBox(this.powerButton)
        Material.setPbrMaterial(this.powerButton, {
            alphaTexture: Material.Texture.Common({
                src: 'images/alpha.png'
              })
          })
        pointerEventsSystem.onPointerDown(
            this.powerButton,
            function () {
                ScreenManager.powerToggle()
            },
            {
                button: InputAction.IA_POINTER,
                hoverText: "Power"
            }
        )
    }


}