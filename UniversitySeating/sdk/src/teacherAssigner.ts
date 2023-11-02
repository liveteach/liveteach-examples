import { Entity, InputAction, MeshCollider, MeshRenderer, PointerEvents, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { UserType } from "@dclu/dclu-liveteach/src/enums";

import { UserManager } from "@dclu/dclu-liveteach/src/seating/user";

export class TeacherAssigner {
    constructor(){
        let entity:Entity = engine.addEntity()
        
        Transform.create(entity, {position:Vector3.create(4,1.5,16)})

        MeshRenderer.setSphere(entity)
        MeshCollider.setSphere(entity)

        pointerEventsSystem.onPointerDown(
            {
                entity: entity,
                opts: { button: InputAction.IA_POINTER, hoverText: 'Become the teacher', maxDistance: 20 },
            },
            function () {
                UserManager.myself.userType = UserType.teacher
            }
        )
    }
}