import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";

export class DisplayPanel {

    entity:Entity
    constructor(_position: Vector3, _rotation: Vector3, _scale: Vector3){
        this.entity = engine.addEntity()

        Transform.create(this.entity, {
            position:_position,
            rotation:Quaternion.fromEulerDegrees(_rotation.x,_rotation.y,_rotation.z),
            scale: _scale
        })

        GltfContainer.create(this.entity,{src:"models/DisplayScreen.glb"})
    }
}