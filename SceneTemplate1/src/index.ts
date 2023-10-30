import {
  Animator,
  AudioSource,
  AvatarAttach,
  engine,
  GltfContainer,
  InputAction,
  Material,
  MeshCollider,
  pointerEventsSystem,
  Transform,
  VisibilityComponent
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { initAssetPacks } from '@dcl/asset-packs/dist/scene-entrypoint'

// You can remove this if you don't use any asset packs
initAssetPacks(engine, pointerEventsSystem, {
  Animator,
  AudioSource,
  AvatarAttach,
  Transform,
  VisibilityComponent,
  GltfContainer
})


export function main() {
  let entity = engine.addEntity()
Transform.create(entity, {
    position: Vector3.create(0,0,32),
    rotation: Quaternion.fromEulerDegrees(0,0,0),
    scale: Vector3.create(1,1,1)
})
GltfContainer.create(entity, {src:"models/LiveTeachExampleClassRoom.glb"})
}
