import { engine } from "@dcl/ecs/dist/runtime/initialization";
import { Entity, GltfContainer, InputAction, MeshCollider, MeshRenderer, Transform, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { CarryItem } from "./carryItem";
import { Kitchen } from "../kitchen";
import { ItemManager } from "./itemManager";

export class PlaceableArea {
    entity:Entity
    carryItem:CarryItem = null

    debugEntity:Entity

    constructor(_parent: Entity, _position:Vector3){
        this.entity = engine.addEntity()
        this.debugEntity = engine.addEntity()

        Transform.create(this.entity, {
            parent: _parent,
            position:_position,
            
        }) 

        Transform.create(this.debugEntity, {
            parent: this.entity,
            scale: Vector3.Zero()
        })

        GltfContainer.create(this.debugEntity,{src:"models/bakery/areaHelper.glb"})
        
     //   MeshRenderer.setBox(this.debugEntity)
        MeshCollider.setBox(this.debugEntity)
    }

    addPointerPlacement(){
        let self = this
        if(this.carryItem==null){
            pointerEventsSystem.onPointerDown(
                {
                    entity: this.debugEntity,
                    opts: {
                        button: InputAction.IA_POINTER,
                        hoverText: "Place"
                    }
                },
                function () {
                    ItemManager.placeCarriedItem(self)
                }
            )
            Transform.getMutable(this.debugEntity).scale = Vector3.create(0.25,0,0.25)
        }
    }

    removePointerPlacement(){
        pointerEventsSystem.removeOnPointerDown(this.debugEntity)
        Transform.getMutable(this.debugEntity).scale = Vector3.Zero()
    }
}