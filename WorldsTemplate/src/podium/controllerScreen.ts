import { Entity, GltfContainer, InputAction, Material, MeshCollider, MeshRenderer, TextShape, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom"
import { PodiumButton } from "./podiumButton"

export class ControllerScreen {
    entity: Entity
    title: Entity
    className: Entity
    startEndButton: Entity
    startEndButtonText: Entity
    buttonGraphicReference: Entity

    open: boolean = false

    constructor(_buttonGraphic: Entity, _powerOffCallback: Function, _parent: Entity) {
        this.buttonGraphicReference = _buttonGraphic

        this.entity = engine.addEntity()
        Transform.create(this.entity, {
            parent: _parent,
            position: Vector3.create(0.34, 1.7, -0.06),
            rotation: Quaternion.fromEulerDegrees(45, 90, 0),
            scale: Vector3.Zero()
        })
        MeshRenderer.setPlane(this.entity)
        Material.setPbrMaterial(this.entity, {
            albedoColor: Color4.create(0.1, 0.1, 0.1),
            emissiveColor: Color4.create(0.1, 0.1, 0.1),
            emissiveIntensity: 0.5
        })

        this.title = engine.addEntity()
        Transform.create(this.title, {
            parent: this.entity,
            position: Vector3.create(0, 0.32, -0.01),
            scale: Vector3.create(0.1, 0.1, 0.1)
        })
        TextShape.create(this.title, {
            text: "CLASS SELECTION",
            fontSize: 6,
            textColor: Color4.White()
        })

        this.className = engine.addEntity()
        Transform.create(this.className, {
            parent: this.entity,
            position: Vector3.create(0, 0, -0.01),
            scale: Vector3.create(0.1, 0.1, 0.1)
        })
        TextShape.create(this.className, {
            text: "",
            fontSize: 5,
            textColor: Color4.White()
        })

        this.startEndButtonText = engine.addEntity()
        Transform.create(this.startEndButtonText, {
            parent: this.entity,
            position: Vector3.create(0, -0.3, -0.02),
            scale: Vector3.create(0.1, 0.1, 0.1)
        })
        TextShape.create(this.startEndButtonText, {
            text: "Start",
            fontSize: 5,
            textColor: Color4.Black()
        })

        this.startEndButton = engine.addEntity()
        Transform.create(this.startEndButton, {
            parent: this.entity,
            position: Vector3.create(0, -0.3, -0.01),
            scale: Vector3.create(0.3, 0.1, 0.01)
        })
        MeshRenderer.setBox(this.startEndButton)
        MeshCollider.setBox(this.startEndButton)
        Material.setPbrMaterial(this.startEndButton, {
            albedoColor: Color4.Green(),
            emissiveColor: Color4.Green(),
            emissiveIntensity: 0.5
        })

        const self = this
        pointerEventsSystem.onPointerDown(
            {
                entity: this.startEndButton,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: "click"
                }
            },
            function () {
                if (!ClassroomManager.classController) return

                if (ClassroomManager.classController.inSession) {
                    ClassroomManager.classController.endClass()
                    Material.setPbrMaterial(self.startEndButton, {
                        albedoColor: Color4.Green(),
                        emissiveColor: Color4.Green(),
                        emissiveIntensity: 0.5
                    })
                    TextShape.getMutable(self.startEndButtonText).text = "Start"

                    if (ClassroomManager.screenManager?.poweredOn) {
                        _powerOffCallback()
                    }
                }
                else {
                    ClassroomManager.classController.startClass()
                    Material.setPbrMaterial(self.startEndButton, {
                        albedoColor: Color4.Red(),
                        emissiveColor: Color4.Red(),
                        emissiveIntensity: 0.5
                    })
                    TextShape.getMutable(self.startEndButtonText).text = "End"
                }
            }
        )
    }

    toggle(_prevButton: PodiumButton, _nextButton: PodiumButton, _prevNextButtonsGraphic: Entity): void {
        this.open = !this.open
        if (this.open) {
            TextShape.getMutable(this.className).text = ClassroomManager.classController ? ClassroomManager.classController.classList[ClassroomManager.classController.selectedClassIndex].name : ""
            GltfContainer.createOrReplace(_prevNextButtonsGraphic, { src: "models/podium/prevNext_on.glb" })
            GltfContainer.createOrReplace(this.buttonGraphicReference, { src: "models/podium/teacher_selected.glb" })
            Transform.getMutable(this.entity).scale = Vector3.create(0.44, 0.33, 1)
            _prevButton.show()
            _nextButton.show()
        }
        else {
            if (ClassroomManager.screenManager?.poweredOn == false) {
                GltfContainer.createOrReplace(_prevNextButtonsGraphic, { src: "models/podium/prevNext_off.glb" })
                _prevButton.hide()
                _nextButton.hide()
            }
            if (ClassroomManager.classController?.inSession) {
                GltfContainer.createOrReplace(this.buttonGraphicReference, { src: "models/podium/teacher_on.glb" })
            }
            else {
                GltfContainer.createOrReplace(this.buttonGraphicReference, { src: "models/podium/teacher_off.glb" })
            }
            Transform.getMutable(this.entity).scale = Vector3.Zero()
        }
    }

    next(): void {
        if (ClassroomManager.classController) {
            ClassroomManager.classController.selectedClassIndex++
            if (ClassroomManager.classController.selectedClassIndex >= ClassroomManager.classController.classList.length) {
                ClassroomManager.classController.selectedClassIndex = 0
            }
            this.update()
        }
    }

    previous(): void {
        if (ClassroomManager.classController) {
            ClassroomManager.classController.selectedClassIndex--
            if (ClassroomManager.classController.selectedClassIndex < 0) {
                ClassroomManager.classController.selectedClassIndex = ClassroomManager.classController.classList.length - 1
            }
            this.update()
        }
    }

    hide(): void {
        this.open = false
        if (ClassroomManager.classController?.inSession) {
            GltfContainer.createOrReplace(this.buttonGraphicReference, { src: "models/podium/teacher_on.glb" })
        }
        else {
            GltfContainer.createOrReplace(this.buttonGraphicReference, { src: "models/podium/teacher_off.glb" })
        }
        Transform.getMutable(this.entity).scale = Vector3.Zero()
    }

    private update(): void {
        TextShape.getMutable(this.className).text = ClassroomManager.classController.classList[ClassroomManager.classController.selectedClassIndex].name
    }
}