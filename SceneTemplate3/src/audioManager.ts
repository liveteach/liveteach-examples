import { AudioSource, Entity, Transform, engine } from "@dcl/sdk/ecs";

export class AudioManager {

    static notificationAudioEntity: Entity

    constructor(){
        AudioManager.notificationAudioEntity = engine.addEntity()
        Transform.create(AudioManager.notificationAudioEntity)
        AudioSource.create(AudioManager.notificationAudioEntity, {
          audioClipUrl: 'audio/notification.wav',
          playing: false,
          volume: 0.6
        })
    }
    
    static playNotification():void{
        Transform.getMutable(this.notificationAudioEntity).position = Transform.get(engine.CameraEntity).position
        AudioSource.getMutable(this.notificationAudioEntity).playing = true
    }
}