import { Entity, GltfContainer, InputAction, Transform, TransformTypeWithOptionals, engine, pointerEventsSystem } from "@dcl/sdk/ecs"
import { Claiming } from "./claiming"
import { Quaternion } from "@dcl/sdk/math"
import { openExternalUrl } from "~system/RestrictedActions"

export class Dispenser {
    base: Entity = engine.addEntity()
    button: Entity = engine.addEntity()
    wearable: Entity = engine.addEntity()
    rotation:number = 0

    constructor(_transform: TransformTypeWithOptionals, _wearablePath: string, _wearableTransformOffset: TransformTypeWithOptionals, _link:string = "",_cost:number = 0) {

        GltfContainer.create(this.base, { src: "models/dispensers/Wearable_Dispenser.glb" })
        GltfContainer.create(this.button, { src: "models/dispensers/Button_Dispenser.glb" })
        GltfContainer.create(this.wearable, { src: _wearablePath })

        Transform.create(this.base, {
            position: _transform.position,
            rotation: _transform.rotation,
            scale: _transform.scale
        })

        Transform.create(this.button, { parent: this.base })


        // this.button.addComponent(new OnPointerDown(()=>{
        //     VCClaiming.claimFromDispenser()
        // }))

        let self=this

        if(_link.length==0){
            pointerEventsSystem.onPointerDown(
                {
                    entity: this.button,
                    opts: {
                        button: InputAction.IA_POINTER,
                        hoverText: 'Claim'
                    }
                },
                function () {
                    // Claim for free
                    Claiming.ClaimReward("FreeTop")
                }
            )
        } else {
            pointerEventsSystem.onPointerDown(
                {
                    entity: this.button,
                    opts: {
                        button: InputAction.IA_POINTER,
                        hoverText: 'Buy for ' + _cost + " mana"
                    }
                },
                function () {
                    // Can't buy in scene so open external link to the market place
                    openExternalUrl({url:_link})
                }
            )
        }
        
        Transform.create(this.wearable, {
            parent: this.base,
            position: _wearableTransformOffset.position,
            rotation: _wearableTransformOffset.rotation,
            scale: _wearableTransformOffset.scale
        })

        engine.addSystem(this.update.bind(this))
    }

    update(_dt:number){
        this.rotation += _dt*30
        Transform.getMutable(this.wearable).rotation = Quaternion.fromEulerDegrees(0,this.rotation,0)
    }

}