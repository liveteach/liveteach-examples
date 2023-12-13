import { TransformTypeWithOptionals, Transform, Entity, GltfContainer } from "@dcl/sdk/ecs";
import { PlaceableArea } from "./placeableArea";

export class CarryItem {
    entity: Entity
    
    constructor(_modelPath:string, _Transform:TransformTypeWithOptionals){
        GltfContainer.create(this.entity, {src:_modelPath})
        Transform.create(this.entity,_Transform)
    }

    setPlaceableArea(_placeableArea:PlaceableArea){
        Transform.getMutable(this.entity).parent = _placeableArea.entity
    }
} 