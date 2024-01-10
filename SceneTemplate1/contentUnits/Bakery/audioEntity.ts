import { AudioSource, Entity, MeshRenderer, Transform, engine } from "@dcl/ecs"
import { Vector3 } from "@dcl/ecs-math"

export class AudioEntity {
    entities: Entity[] = []
    currentEntity: number = 0
    constructor(_audioPath: string, _volume: number, _numberOfEntities: number) {

        for (let index = 0; index < _numberOfEntities; index++) {
            let entity = engine.addEntity()
            Transform.create(entity, { position: Vector3.create(2, 2, 2), scale: Vector3.create(0.001, 0.001, 0.001) })
            AudioSource.create(entity, {
                audioClipUrl: _audioPath,
                playing: false,
                volume: _volume
            })
            MeshRenderer.setBox(entity)
            this.entities.push(entity)
        }
    }
 
    playSound(_position:Vector3) {
        Transform.getMutable(this.entities[this.currentEntity]).position = _position
        AudioSource.getMutable(this.entities[this.currentEntity]).playing = true
        this.incrementEntity()
    }

    incrementEntity(){
        this.currentEntity = this.currentEntity+1
        if(this.currentEntity>this.entities.length-1){
            this.currentEntity = 0
        }
    }
}