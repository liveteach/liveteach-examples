import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";


export class VCModel {

    entity:Entity
    constructor(_modelPath:string, _position:Vector3,_rotation:Vector3,_scale:Vector3){

        this.entity = engine.addEntity()

        GltfContainer.create(this.entity, {
          src: _modelPath,
        })

        Transform.create(this.entity, {
          position: _position,
          rotation: Quaternion.fromEulerDegrees(_rotation.x,_rotation.y,_rotation.z),
          scale: _scale
        })

    }
}