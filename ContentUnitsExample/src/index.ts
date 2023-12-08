import { setupUi } from "./ui"
import { PeerToPeerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/peerToPeerChannel";
import { ClassroomManager, ControllerUI } from "@dclu/dclu-liveteach/src/classroom"
import { Poll } from "../contentUnits/poll/poll"
import { Quiz } from "../contentUnits/quiz/quiz"
import { InteractiveModel } from "../contentUnits/InteractiveModel/interactiveModel"
import * as ecs from "@dcl/sdk/ecs"
import * as classroomConfig from "./classroomConfigs/classroomConfig.json"
import * as dclu from '@dclu/dclu-liveteach'
import { ContentUnitPlayer } from "./contentUnitPlayer";
import { Vector3 } from "@dcl/sdk/math";

export function main() {
  dclu.setup({
    ecs: ecs,
    Logger: null
  })
  setupUi()

  const communicationChannel = new PeerToPeerChannel()
  ClassroomManager.Initialise(communicationChannel, undefined, undefined, true)
  ClassroomManager.RegisterClassroom(classroomConfig)

  ControllerUI.Show()

  //Register content units
  ClassroomManager.RegisterContentUnit("poll", new Poll())
  ClassroomManager.RegisterContentUnit("quiz", new Quiz())
  ClassroomManager.RegisterContentUnit("interactive_model", new InteractiveModel())

  new ContentUnitPlayer(Vector3.create(3, 1, 12), "poll", 0)
  new ContentUnitPlayer(Vector3.create(3, 1, 8), "quiz", 1)
  new ContentUnitPlayer(Vector3.create(3, 1, 4), "interactive model", 2)
}