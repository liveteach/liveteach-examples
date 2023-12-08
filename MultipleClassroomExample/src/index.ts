// We define the empty imports so the auto-complete feature works as expected.
import { Vector3 } from '@dcl/sdk/math'
import { Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { PeerToPeerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/peerToPeerChannel";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom"
import * as ecs from "@dcl/sdk/ecs"
import * as dclu from '@dclu/dclu-liveteach'
import * as config1 from "./classroomConfigs/classroomConfig1.json"
import * as config2 from "./classroomConfigs/classroomConfig2.json"
import * as config3 from "./classroomConfigs/classroomConfig3.json"

export function main() {

  dclu.setup({
    ecs: ecs,
    Logger: null
  })

  const communicationChannel = new PeerToPeerChannel()
  ClassroomManager.Initialise(communicationChannel, undefined, undefined, true)

  ClassroomManager.RegisterClassroom(config1)
  ClassroomManager.RegisterClassroom(config2)
  ClassroomManager.RegisterClassroom(config3)

  engine.addSystem(update)

  const house = engine.addEntity()
  Transform.create(house, {
    position: Vector3.create(8, 0, 16),
    scale: Vector3.create(1.5, 2, 2.5)
  })
  GltfContainer.create(house, {
    src: "models/house.glb"
  })
}

function update(): void {
  const config = ClassroomManager.GetClassroomConfig()
  if(config) {
    console.log(config.classroom.guid)
  }
}
