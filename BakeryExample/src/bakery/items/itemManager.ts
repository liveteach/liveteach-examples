import { Vector3 } from "@dcl/sdk/math"
import { Eggs } from "./eggs"
import { Kitchen } from "../kitchen"
import { Entity } from "@dcl/sdk/ecs"
import { PlaceableArea } from "./placeableArea"

export class ItemManager {
    eggs:Eggs
    
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

        this.spawnIngredients()

        
    }

    spawnIngredients(){
        this.eggs = new Eggs({
            position:Vector3.create(0,0,0),
            scale: Vector3.create(1,1,1)
        })
        this.eggs.setPlaceableArea(this.placeableAreas[0])
    }
}