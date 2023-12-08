import { ControllerUI } from "@dclu/dclu-liveteach/src/classroom/ui/controllerUI";
import { setupUI } from "./ui";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom/classroomManager";
import { PeerToPeerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/peerToPeerChannel";
import * as classroomConfig from "./classroomConfigs/classroomConfig.json"

setupUI()
const communicationChannel = new PeerToPeerChannel()
ClassroomManager.Initialise(communicationChannel, undefined, undefined, true)
ClassroomManager.RegisterClassroom(classroomConfig)
ControllerUI.Show()