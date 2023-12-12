import { InputAction, Material, MeshCollider, MeshRenderer, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Color4, Vector3 } from "@dcl/sdk/math";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom";

export class ContentUnitPlayer {
    isOn: boolean = false

    constructor(_position: Vector3, _hoverText: string, _index: number) {
        const entity = engine.addEntity()

        Transform.create(entity, {
            position: _position
        })

        MeshRenderer.setSphere(entity)
        MeshCollider.setSphere(entity) 
        Material.setPbrMaterial(entity, { 
            albedoColor: Color4.Black()
        })

        pointerEventsSystem.onPointerDown(
            { 
                entity: entity,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: _hoverText,
                    maxDistance: 20
                } 
            },
            function () {

                if (this.isOn) {
                    ClassroomManager.StartContentUnit(ClassroomManager.activeContent.contentUnits[_index].key, ClassroomManager.activeContent.contentUnits[_index].data)
                    Material.setPbrMaterial(entity, {
                        albedoColor: Color4.Green()
                    })
                }
                else {
                    ClassroomManager.EndContentUnit()
                    Material.setPbrMaterial(entity, {
                        albedoColor: Color4.Black()
                    })
                }

                this.isOn = !this.isOn
            }.bind(this)
        )
    }
}