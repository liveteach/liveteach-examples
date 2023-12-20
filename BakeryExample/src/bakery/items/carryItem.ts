import { TransformTypeWithOptionals, Transform, Entity, GltfContainer, InputAction, pointerEventsSystem, engine, PointerEventType } from "@dcl/sdk/ecs";
import { PlaceableArea } from "./placeableArea";
import { ItemManager } from "./itemManager";
import { Vector3 } from "@dcl/sdk/math";
import { ItemType } from "./itemType";
import { Kitchen } from "../kitchen";
import * as utils from '@dcl-sdk/utils'
import { AudioManager } from "../../audio/audioManager";

export class CarryItem {
    entity: Entity
    collider: Entity
    placedArea: PlaceableArea = null
    hover: string = ""
    itemType: ItemType
    childItem: CarryItem // So the cake stand can remove its carried items collider when needed
    
    constructor(_modelPath:string,_hover:string, _itemType:ItemType){
        this.hover = _hover
        this.itemType = _itemType
        this.entity =  engine.addEntity()
        GltfContainer.create(this.entity, {src:_modelPath})
        Transform.create(this.entity,{})
        
        this.collider =  engine.addEntity()
        GltfContainer.create(this.collider, {src:_modelPath.replace(".gltf","_Collider.glb")})
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

                if(self.childItem != null){
                    self.childItem.removeCollider() // Take off my childs collider too
                }

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

                if(Kitchen.instance.instructions.currentStep==3 && self.itemType == ItemType.flour){
                    // Turn on bowl combing
                    Kitchen.instance.itemManager.items.forEach(item => {
                        if(item.itemType==ItemType.mixingBowl){
                            item.addCombinePointer()
                        }
                    }); 
                }

                if(Kitchen.instance.instructions.currentStep==4 && self.itemType == ItemType.spatula){
                    // Turn on bowl combing
                    Kitchen.instance.itemManager.items.forEach(item => {
                        if(item.itemType==ItemType.mixingBowl){
                            item.addCombinePointer()
                        }
                    }); 
                }

                if(Kitchen.instance.instructions.currentStep==5 && self.itemType == ItemType.butter){
                    // Turn on bowl combing
                    Kitchen.instance.itemManager.items.forEach(item => {
                        if(item.itemType==ItemType.mixingBowl){
                            item.addCombinePointer()
                        }
                    }); 
                }

                if(Kitchen.instance.instructions.currentStep==6 && self.itemType == ItemType.spatula){
                    // Turn on bowl combing
                    Kitchen.instance.itemManager.items.forEach(item => {
                        if(item.itemType==ItemType.mixingBowl){
                            item.addCombinePointer()
                        }
                    }); 
                }

                if(Kitchen.instance.instructions.currentStep==7 && self.itemType == ItemType.mixingBowl){
                    // Turn on bowl combing
                    Kitchen.instance.itemManager.items.forEach(item => {
                        if(item.itemType==ItemType.bakingTin){
                            item.addCombinePointer()
                        }
                    }); 
                }

                if(Kitchen.instance.instructions.currentStep == 11 && (self.itemType == ItemType.chocolate || self.itemType == ItemType.jam || self.itemType == ItemType.cream)){
                    Kitchen.instance.itemManager.items.forEach(item => {
                        if(item.itemType==ItemType.cake){
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
                if(self.itemType == ItemType.mixingBowl && Kitchen.instance.instructions.currentStep == 1){
                    if(ItemManager.carryItem.itemType == ItemType.eggs){
                        if(ItemManager.instance.sugarUsed){
                            GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/mixingBowlSugarEggs.gltf"})
                            Kitchen.instance.instructions.increaseStep()
                        } else {
                            GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/mixingBowlEggs.gltf"})
                        }                         
                        ItemManager.instance.eggsUsed = true
                        self.combined()
                    } else if (ItemManager.carryItem.itemType == ItemType.sugar){
                        if(ItemManager.instance.eggsUsed){
                            GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/mixingBowlSugarEggs.gltf"})
                            Kitchen.instance.instructions.increaseStep()
                        } else {
                            GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/mixingBowlSugar.gltf"})
                        }                       
                        ItemManager.instance.sugarUsed = true
                        self.combined()
                    }  
                } else if(self.itemType == ItemType.mixingBowl && Kitchen.instance.instructions.currentStep == 2){
                    if(ItemManager.carryItem.itemType == ItemType.whisk){
                        GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/mixingBowlWhisked.gltf"})
                        AudioManager.playSuccess()
                        Kitchen.instance.instructions.increaseStep()
                        self.combined()
                    }
                } else if(self.itemType == ItemType.mixingBowl && Kitchen.instance.instructions.currentStep == 3){
                    if(ItemManager.carryItem.itemType == ItemType.flour){
                        GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/mixingBowlFloured.gltf"})
                        AudioManager.playSuccess()
                        Kitchen.instance.instructions.increaseStep()
                        self.combined()
                    }
                } else if(self.itemType == ItemType.mixingBowl && Kitchen.instance.instructions.currentStep == 4){
                    if(ItemManager.carryItem.itemType == ItemType.spatula){
                        GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/mixingBowlFolded.gltf"})
                        AudioManager.playSuccess()
                        Kitchen.instance.instructions.increaseStep()
                        self.combined(false)
                    }
                } else if(self.itemType == ItemType.mixingBowl && Kitchen.instance.instructions.currentStep == 5){
                    if(ItemManager.carryItem.itemType == ItemType.butter){
                        GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/mixingBowlButtered.gltf"})
                        AudioManager.playSuccess()
                        Kitchen.instance.instructions.increaseStep()
                        self.combined()
                    }
                } else if(self.itemType == ItemType.mixingBowl && Kitchen.instance.instructions.currentStep == 6){
                    if(ItemManager.carryItem.itemType == ItemType.spatula){
                        GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/mixingBowlDough.gltf"})
                        AudioManager.playSuccess()
                        Kitchen.instance.instructions.increaseStep()
                        self.combined()
                    }
                } else if(self.itemType == ItemType.bakingTin && Kitchen.instance.instructions.currentStep == 7){
                    if(ItemManager.carryItem.itemType == ItemType.mixingBowl){
                        GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/bakingTinDough.gltf"})
                        AudioManager.playSuccess()
                        Kitchen.instance.instructions.increaseStep()
                        self.combined()
                    }
                } else if(Kitchen.instance.instructions.currentStep == 11 && self.itemType == ItemType.cake){
                    if(ItemManager.carryItem.itemType == ItemType.chocolate){
                        GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/chocolateCake.gltf"})
                        Kitchen.instance.instructions.increaseStep()
                    } else if(ItemManager.carryItem.itemType == ItemType.cream){
                        ItemManager.instance.creamUsed = true
                        if(ItemManager.instance.jamUsed){
                            GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/jamCreamCake.gltf"})
                            Kitchen.instance.instructions.increaseStep()
                        } else { 
                            GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/creamCake.gltf"})
                        }

                    } else if(ItemManager.carryItem.itemType == ItemType.jam){
                        ItemManager.instance.jamUsed = true
                        if(ItemManager.instance.creamUsed){
                            GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/jamCreamCake.gltf"})
                            Kitchen.instance.instructions.increaseStep()
                        } else {
                            GltfContainer.createOrReplace(self.entity, {src:"models/bakery/items/jamCake.gltf"})
                        }
                    }
                    AudioManager.playSuccess()
                    self.combined()
                }
                
                 
                
            }
        ) 
    }

    combined(_remove:boolean = true){
        AudioManager.playSuccess()
        // Remove what ever I was carrying
        if(_remove){
            ItemManager.carryItem.remove()
            ItemManager.carryItem = null
            ItemManager.removePlaceableAreaPointers()
            utils.timers.setTimeout(()=>{
                ItemManager.addPickupPointers()
            },250)
        }
        this.removeCombinePointer()

        
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