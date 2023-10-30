import { Entity, InputAction, Material, MeshCollider, MeshRenderer, Transform, engine, pointerEventsSystem } from "@dcl/ecs";
import { Quaternion, Vector3 } from "@dcl/ecs-math";
import { ScreenManager } from "./Screen/screenManager";

export class PodiumButton {
    entity:Entity
    originalScale:Vector3
    constructor(_parent:Entity,_position:Vector3, _rotation:Quaternion, _scale:Vector3,_hoverText:string, _onClick:Function){
        this.entity = engine.addEntity()
        Transform.create(this.entity, {
            parent: _parent,
            position: _position,
            rotation: _rotation,
            scale: _scale
        })
        this.originalScale = _scale
        MeshRenderer.setBox(this.entity)
        MeshCollider.setBox(this.entity)
        Material.setPbrMaterial(this.entity, {
            alphaTexture: Material.Texture.Common({
                src: 'images/alpha.png'
              })
          })
        pointerEventsSystem.onPointerDown(
            this.entity,
            function () {
                _onClick()
            },
            {
                button: InputAction.IA_POINTER,
                hoverText: _hoverText
            }
        )
    }

    show(){
        Transform.getMutable(this.entity).scale = this.originalScale
    }

    hide(){
        Transform.getMutable(this.entity).scale = Vector3.Zero()
    }
}