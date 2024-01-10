import { engine } from "@dcl/ecs/dist/runtime/initialization";
import { Entity, GltfContainer, InputAction, MeshCollider, MeshRenderer, Transform, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { CarryItem } from "./carryItem";
import { Kitchen } from "../kitchen";
import { ItemManager } from "./itemManager";
import { ItemType } from "./itemType";
import { AudioManager } from "../audioManager";

export class PlaceableArea {
    entity:Entity
    carryItem:CarryItem = null

    debugEntity:Entity
    ovenArea:boolean = false
    cakeStandArea:boolean = false
    allowCakeStand:boolean = false

    constructor(_parent: Entity, _position:Vector3, _ovenArea:boolean = false){
        this.entity = engine.addEntity()
        this.debugEntity = engine.addEntity()

        this.ovenArea = _ovenArea

        Transform.create(this.entity, {
            parent: _parent,
            position:_position,
        }) 

        Transform.create(this.debugEntity, {
            parent: this.entity,
            scale: Vector3.Zero()
        })

        GltfContainer.create(this.debugEntity,{src:"contentUnits/Bakery/models/areaHelper.glb"})
        
     //   MeshRenderer.setBox(this.debugEntity)
        MeshCollider.setBox(this.debugEntity)
    }

    addPointerPlacement(){
        let self = this
        if(this.carryItem==null){
            if(this.cakeStandArea && ItemManager.carryItem.itemType == ItemType.cakeStand){
                return // So you can't put the cake stand on top of itself
            }

            if(ItemManager.carryItem.itemType == ItemType.cakeStand && !this.allowCakeStand){
                return // Don't allow the cake stand to go on anything other than the top of the counter
            }
            pointerEventsSystem.onPointerDown(
                {
                    entity: this.debugEntity,
                    opts: {
                        button: InputAction.IA_POINTER,
                        hoverText: "Place"
                    }
                },
                function () {
                    if(self.cakeStandArea){
                        // Get cake stand
                        ItemManager.instance.items.forEach(item => {
                            if(item.itemType == ItemType.cakeStand){
                                item.childItem = ItemManager.carryItem
                                if(Kitchen.instance.instructions.currentStep == 10 && ItemManager.carryItem.itemType == ItemType.cake){
                                    Kitchen.instance.instructions.increaseStep()
                                    AudioManager.playSuccess()
                                }
                            }
                        }); 
                    }
                    ItemManager.placeCarriedItem(self)
                }
            )
            Transform.getMutable(this.debugEntity).scale = Vector3.create(0.22,0,0.22)
        }
    }

    removePointerPlacement(){
        pointerEventsSystem.removeOnPointerDown(this.debugEntity)
        Transform.getMutable(this.debugEntity).scale = Vector3.Zero()
    }
}