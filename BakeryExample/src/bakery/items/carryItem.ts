import { TransformTypeWithOptionals, Transform, Entity, GltfContainer, InputAction, pointerEventsSystem, engine, PointerEventType } from "@dcl/sdk/ecs";
import { PlaceableArea } from "./placeableArea";
import { ItemManager } from "./itemManager";
import { Vector3 } from "@dcl/sdk/math";
import { ItemType } from "./itemType";
import { Kitchen } from "../kitchen";
import * as utils from '@dcl-sdk/utils'

export class CarryItem {
    entity: Entity
    collider: Entity
    placedArea: PlaceableArea = null
    hover: string = ""
    itemType: ItemType
    
    constructor(_modelPath:string,_hover:string, _itemType:ItemType){
        this.hover = _hover
        this.itemType = _itemType
        this.entity =  engine.addEntity()
        GltfContainer.create(this.entity, {src:_modelPath})
        Transform.create(this.entity,{})
        
        this.collider =  engine.addEntity()
        GltfContainer.create(this.collider, {src:_modelPath.replace(".glb","_Collider.glb")})
        Transform.create(this.collider,{parent:this.entity})

        this.addOnPointerPickup()
    }

    addOnPointerPickup(){
        let self = this
        pointerEventsSystem.onPointerDown(
            { 
                entity: this.collider,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: "Pick up " +this.hover 
                } 
            },  
            function () {
                ItemManager.setCarriedItem(self)
                self.removeCollider()
                if(self.placedArea!=null){
                    self.placedArea.carryItem = null 
                    self.placedArea = null
                }
                ItemManager.removePickupPointers()
                ItemManager.addPlaceableAreaPointers()

                // Crazy logic time
                if(Kitchen.instance.instructions.currentStep==1 && (self.itemType == ItemType.eggs || self.itemType == ItemType.sugar)){
                    // Turn on bowl combing
                    Kitchen.instance.itemManager.items.forEach(item => {
                        if(item.itemType==ItemType.mixingBowl){
                            item.addCombinePointer()
                        }
                    }); 
                }

                if(Kitchen.instance.instructions.currentStep==2 && self.itemType == ItemType.whisk){
                    // Turn on bowl combing
                    Kitchen.instance.itemManager.items.forEach(item => {
                        if(item.itemType==ItemType.mixingBowl){
                            item.addCombinePointer()
                        }
                    }); 
                }

            }
        )
    } 
 
    removeOnPointerPickup(){
        pointerEventsSystem.removeOnPointerDown(this.collider)
    }

    addCombinePointer(){
        let self = this
        pointerEventsSystem.onPointerDown(
            { 
                entity: this.collider,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: "Combine with " + this.hover 
                } 
            },  
            function () {
                // ItemManager.setCarriedItem(self)
                // self.removeCollider()
                // if(self.placedArea!=null){
                //     self.placedArea.carryItem = null
                //     self.placedArea = null
                // }
                // ItemManager.removePickupPointers()
                // ItemManager.addPlaceableAreaPointers()
                
                debugger
                if(self.itemType == ItemType.mixingBowl && Kitchen.instance.instructions.currentStep == 1){
                    if(ItemManager.carryItem.itemType == ItemType.eggs){
                        if(ItemManager.instance.sugarUsed){
                            GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/mixingBowlSugarEggs.glb"})
                            Kitchen.instance.instructions.increaseStep()
                        } else {
                            GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/mixingBowlEggs.glb"})
                        }                         
                        ItemManager.instance.eggsUsed = true
                        self.combined()
                    } else if (ItemManager.carryItem.itemType == ItemType.sugar){
                        if(ItemManager.instance.eggsUsed){
                            GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/mixingBowlSugarEggs.glb"})
                            Kitchen.instance.instructions.increaseStep()
                        } else {
                            GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/mixingBowlSugar.glb"})
                        }                       
                        ItemManager.instance.sugarUsed = true
                        self.combined()
                    } 
                } else if(self.itemType == ItemType.mixingBowl && Kitchen.instance.instructions.currentStep == 2){
                    if(ItemManager.carryItem.itemType == ItemType.whisk){
                        GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/mixingBowlWhisked.glb"})
                    }
                }

                
                
                
            }
        ) 
    }

    combined(){
        // Remove what ever I was carrying
        ItemManager.carryItem.remove()
        ItemManager.carryItem = null
        this.removeCombinePointer()
        ItemManager.removePlaceableAreaPointers()

        // To stop picking up what you are combinging with
        utils.timers.setTimeout(()=>{
            ItemManager.addPickupPointers()
        },250)
    }

    removeCombinePointer(){
        pointerEventsSystem.removeOnPointerDown(this.collider)
    }

    removeCollider(){
        Transform.getMutable(this.collider).scale = Vector3.Zero()
    } 

    addCollider(){
        Transform.getMutable(this.collider).scale = Vector3.One()
    }

    setPlaceableArea(_placeableArea:PlaceableArea, _carryItem:CarryItem = null){
        this.placedArea = _placeableArea

        if(_carryItem!=null){
            this.placedArea.carryItem =_carryItem
        }

        Transform.getMutable(this.entity).parent = _placeableArea.entity 
    }

    setScale(_scale:number){
        Transform.getMutable(this.entity).scale = Vector3.create(_scale,_scale,_scale)
    }

    remove(){
        engine.removeEntity(this.entity)
    }
} 