import { AudioSource, Entity, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { AudioEntity } from "./audioEntity";

export class AudioManager {

  static drawOpen: AudioEntity
  static drawClose: AudioEntity
  static ovenDoorOpen: AudioEntity
  static ovenDoorClose: AudioEntity
  static dialTurn: AudioEntity
  static success: AudioEntity

  constructor() {
    AudioManager.drawOpen = new AudioEntity("audio/drawOpen.mp3", 0.75, 2)
    AudioManager.drawClose = new AudioEntity("audio/drawClose.mp3", 0.75, 2)
    AudioManager.ovenDoorOpen = new AudioEntity("audio/ovenOpen.mp3", 0.5, 1)
    AudioManager.ovenDoorClose = new AudioEntity("audio/ovenClose.mp3", 0.5, 1)
    AudioManager.dialTurn = new AudioEntity("audio/dialTurn.mp3", 0.2,2)
    AudioManager.success = new AudioEntity("audio/success.mp3",1,2)
  } 
   
  static playDrawOpen(_position: Vector3): void {
    AudioManager.drawOpen.playSound(_position)
  } 

  static playDrawClose(_position: Vector3): void {
    AudioManager.drawClose.playSound(_position)
  }

  static playOvenOpen(_position: Vector3): void {
    AudioManager.ovenDoorOpen.playSound(_position)
  }

  static playOvenClose(_position: Vector3): void {
    AudioManager.ovenDoorClose.playSound(_position)
  }

  static playDialTurn():void {
    AudioManager.dialTurn.playSound(Transform.get(engine.PlayerEntity).position)
  }

  static playSuccess():void {
    AudioManager.success.playSound(Transform.get(engine.PlayerEntity).position)
  }

} 