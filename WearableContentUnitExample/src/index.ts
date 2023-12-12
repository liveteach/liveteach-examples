import { setupUi } from "./ui"
import { PeerToPeerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/peerToPeerChannel";
import { ClassroomManager, ControllerUI } from "@dclu/dclu-liveteach/src/classroom"
import { WearableDrop } from "../contentUnits/wearableDrop/wearableDrop"
import { ContentUnitPlayer } from "./contentUnitPlayer";
import { Vector3 } from "@dcl/sdk/math";
import * as ecs from "@dcl/sdk/ecs"
import * as classroomConfig from "./classroomConfigs/classroomConfig.json"
import * as dclu from '@dclu/dclu-liveteach'

export function main() {
  dclu.setup({ 
    ecs: ecs,
    Logger: null
  })
  setupUi() 

  const communicationChannel = new PeerToPeerChannel()
  ClassroomManager.Initialise(communicationChannel, undefined, undefined, true)

    // Add contract guid here for testing
   // ClassroomManager.SetTestContractGuid("c73c16d2-e2a7-4acc-bdda-fb2205b5d634")

    // Add wallet address here for testing
    ClassroomManager.AddTestTeacherAddress("0x2c6c9f43d87dd27b9daed0f711f73f1ee46fb18d")

  ClassroomManager.RegisterClassroom(classroomConfig)
  
  ControllerUI.Show()
 

  //Register content units
  ClassroomManager.RegisterContentUnit("wearable", new WearableDrop())

 

  new ContentUnitPlayer(Vector3.create(3, 1, 12), "Wearable", 3)

 

  
}

