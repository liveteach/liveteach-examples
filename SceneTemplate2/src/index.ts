import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { Podium } from "./podium"
import { AudioManager } from "./audioManager"
import { setupUi } from "./ui"
import { DefaultServerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/DefaultServerChannel";
import { ClassroomManager, ControllerUI } from "@dclu/dclu-liveteach/src/classroom"
import { DisplayPanel } from "./displayPanel"
import * as classroomConfig from "./classroomConfigs/classroomConfig.json"
import * as dclu from '@dclu/dclu-liveteach'
import { SeatingData } from "./UniversitySeatingData"
import * as ecs from "@dcl/sdk/ecs"
import { Door } from "./door"
import { Poll } from "../contentUnits/poll/poll"
import { ServerParams } from "@dclu/dclu-liveteach/src/classroom/types/classroomTypes"
import { GetUserDataResponse, getUserData } from "~system/UserIdentity"

export function main() {

  let userData: GetUserDataResponse | null = null; // Initialize as null

  // Define the Url for the Webscoket Server
  let serverUrl = "ws://localhost:3000"
  
  
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

  ecs.executeTask(async () => {

    try {

      userData = await getUserData({});
        
      //Is the user the Teacher
      let userType = userData?.data?.publicKey === classroomConfig.classroom.teacherID.toLocaleLowerCase() ? "teacher" : "student";
      //setup Server Parameters for the Websocket Server
      let params: ServerParams = {
        serverUrl: serverUrl,
        role: userType,
        _userData: userData.data
      }

      //Define the Channel to be used
      const communicationChannel = new DefaultServerChannel();
      //Pass in the Server Parameters
      communicationChannel.serverConfig(params)
      // Initialise the Classroom Manager
      ClassroomManager.Initialise(classroomConfig, communicationChannel, true)   
      //show Control ui for teacher         


  ControllerUI.Show()

  addScreen(Vector3.create(0.35, 1.7, -0.06), Quaternion.fromEulerDegrees(45, 90, 0), Vector3.create(0.2, 0.2, 0.2), podium.entity)
  addScreen(Vector3.create(0, 2.6, 0.1), Quaternion.fromEulerDegrees(0, -180, 0), Vector3.create(1.42 * 2, 1.42 * 2, 1.42 * 2), screen1.entity)
  addScreen(Vector3.create(0, 2.6, 0.1), Quaternion.fromEulerDegrees(0, -180, 0), Vector3.create(2.84, 2.84, 2.84), screen2.entity)
  addScreen(Vector3.create(0, 2.6, 0.1), Quaternion.fromEulerDegrees(0, -180, 0), Vector3.create(2.84, 2.84, 2.84), screen3.entity)

  // Add seating 
  let seatingData: SeatingData = new SeatingData()
  // Apply offset
  let offset = Vector3.create(0, 0, 32)
  seatingData.seats.forEach(seat => {
    seat.position = Vector3.add(seat.position, offset)
    seat.lookAtTarget = Vector3.create(29.77, 0.90, 15.94)
  });

  //Debugging  
  // seatingData.seats.forEach(seat => {
  //   let entity: Entity = engine.addEntity()
  //   Transform.create(entity, {position:seat.position, rotation: Quaternion.fromEulerDegrees(seat.rotation.x,seat.rotation.y,seat.rotation.z)})
  //   MeshRenderer.setBox(entity)
  // });


  //new dclu.seating.SeatingController(seatingData,Vector3.create(12,3,19),Vector3.create(10,7,12),true) // removing hide volume until exclude ID's are fully working in DCL
  new dclu.seating.SeatingController(seatingData, Vector3.create(12, -50, 19), Vector3.create(10, 7, 12), true) // Put the volume underground for now

  const doorParent = engine.addEntity()
  Transform.create(doorParent, {
    position: Vector3.create(0, 0, 32)
  })

  addDoor(doorParent, "models/doors.glb", [{ type: "sphere" as const, position: Vector3.create(-6, 0, 21), radius: 4 }])

  //Register content units
  ClassroomManager.RegisterContentUnit("poll", new Poll())
} catch (error) {
  console.error("Error fetching user data:", error);
}
});


}
export function addScreen(_position: Vector3, _rotation: Quaternion, _scale: Vector3, _parent: Entity): void {
  ClassroomManager.AddScreen(_position, _rotation, _scale, _parent)
}

export function addDoor(_parent: Entity, _model: string, _triggerShape: {
  type: "sphere",
  position: Vector3.MutableVector3;
  radius: number;
}[]) {
  const door = new Door(_parent, _model, _triggerShape)
  return door
}
