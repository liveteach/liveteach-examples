import { ControllerUI } from "@dclu/dclu-liveteach/src/classroom/ui/controllerUI";
import { setupUI } from "./ui";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom/classroomManager";
import * as classroomConfig from "./classroomConfigs/classroomConfig.json"
import { PeerToPeerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/peerToPeerChannel";

setupUI()
const communicationChannel = new PeerToPeerChannel()
ClassroomManager.Initialise(classroomConfig, communicationChannel)
ControllerUI.Show()