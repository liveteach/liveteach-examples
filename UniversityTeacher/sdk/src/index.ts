import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { ScreenManager } from "./Screen/screenManager";
import { Podium } from "./podium";
import { Vector3 } from "@dcl/sdk/math";


export function main() {
    new ScreenManager()

    new Podium()

    let floor: Entity = engine.addEntity()
    Transform.create(floor, {
        position: Vector3.create(8,0,8)
    })
    GltfContainer.create(floor, {src: "models/Floor.glb"})
}
