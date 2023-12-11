// We define the empty imports so the auto-complete feature works as expected.
import { Color4 } from '@dcl/sdk/math'
import { Entity, Material, MeshCollider, MeshRenderer, Transform, engine, executeTask } from '@dcl/sdk/ecs'
import { PeerToPeerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/peerToPeerChannel";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom"
import { GetSceneResponse, getSceneInfo } from '~system/Scene';
import * as ecs from "@dcl/sdk/ecs"
import * as dclu from '@dclu/dclu-liveteach'
import * as classroomConfig1 from "./classroomConfigs/classroomConfig1.json"
import * as classroomConfig2 from "./classroomConfigs/classroomConfig2.json"
import { GetCurrentRealmResponse, getCurrentRealm } from '~system/EnvironmentApi';

const cubes: Entity[] = []
var sceneBaseX: number = 0
var sceneBaseZ: number = 0

export function main() {
  getSceneData()

  dclu.setup({
    ecs: ecs,
    Logger: null
  })

  let devLiveTeachContractAddress: string = "0xf44b11C7c7248c592d0Cc1fACFd8a41e48C52762"
  let devTeachersContractAddress: string = "0x15eD220A421FD58A66188103A3a3411dA9d22295"

  ecs.executeTask(async () => {
    const communicationChannel = new PeerToPeerChannel()

    // Initialise the ClassroomManager asynchronously as it depends on getCurrentRealm
    let getCurrentRealmResponse: GetCurrentRealmResponse = await getCurrentRealm({})
    let useDev = false;
    // detect tigertest realm
    if (getCurrentRealmResponse &&
      getCurrentRealmResponse.currentRealm &&
      getCurrentRealmResponse.currentRealm.serverName) {
      if (getCurrentRealmResponse.currentRealm.serverName.toLocaleLowerCase().indexOf("tigertest") != -1) {
        useDev = true;
      }
    }
    if (useDev) {
      console.log("tigertest server detected")
      ClassroomManager.Initialise(communicationChannel, devLiveTeachContractAddress, devTeachersContractAddress, false)
    }
    else {
      console.log("mainnet server detected")
      // default to mainnet
      ClassroomManager.Initialise(communicationChannel, undefined, undefined, false)
    }

    ClassroomManager.RegisterClassroom(classroomConfig1)
    ClassroomManager.RegisterClassroom(classroomConfig2)
    createCube(8, 1, 8)
    createCube(8, 1, 24)
    engine.addSystem(update)
  })
}

function createCube(x: number, y: number, z: number): void {
  const meshEntity = engine.addEntity()
  Transform.create(meshEntity, { position: { x, y, z } })
  MeshRenderer.setBox(meshEntity)
  MeshCollider.setBox(meshEntity)
  Material.setPbrMaterial(meshEntity, {
    albedoColor: Color4.Red()
  })

  cubes.push(meshEntity)
}

function update(): void {
  const authenticated: boolean = ClassroomManager.classController?.isTeacher()
  const userParcel = getEntityParcel(engine.PlayerEntity)
  console.log(authenticated)

  cubes.forEach(cube => {
    const cubeParcel = getEntityParcel(cube)
    const shouldBeGreen = authenticated && cubeParcel[0] == userParcel[0] && cubeParcel[1] == userParcel[1]
    Material.setPbrMaterial(cube, {
      albedoColor: shouldBeGreen ? Color4.Green() : Color4.Red()
    })
  });
}

function getEntityParcel(_entity: Entity): [number, number] {
  const pos = Transform.get(_entity).position
  let worldPositionX = sceneBaseX + (pos.x / 16)
  let worldPositionZ = sceneBaseZ + (pos.z / 16)
  worldPositionX = Math.floor(worldPositionX)
  worldPositionZ = Math.floor(worldPositionZ)
  return [worldPositionX, worldPositionZ]
}

function getSceneData() {
  executeTask(async () => {
    let sceneInfo: GetSceneResponse = await getSceneInfo({});
    if (!sceneInfo || !sceneInfo.metadata) {
      throw new Error('Cannot get scene info');
    }
    let parsedMetaData: any = JSON.parse(sceneInfo.metadata)
    if (!parsedMetaData || !parsedMetaData.scene || !parsedMetaData.scene.base) {
      throw new Error('Cannot get scene info from parsed metadata');
    }
    let parcel: string = parsedMetaData.scene.base
    let sceneBaseArr = parcel.split(",")
    sceneBaseX = parseInt(sceneBaseArr[0])
    sceneBaseZ = parseInt(sceneBaseArr[1])
  })
}
