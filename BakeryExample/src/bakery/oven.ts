import { Entity, GltfContainer, InputAction, MeshCollider, MeshRenderer, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import * as utils from '@dcl-sdk/utils'
import { AudioManager } from "../audio/audioManager";

export class Oven {
    entity: Entity
    ovenDoor: Entity
    opened: boolean
    blocked: boolean = false
    timeKnob:Entity
    tempKnob:Entity

    constructor(_parent:Entity){
        this.entity = engine.addEntity()
        Transform.create(this.entity,{parent:_parent})
        GltfContainer.create(this.entity, {src:"models/bakery/oven.glb"})

        this.ovenDoor = engine.addEntity()
        Transform.create(this.ovenDoor, {
            parent: this.entity,
            position: Vector3.create(-1.64,0.25,0)
        })
        GltfContainer.create(this.ovenDoor, {src: "models/bakery/ovenDoor.glb"})

        let self = this
        pointerEventsSystem.onPointerDown(
            {
                entity: this.ovenDoor,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: "Interact"
                }
            }, 
            function () {
                self.interact()
            }
        )

        // Set up the knobs
        this.timeKnob = engine.addEntity()
        Transform.create(this.timeKnob, {
            parent: this.entity,
            position:Vector3.create(-1.46,1,0.01),
            scale: Vector3.create(0.075,0.075,0.1)
        })
        //MeshRenderer.setBox(this.timeKnob)
        MeshCollider.setBox(this.timeKnob)

        pointerEventsSystem.onPointerDown(
            {
                entity: this.timeKnob,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: "Set Timer"
                }
            }, 
            function () {
                AudioManager.playDialTurn()
            }
        )

        this.tempKnob = engine.addEntity()
        Transform.create(this.tempKnob, {
            parent: this.entity,
            position:Vector3.create(-1.83,1,0.01),
            scale: Vector3.create(0.075,0.075,0.1)
        })
        //MeshRenderer.setBox(this.tempKnob)
        MeshCollider.setBox(this.tempKnob)

        pointerEventsSystem.onPointerDown(
            {
                entity: this.tempKnob,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: "Set Temperature"
                }
            }, 
            function () {
                AudioManager.playDialTurn()
            }
        )

    }

    interact() { 
        let self = this
        if (!this.opened && !this.blocked) {
            this.openOven()
            this.opened = true
            this.blocked = true
            
            utils.timers.setTimeout(function () {
                self.blocked = false
            }, 900)
        }
        if (this.opened && !this.blocked) { 
            this.closeOven()
            this.opened = false
            this.blocked = true
            utils.timers.setTimeout(function () {
                self.blocked = false
            }, 900)
        } 
    } 
 
    openOven() { 
        utils.tweens.startRotation(this.ovenDoor, Quaternion.fromEulerDegrees(0,0,0), Quaternion.fromEulerDegrees(90,0,0),1.3)
        AudioManager.playOvenOpen(Transform.get(engine.PlayerEntity).position)
    } 

    closeOven() {
        utils.tweens.startRotation(this.ovenDoor, Quaternion.fromEulerDegrees(90,0,0), Quaternion.fromEulerDegrees(0,0,0),1)
        AudioManager.playOvenClose(Transform.get(engine.PlayerEntity).position)
    }
} 