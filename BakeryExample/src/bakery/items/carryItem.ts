import { TransformTypeWithOptionals, Transform, Entity, GltfContainer, InputAction, pointerEventsSystem, engine, PointerEventType } from "@dcl/sdk/ecs";
import { PlaceableArea } from "./placeableArea";
import { ItemManager } from "./itemManager";
import { Vector3 } from "@dcl/sdk/math";
import { ItemType } from "./itemType";

export class CarryItem {
    entity: Entity
    collider: Entity
    placedArea: PlaceableArea = null
    hover: string = ""
    
    constructor(_modelPath:string,_hover:string, _type:ItemType ){
        this.hover = _hover
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
            }
        )
    }

    removeOnPointerPickup(){
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
} 