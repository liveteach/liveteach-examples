import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { Toaster } from "@dclu/dclu-liveteach/src/notifications"
import { Podium } from "./podium"
import { AudioManager } from "./audioManager"
import { setupUi } from "./ui"
import { PeerToPeerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/peerToPeerChannel";
import { ClassroomManager, ControllerUI } from "@dclu/dclu-liveteach/src/classroom"
import { DisplayPanel } from "./displayPanel"
import * as classroomConfig from "./classroomConfigs/classroomConfig.json"
import * as dclu from '@dclu/dclu-liveteach'
import { SeatingData } from "./UniversitySeatingData"
import * as ecs from "@dcl/sdk/ecs"

export function main() {
  dclu.setup({
    ecs: ecs,
    Logger: null
  })
  setupUi()
  

  let entity = engine.addEntity()
  Transform.create(entity, {
    position: Vector3.create(0, 0.02, 32),
    rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(entity, { src: "models/LiveTeachExampleClassRoom.glb" })

  //new Toaster()
  new AudioManager()
  const podium = new Podium()

  const screen1 = new DisplayPanel(Vector3.create(23, 1.85, 21), Vector3.create(0, -135, 0), Vector3.create(0.5, 0.5, 0.5))
  const screen2 = new DisplayPanel(Vector3.create(24.5, 1.85, 16), Vector3.create(0, -90, 0), Vector3.create(1, 1, 1)) 
  const screen3 = new DisplayPanel(Vector3.create(23.5, 1.85, 10.5), Vector3.create(0, -45, 0), Vector3.create(1, 1, 1))

  const communicationChannel = new PeerToPeerChannel()
  ClassroomManager.Initialise(classroomConfig, communicationChannel)

  ControllerUI.Show()

  addScreen(Vector3.create(0.35, 1.7, -0.06), Quaternion.fromEulerDegrees(45, 90, 0), Vector3.create(0.2, 0.2, 0.2), podium.entity)
  addScreen(Vector3.create(0, 2.6, 0.1), Quaternion.fromEulerDegrees(0, -180, 0), Vector3.create(1.42 * 2, 1.42 * 2, 1.42 * 2), screen1.entity)
  addScreen(Vector3.create(0, 2.6, 0.1), Quaternion.fromEulerDegrees(0, -180, 0), Vector3.create(2.84, 2.84, 2.84), screen2.entity)
  addScreen(Vector3.create(0, 2.6, 0.1), Quaternion.fromEulerDegrees(0, -180, 0), Vector3.create(2.84, 2.84, 2.84), screen3.entity)

  // Add seating 
  let seatingData :SeatingData = new SeatingData()
  // Apply offset
  let offset = Vector3.create(0, 0, 32)
  seatingData.seats.forEach(seat => { 
    seat.position = Vector3.add(seat.position, offset)
    seat.lookAtTarget = Vector3.create(29.77,0.90,15.94)
  });

  //Debugging  
  // seatingData.seats.forEach(seat => {
  //   let entity: Entity = engine.addEntity()
  //   Transform.create(entity, {position:seat.position, rotation: Quaternion.fromEulerDegrees(seat.rotation.x,seat.rotation.y,seat.rotation.z)})
  //   MeshRenderer.setBox(entity)
  // });
 
  
  //new dclu.seating.SeatingController(seatingData,Vector3.create(12,3,19),Vector3.create(10,7,12),true) // removing hide volume until exclude ID's are fully working in DCL
  new dclu.seating.SeatingController(seatingData,Vector3.create(12,-50,19),Vector3.create(10,7,12),true) // Put the volume underground for now
}

export function addScreen(_position: Vector3, _rotation: Quaternion, _scale: Vector3, _parent: Entity): void {
  ClassroomManager.AddScreen(_position, _rotation, _scale, _parent)
}
