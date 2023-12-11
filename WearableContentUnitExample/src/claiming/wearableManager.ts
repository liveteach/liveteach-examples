import { Entity, GltfContainer, InputAction, MeshCollider, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs"
import * as ui from 'dcl-ui-toolkit'
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { Claiming } from "./claiming"

export class WearableManager {

  static currentWearableID: number = -1
  static blockDialogGeneration: boolean = false
  static wearables: Entity[] = []

  constructor() {

    // Set up rewards
    Claiming.AddReward({
      name: "FreeTop", 
      group: "FreeTop",
      campaignID: "899f6140-8dc5-4005-a5ca-13733dca1e29",
      campaignKey: "2eNeid48SBCp0goOHA8JSImfYUCNxUAFpcoTcz3KHik=.POW1rzyTm7xGYJIqZeLM3OpIDX9jMqEFqKz8EvxnsDg=",
      urn: "urn:decentraland:matic:collections-v2:XXX:0"
    })    
  }
}