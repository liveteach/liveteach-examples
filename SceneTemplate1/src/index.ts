import { GltfContainer, Transform, engine } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { Toaster } from "@dclu/dclu-liveteach/src/notifications"
import { Podium } from "./podium"
import { AudioManager } from "./audioManager"
import { setupUi } from "./ui"
import { PeerToPeerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/peerToPeerChannel";
import { ClassroomManager, ControllerUI } from "@dclu/dclu-liveteach/src/classroom"
import { DisplayPanel } from "./displayPanel"
import * as classroomConfig from "./classroomConfigs/classroomConfig.json"

export function main() {
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
  new Podium()

  new DisplayPanel(Vector3.create(3, 0, 8.1), Vector3.create(0, 180, 0), Vector3.create(0.5, 0.5, 0.5))
  new DisplayPanel(Vector3.create(8, 0, 8.1), Vector3.create(0, 180, 0), Vector3.create(1, 1, 1))
  new DisplayPanel(Vector3.create(13.1, 0, 8.1), Vector3.create(0, 225, 0), Vector3.create(1, 1, 1))

  const communicationChannel = new PeerToPeerChannel()
  ClassroomManager.Initialise(classroomConfig, communicationChannel)

  ControllerUI.Show()

  addScreens()
}

export function addScreens(): void {
  // Podium screen
  ClassroomManager.AddScreen(Vector3.create(8.06, 1.7, 3.35), Quaternion.fromEulerDegrees(45, 0, 0), Vector3.create(0.2, 0.2, 0.2))

  // Main screens
  ClassroomManager.AddScreen(Vector3.create(3, 1.3, 8.05), Quaternion.fromEulerDegrees(0, 0, 0), Vector3.create(1.42, 1.42, 1.42))
  ClassroomManager.AddScreen(Vector3.create(8, 2.6, 8), Quaternion.fromEulerDegrees(0, 0, 0), Vector3.create(2.84, 2.84, 2.84))
  ClassroomManager.AddScreen(Vector3.create(13, 2.6, 8), Quaternion.fromEulerDegrees(0, 45, 0), Vector3.create(2.84, 2.84, 2.84))
}
