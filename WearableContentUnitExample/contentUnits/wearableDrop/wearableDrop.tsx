import { Entity, GltfContainer, InputAction, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom";
import { IContentUnit } from "@dclu/dclu-liveteach/src/contentUnits";

export class WearableDrop implements IContentUnit {
    dispenserEntity: Entity

    constructor() {
        this.dispenserEntity = engine.addEntity()

        GltfContainer.create(this.dispenserEntity, {
            src: "contentUnits/wearableDrop/models/POAP_dispenser.glb"
        })
        Transform.create(this.dispenserEntity, {
            position: Vector3.create(0, 0, 0), // <-- insert position
            scale: Vector3.Zero()
        })
    }

    start(_data: any): void {
        // Don't allow teachers past this point, since they're only triggering it and not claiming the wearable themselves
        const isStudent = ClassroomManager.classController?.isStudent()
        if (!isStudent) return

        const self = this
        pointerEventsSystem.onPointerDown(
            {
                entity: this.dispenserEntity,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: "claim"
                }
            },
            function () {
                self.claimWearable(_data.wearableName, _data.group, _data.campaignID, _data.campaignKey, _data.urn)
            }
        )
        Transform.getMutable(this.dispenserEntity).scale = Vector3.One()
    }
    end(): void {
        const isStudent = ClassroomManager.classController?.isStudent()
        if (!isStudent) return
        
        pointerEventsSystem.removeOnPointerDown(this.dispenserEntity)
        Transform.getMutable(this.dispenserEntity).scale = Vector3.Zero()
    }
    update(_data: any): void {

    }

    private claimWearable(_name: string, _group: string, _campaignID: string, _campaignKey: string, _urn: string) {

    }
}