import { TransformTypeWithOptionals } from "@dcl/sdk/ecs";
import { CarryItem } from "./carryItem";

export class Eggs extends CarryItem{
    constructor(_transform:TransformTypeWithOptionals){
        super("models/bakery/items/eggs.glb",_transform)
    }
}