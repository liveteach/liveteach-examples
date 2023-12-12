import { engine } from "@dcl/ecs/dist/runtime/initialization";
import { Entity, InputAction, MeshCollider, MeshRenderer, Transform, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";

export class PlaceableArea {
    constructor(_parent: Entity, _position:Vector3){
        let entity = engine.addEntity()

        Transform.create(entity, {
            parent: _parent,
            position:_position,
            scale: Vector3.create(0.25,0.05,0.25)
        }) 

        let self = this
        pointerEventsSystem.onPointerDown(
            {
                entity: entity,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: "Place"
                }
            },
            function () {
                //self.interact()
            }
        )

        MeshRenderer.setBox(entity)
        MeshCollider.setBox(entity)
    }
}