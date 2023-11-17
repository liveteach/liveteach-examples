// We define the empty imports so the auto-complete feature works as expected.
import { } from '@dcl/sdk/math'
import { Entity, InputAction, MeshCollider, MeshRenderer, Transform, engine, executeTask, pointerEventsSystem } from '@dcl/sdk/ecs'
import { getUserData } from "~system/UserIdentity"
import { RequestManager, ContractFactory } from "eth-connect"
import { createEthereumProvider } from '@dcl/sdk/ethereum-provider'
import abi from "./TeachContractAbi.json"
import { GetSceneResponse, getSceneInfo } from '~system/Scene'

export function main() {
  createCube("Authenticate -55,0 ", 8, 1, 8);
  createCube("Authenticate -55,1 ", 8, 1, 24);
}

async function getEntityParcel(entity: Entity): Promise<[number, number]> {
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
  let sceneBaseX = parseInt(sceneBaseArr[0])
  let sceneBaseZ = parseInt(sceneBaseArr[1])

  let worldPositionX = sceneBaseX + (Transform.get(entity).position.x / 16)
  let worldPositionZ = sceneBaseZ + (Transform.get(entity).position.z / 16)
  worldPositionX = Math.floor(worldPositionX)
  worldPositionZ = Math.floor(worldPositionZ)
  return [worldPositionX, worldPositionZ]
}

function createCube(text: string, x: number, y: number, z: number): Entity {
  const meshEntity = engine.addEntity()
  Transform.create(meshEntity, { position: { x, y, z } })
  MeshRenderer.setBox(meshEntity)
  MeshCollider.setBox(meshEntity)

  pointerEventsSystem.onPointerDown(
    {
      entity: meshEntity,
      opts: { button: InputAction.IA_POINTER, hoverText: text },
    },
    function () {
      executeTask(async () => {
        let [parcelX, parcelY]: [number, number] = await getEntityParcel(meshEntity)
        // let classroomData:void | ClassPacket[] = await ClassroomManager.ActivateClassroom(parcelX, parcelY);
        // console.log(classroomData)
        let userData = await getUserData({})
        if (userData && userData.data && userData.data.hasConnectedWeb3) {
          console.log("wallet address", userData.data.publicKey)
          // create an instance of the web3 provider to interface with Metamask
          const provider = createEthereumProvider()
          // Create the object that will handle the sending and receiving of RPC messages
          const requestManager = new RequestManager(provider)
          // Create a factory object based on the abi
          const factory = new ContractFactory(requestManager, abi)
          // Use the factory object to instance a `contract` object, referencing a specific contract
          const contract = (await factory.at(
            "0x3185cafec6fc18267ac92f83ffc8f08658519097"
          )) as any

          const res = await contract.getClassroomGuid(
            parcelX, parcelY,
            {
              from: userData.data.publicKey,
            }
          )
          // Log response
          console.log("Classroom Guid", res)

        } else {
          console.log("Player is not connected with Web3")
        }
      })
    }
  )

  return meshEntity
}
