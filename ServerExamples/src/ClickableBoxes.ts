import { engine, Transform, MeshRenderer, MeshCollider, pointerEventsSystem, InputAction, Entity, TextShape } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { ReferenceServerController } from "./messaging/ReferenceServerController"
import { VegasCityServerComms } from "./messaging/VegasCityServerComms"

export class ClickableBoxes{

    private entity: Entity
    private label: Entity
    private message: string
    private channel: string
    private hoverText: string
    private ws:ReferenceServerController
    private user: string

    constructor(

        ws:ReferenceServerController,
        serverComms:VegasCityServerComms,
        message:string,
        channel: string,
        hoverText: string,
        position: Vector3,
        user: string ){

        this.entity = engine.addEntity()
        this.label = engine.addEntity()
        this.user = user

        Transform.create(this.entity, {
            position: position,
            scale: Vector3.create(0.5,0.5,0.5)
        })
        Transform.create(this.label, {
            position: Vector3.create(0,1,0),
            parent: this.entity,
            scale: Vector3.create(0.2,0.2,0.2)
        })
        TextShape.create(this.label,{
            text: hoverText
          })
        
        MeshRenderer.setBox(this.entity)
        MeshCollider.setBox(this.entity)

        this.channel = channel
        this.hoverText = hoverText
        this.message = message
        this.ws = ws

        let _this = this

        pointerEventsSystem.onPointerDown(
            {
              entity: _this.entity,
              opts: { button: InputAction.IA_PRIMARY, hoverText: _this.hoverText },
            },
            function () {

                // For Node implementation
                ws.sendCommand("message", _this.channel, _this.message, _this.user)

                // For java Implementation
                //serverComms.sendMessage(_this.message,_this.channel, _this.user)
            }
        )
    }
    
}