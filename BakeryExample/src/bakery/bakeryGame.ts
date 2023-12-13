import { IContentUnit } from "@dclu/dclu-liveteach/src/contentUnits";
import { Kitchen } from "./kitchen";
import { Quaternion, Vector3 } from "@dcl/sdk/math";

export class BakeryGame implements IContentUnit{
    constructor() { 
        new Kitchen({
            position:Vector3.create(18,1.2,15),
            rotation: Quaternion.fromEulerDegrees(0,-90,0)
        })
    }

    start(_data: any): void {

    } 

    end(): void {
 
    }

    update(_data: any): void {
     
    }
}