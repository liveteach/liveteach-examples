import { Entity } from "@dcl/sdk/ecs";
import { PlaceableArea } from "./placeableArea";
import { Vector3 } from "@dcl/sdk/math";

export class InteractionManager {
    placeableAreas:PlaceableArea[] = []
    
    constructor(_parent:Entity){

        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.2,1.16,-0.1)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.6,1.16,-0.1)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-1,1.16,-0.1)))

        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.2,1.16,-0.48)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.6,1.16,-0.48)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-1,1.16,-0.48)))

        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.2 -2.1,1.16,-0.1)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.6 -2.1,1.16,-0.1)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-1 -2.1,1.16,-0.1)))

        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.2 -2.1,1.16,-0.48)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.6 -2.1,1.16,-0.48)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-1 -2.1,1.16,-0.48)))
    }
}