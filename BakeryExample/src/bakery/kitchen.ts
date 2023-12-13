import { Entity, GltfContainer, Transform, TransformTypeWithOptionals, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { Draw } from "./draw";
import { Oven } from "./oven";
import { InteractionManager } from "./interactionManager";
import { Instructions } from "./instructions";

export class Kitchen{
    oven:Oven
    counterEntity: Entity
    topDrawPositions: number [] = [-0.302,-0.93,-2.327,-2.955]
    bottomDrawPositions: number [] = [-0.04,-0.668,-2.065,-2.693]

    constructor(_transform:TransformTypeWithOptionals){
        this.counterEntity = engine.addEntity()
        Transform.create(this.counterEntity, _transform)
        GltfContainer.create(this.counterEntity, {src:"models/bakery/counter.glb"})

        this.oven = new Oven(this.counterEntity)

        // Add the top draws
        this.topDrawPositions.forEach(drawPosition => {
            let draw = new Draw("models/bakery/topDraw.glb",true)
            Transform.create(draw.entity, {
                parent:this.counterEntity,
                position: Vector3.create(drawPosition,0.98,0.01)
            })
            draw.startPos = Transform.get(draw.entity).position
        });        

        this.bottomDrawPositions.forEach(drawPosition => {
            let draw = new Draw("models/bakery/bottomDraw.glb",false)
            Transform.create(draw.entity, {
                parent:this.counterEntity,
                position: Vector3.create(drawPosition,0.46,0.03)
            })
            draw.startRot = Transform.get(draw.entity).rotation
        });

        new InteractionManager(this.counterEntity)

        new Instructions({
            position: Vector3.create(20.5,4,13.5),
            rotation: Quaternion.fromEulerDegrees(0,0,0)
        })

    }
}