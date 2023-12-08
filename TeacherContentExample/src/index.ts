import { PeerToPeerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/peerToPeerChannel";
import { ClassroomManager, ControllerUI } from "@dclu/dclu-liveteach/src/classroom"
import * as ecs from "@dcl/sdk/ecs"
import * as dclu from '@dclu/dclu-liveteach'
import * as classroomConfig from "./classroomConfigs/classroomConfig.json"
import { setupUi } from './ui';

export function main() {
  dclu.setup({
    ecs: ecs,
    Logger: null
  })

  setupUi()

  const communicationChannel = new PeerToPeerChannel()
  ClassroomManager.Initialise(communicationChannel)
  ClassroomManager.RegisterClassroom(classroomConfig)

  ControllerUI.Show()
}
