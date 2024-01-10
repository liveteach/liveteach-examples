import {  Entity, GltfContainer, InputAction, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import * as utils from '@dcl-sdk/utils'
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { AudioManager } from "./audioManager";

export class Draw {
    entity: Entity
    opened: boolean
    blocked: boolean = false
    topDraw: boolean
    startPos:Vector3
    startRot:Quaternion

    constructor(_modelPath: string, _topDraw: boolean) {
        this.topDraw = _topDraw
        this.entity = engine.addEntity()

        GltfContainer.create(this.entity,{src:_modelPath})

        let self = this
        pointerEventsSystem.onPointerDown(
            {
                entity: this.entity,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: "Interact"
                }
            },
            function () {
                self.interact()
            }
        )
    } 

    interact() { 
        let self = this
        if (!this.opened && !this.blocked) {
            this.open()
            this.opened = true
            this.blocked = true
            
            utils.timers.setTimeout(function () {
                self.blocked = false
            }, 900)
        }
        if (this.opened && !this.blocked) { 
            this.close()
            this.opened = false
            this.blocked = true
            utils.timers.setTimeout(function () {
                self.blocked = false
            }, 900)
        }
    }
 
    open() {
        if (this.topDraw) {
            utils.tweens.startTranslation(this.entity, this.startPos, Vector3.create(this.startPos.x,this.startPos.y,this.startPos.z+0.3), 0.7)
        } else {
            utils.tweens.startRotation(this.entity, this.startRot, Quaternion.fromEulerDegrees(0,90,0),0.7)
        }
        AudioManager.playDrawOpen(Transform.get(engine.PlayerEntity).position)
    }

    close() {
        if (this.topDraw) {
            utils.tweens.startTranslation(this.entity, Vector3.create(this.startPos.x,this.startPos.y,this.startPos.z+0.3), this.startPos, 0.6)
        } else {
            utils.tweens.startRotation(this.entity, Quaternion.fromEulerDegrees(0,90,0), this.startRot,0.5)
        }
        AudioManager.playDrawClose(Transform.get(engine.PlayerEntity).position)
    }
}