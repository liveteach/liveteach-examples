// We define the empty imports so the auto-complete feature works as expected.
import { Color4 } from '@dcl/sdk/math'
import { Entity, Material, MeshCollider, MeshRenderer, Transform, engine, executeTask } from '@dcl/sdk/ecs'
import { PeerToPeerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/peerToPeerChannel";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom"
import { GetSceneResponse, getSceneInfo } from '~system/Scene';
import * as ecs from "@dcl/sdk/ecs"
import * as dclu from '@dclu/dclu-liveteach'
import * as classroomConfig from "./classroomConfigs/classroomConfig.json"

const cubes: Entity[] = []
var sceneBaseX: number = 0
var sceneBaseZ: number = 0

export function main() {
  getSceneData()

  dclu.setup({
    ecs: ecs,
    Logger: null
  })

  const communicationChannel = new PeerToPeerChannel()
  ClassroomManager.Initialise(classroomConfig, communicationChannel)
  createCube(8, 1, 8)
  createCube(8, 1, 24)

  engine.addSystem(update)
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
    if (cubeParcel[0] == userParcel[0] && cubeParcel[1] == userParcel[1]) {
      Material.setPbrMaterial(cube, {
        albedoColor: authenticated ? Color4.Green() : Color4.Red()
      })
    }
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
