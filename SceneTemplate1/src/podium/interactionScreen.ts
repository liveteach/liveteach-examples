import { Entity, GltfContainer, InputAction, Material, MeshCollider, MeshRenderer, TextShape, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom"
import { ContentUnitManager } from "@dclu/dclu-liveteach/src/contentUnits"

export class InteractionScreen {
    entity: Entity
    title: Entity
    name: Entity
    startEndButton: Entity
    startEndButtonText: Entity
    buttonGraphicReference: Entity

    open: boolean = false
    interactionIndex: number = 0

    constructor(_buttonGraphic: Entity, _parent: Entity) {
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
            text: "INTERACTIONS",
            fontSize: 6,
            textColor: Color4.White()
        })

        this.name = engine.addEntity()
        Transform.create(this.name, {
            parent: this.entity,
            position: Vector3.create(0, 0, -0.01),
            scale: Vector3.create(0.1, 0.1, 0.1)
        })
        TextShape.create(this.name, {
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
                if (ContentUnitManager.activeUnit) {
                    Material.setPbrMaterial(self.startEndButton, {
                        albedoColor: Color4.Green(),
                        emissiveColor: Color4.Green(),
                        emissiveIntensity: 0.5
                    })
                    TextShape.getMutable(self.startEndButtonText).text = "Start"

                    ClassroomManager.EndContentUnit()
                }
                else {
                    Material.setPbrMaterial(self.startEndButton, {
                        albedoColor: Color4.Red(),
                        emissiveColor: Color4.Red(),
                        emissiveIntensity: 0.5
                    })
                    TextShape.getMutable(self.startEndButtonText).text = "End"

                    ClassroomManager.StartContentUnit(ClassroomManager.activeContent.contentUnits[self.interactionIndex].key, ClassroomManager.activeContent.contentUnits[self.interactionIndex].data)
                }
            }
        )

        engine.addSystem(() => {
            if (!ContentUnitManager.activeUnit) {
                Material.setPbrMaterial(self.startEndButton, {
                    albedoColor: Color4.Green(),
                    emissiveColor: Color4.Green(),
                    emissiveIntensity: 0.5
                })
                TextShape.getMutable(self.startEndButtonText).text = "Start"
            }
        })
    }

    toggle(): void {
        this.open = !this.open
        if (this.open) {
            this.update()
            GltfContainer.createOrReplace(this.buttonGraphicReference, { src: "models/podium/interactiveContent_selected.glb" })
            Transform.getMutable(this.entity).scale = Vector3.create(0.44, 0.33, 1)
        }
        else {
            GltfContainer.createOrReplace(this.buttonGraphicReference, { src: "models/podium/interactiveContent_on.glb" })
            Transform.getMutable(this.entity).scale = Vector3.Zero()
        }
    }

    next(): void {
        this.interactionIndex++
        if (this.interactionIndex >= ClassroomManager.activeContent.contentUnits.length) {
            this.interactionIndex = 0
        }
        this.update()
    }

    previous(): void {
        this.interactionIndex--
        if (this.interactionIndex < 0) {
            this.interactionIndex = ClassroomManager.activeContent.contentUnits.length - 1
        }
        this.update()
    }

    hide(): void {
        this.open = false
        if (ClassroomManager.screenManager?.poweredOn) {
            GltfContainer.createOrReplace(this.buttonGraphicReference, { src: "models/podium/interactiveContent_on.glb" })
        }
        else {
            GltfContainer.createOrReplace(this.buttonGraphicReference, { src: "models/podium/interactiveContent_off.glb" })
        }
        Transform.getMutable(this.entity).scale = Vector3.Zero()
    }

    private update(): void {
        TextShape.getMutable(this.name).text = ClassroomManager.activeContent.contentUnits[this.interactionIndex].name ?? ""
    }
}