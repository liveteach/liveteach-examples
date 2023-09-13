import { ReactEcsRenderer } from "@dcl/sdk/react-ecs";
import { SeatManager } from "./seatManager";
import { VCModel } from "./vcModel";
import { Vector3 } from '@dcl/sdk/math'
import * as ui from 'dcl-ui-toolkit'
import { setupUi } from "./ui";

export function main() {

  
 
  new VCModel("models/UniSeatsTesting.glb", // Model path
              Vector3.create(16,0,16), //Position
              Vector3.create(0,0,0), //Rotation
              Vector3.create(1,1,1) //Scale
  )

  new SeatManager() 

  
  setupUi()
}
 