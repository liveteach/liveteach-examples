import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { Kitchen } from "../kitchen"
import { Entity, Transform, engine } from "@dcl/sdk/ecs"
import { PlaceableArea } from "./placeableArea"
import { CarryItem } from "./carryItem"
import { ItemType } from "./itemType"

export class ItemManager {
    items: CarryItem [] = []
    
    placeableAreas:PlaceableArea[] = []

    static carryItem: CarryItem = null

    static instance:ItemManager
    
    eggsUsed:boolean = false
    sugarUsed:boolean = false
    creamUsed:boolean = false
    jamUsed:boolean = false

    constructor(_parent:Entity){

        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.2,1.13,-0.1)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.6,1.13,-0.1)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-1,1.13,-0.1)))

        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.2,1.13,-0.48)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.6,1.13,-0.48)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-1,1.13,-0.48)))

        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.2 -2.1,1.13,-0.1)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.6 -2.1,1.13,-0.1)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-1 -2.1,1.13,-0.1)))

        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.2 -2.1,1.13,-0.48)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.6 -2.1,1.13,-0.48)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-1 -2.1,1.13,-0.48))) 

        // Oven hobs
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-1.445,1.135,-0.165)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-1.445,1.135,-0.43)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-1.83,1.135,-0.165)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-1.83,1.135,-0.43)))

        // The top 12 placeable areas + 4 oven hobs can all allow the cakestand.
        this.placeableAreas.forEach(area => {
            area.allowCakeStand = true
        });
 
        // Bottom cupboards
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.3,0.185,-0.15)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.93,0.185,-0.15)))

        let offsetX = 2.02
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.35-offsetX,0.185,-0.15)))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-0.95-offsetX,0.185,-0.15)))

        // In the oven

        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-1.65,0.44,-0.2),true))
        this.placeableAreas.push(new PlaceableArea(_parent, Vector3.create(-1.65,0.7,-0.2),true))
 
        ItemManager.instance = this
         
    }

    spawnIngredients(){ 
        let eggs = new CarryItem("models/bakery/items/eggs.glb", "Eggs", ItemType.eggs)
        eggs.setPlaceableArea(this.placeableAreas[0],eggs) 
        this.items.push(eggs)
        let sugar = new CarryItem("models/bakery/items/casterSugar.glb", "Caster Sugar", ItemType.sugar)
        sugar.setPlaceableArea(this.placeableAreas[17],sugar) 
        this.items.push(sugar)
        let chocolate = new CarryItem("models/bakery/items/chocolate.glb", "Chocolate", ItemType.chocolate)
        chocolate.setPlaceableArea(this.placeableAreas[25],chocolate) 
        this.items.push(chocolate)
        let cream = new CarryItem("models/bakery/items/doubleCream.glb", "Double Cream", ItemType.cream)
        cream.setPlaceableArea(this.placeableAreas[3],cream) 
        this.items.push(cream)
        let flour = new CarryItem("models/bakery/items/flour.glb", "Flour", ItemType.flour)
        flour.setPlaceableArea(this.placeableAreas[16],flour) 
        this.items.push(flour)
        let jam = new CarryItem("models/bakery/items/jam.glb", "Jam", ItemType.jam)
        jam.setPlaceableArea(this.placeableAreas[23],jam) 
        this.items.push(jam)
        let butter = new CarryItem("models/bakery/items/butter.glb", "Butter", ItemType.butter)
        butter.setPlaceableArea(this.placeableAreas[1],butter) 
        this.items.push(butter)

        let mixingBowl = new CarryItem("models/bakery/items/mixingBowl.glb", "Mixing Bowl", ItemType.mixingBowl)
        mixingBowl.setPlaceableArea(this.placeableAreas[18],mixingBowl) 
        mixingBowl.setScale(0.75)
        this.items.push(mixingBowl)
        let whisk = new CarryItem("models/bakery/items/whisk.glb", "Whisk", ItemType.whisk)
        whisk.setPlaceableArea(this.placeableAreas[24],whisk) 
        this.items.push(whisk)
        let spatula = new CarryItem("models/bakery/items/spatula.glb", "Spatula", ItemType.spatula)
        spatula.setPlaceableArea(this.placeableAreas[22],spatula) 
        this.items.push(spatula)
        let bakingTin = new CarryItem("models/bakery/items/bakingTin.glb", "Baking Tin", ItemType.bakingTin)
        bakingTin.setPlaceableArea(this.placeableAreas[19],bakingTin)
        bakingTin.setScale(0.75)
        this.items.push(bakingTin)

        let cakeStand = new CarryItem("models/bakery/items/cakeStand.glb", "Cake Stand", ItemType.cakeStand)
        cakeStand.setPlaceableArea(this.placeableAreas[11],cakeStand)
        //cakeStand.setScale(0.75) 
        this.items.push(cakeStand) 

        // Add a placeable area ontop of the cake stand.
        let cakeStandPlaceableArea = new PlaceableArea(cakeStand.entity, Vector3.create(0,0.16,0))
        cakeStandPlaceableArea.cakeStandArea = true
        this.placeableAreas.push(cakeStandPlaceableArea)
    }

    destroy(){
        this.placeableAreas.forEach(area => {
           if(area.carryItem!=null){
            if(area.carryItem.childItem != null){
                engine.removeEntity(area.carryItem.childItem.collider)
                engine.removeEntity(area.carryItem.childItem.entity)
            }
            engine.removeEntity(area.carryItem.collider)
            engine.removeEntity(area.carryItem.entity)
           }
           engine.removeEntity(area.entity)
           engine.removeEntity(area.debugEntity)
        });

        
    }
    
    static addPickupPointers(){
        ItemManager.instance.items.forEach(item => {
            item.addOnPointerPickup()
        });    
    }

    static removePickupPointers(){
        ItemManager.instance.items.forEach(item => {
            item.removeOnPointerPickup()
        });
    }

    static addPlaceableAreaPointers(){
        ItemManager.instance.placeableAreas.forEach(area => {
            area.addPointerPlacement()
        });    
    }

    static removePlaceableAreaPointers(){
        ItemManager.instance.placeableAreas.forEach(area => {
            area.removePointerPlacement()
        });    
    }
    
    static setCarriedItem(_carryItem:CarryItem){
        // Only pick something up if my hands are free
        if(ItemManager.carryItem == null){
            ItemManager.carryItem = _carryItem
            
            Transform.getMutable(_carryItem.entity).parent = engine.PlayerEntity
            // Put in front of my face
            Transform.getMutable(_carryItem.entity).position = Vector3.create(0,0.5,0.5)
            Transform.getMutable(_carryItem.entity).rotation = Quaternion.fromEulerDegrees(0,180,0)
        }
    }  

    static placeCarriedItem(_placeableArea:PlaceableArea){
        // Check that the placeable area doesn't already have an item and I am carrying one
        if(_placeableArea.carryItem == null && ItemManager.carryItem != null){
            _placeableArea.carryItem = ItemManager.carryItem

            if(_placeableArea.carryItem.childItem != null){
                _placeableArea.carryItem.childItem.addCollider() // Give my child a collider again
            }

            ItemManager.carryItem = null
            _placeableArea.carryItem.setPlaceableArea(_placeableArea)
            _placeableArea.carryItem.addCollider()
            Transform.getMutable(_placeableArea.carryItem.entity).position = Vector3.create(0,0,0)
            Transform.getMutable(_placeableArea.entity).rotation = Quaternion.fromEulerDegrees(0,180,0)
            ItemManager.addPickupPointers()
            ItemManager.removePlaceableAreaPointers()
        }
    }
}