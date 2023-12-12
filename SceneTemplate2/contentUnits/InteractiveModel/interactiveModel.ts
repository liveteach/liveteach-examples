import { Billboard, BillboardMode, Entity, GltfContainer, InputAction, MeshCollider, TextShape, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom";
import { IContentUnit } from "@dclu/dclu-liveteach/src/contentUnits";

export class InteractiveModel implements IContentUnit {
    parent: Entity = engine.addEntity()
    parts: Entity[] = []
    triggers: Entity[] = []
    texts: Entity[] = []

    constructor() { }

    start(_data: any): void {
        console.log(Transform.get(ClassroomManager.originEntity).position)
        this.reset()

        GltfContainer.createOrReplace(this.parent, {
            src: _data.parent.src
        })
        Transform.createOrReplace(this.parent, {
            parent: ClassroomManager.originEntity,
            position: Vector3.create(_data.parent.position.x, _data.parent.position.y, _data.parent.position.z),
            rotation: Quaternion.fromEulerDegrees(_data.parent.rotation.x, _data.parent.rotation.y, _data.parent.rotation.z),
            scale: Vector3.create(_data.parent.scale.x, _data.parent.scale.y, _data.parent.scale.z)
        })

        _data.parts.forEach(partData => {
            //part
            const part = engine.addEntity()
            GltfContainer.create(part, {
                src: partData.src
            })
            Transform.create(part, {
                parent: this.parent
            })

            //text
            const text = engine.addEntity()
            Transform.create(text, {
                parent: this.parent,
                position: Vector3.create(partData.trigger.position.x, partData.trigger.position.y + 1, partData.trigger.position.z),
                scale: Vector3.Zero()
            })
            TextShape.create(text, {
                text: partData.title + "\n\n" + partData.text,
                fontSize: 3
            })
            Billboard.create(text, {
                billboardMode: BillboardMode.BM_Y
            })

            //trigger
            const trigger = engine.addEntity()
            Transform.create(trigger, {
                parent: this.parent,
                position: Vector3.create(partData.trigger.position.x, partData.trigger.position.y, partData.trigger.position.z),
                scale: Vector3.create(partData.trigger.radius, partData.trigger.radius, partData.trigger.radius)
            })
            //MeshRenderer.setSphere(trigger)
            MeshCollider.setSphere(trigger)
            pointerEventsSystem.onPointerDown(
                {
                    entity: trigger,
                    opts: {
                        button: InputAction.IA_POINTER,
                        hoverText: partData.caption
                    }
                },
                function () {
                    if (GltfContainer.get(part).src == partData.src) {
                        GltfContainer.createOrReplace(part, {
                            src: partData.srcSelected
                        })
                        Transform.getMutable(text).scale = Vector3.create(0.4, 0.4, 0.4)
                    }
                    else {
                        GltfContainer.createOrReplace(part, {
                            src: partData.src
                        })
                        Transform.getMutable(text).scale = Vector3.Zero()
                    }
                }
            )

            this.parts.push(part)
            this.texts.push(text)
            this.triggers.push(trigger)
        });
    }
    end(): void {
        this.reset()
    }
    update(_data: any): void {

    }

    private reset(): void {
        this.parts.forEach(part => {
            engine.removeEntity(part)
        });
        this.parts.splice(0)

        this.triggers.forEach(trigger => {
            engine.removeEntity(trigger)
        });
        this.triggers.splice(0)

        this.texts.forEach(text => {
            engine.removeEntity(text)
        });
        this.texts.splice(0)

        let parentTransform = Transform.getMutableOrNull(this.parent)
        if (parentTransform) {
            parentTransform.scale = Vector3.Zero()
        }
    }
}