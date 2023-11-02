import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { ScreenManager } from "./Screen/screenManager";
import { Podium } from "./podium";
import { Vector3 } from "@dcl/sdk/math";
import { setupUi } from "./ui";
import { Toaster } from "./NotificationSystem/Toaster";
import { AudioManager } from "./audioManager";
import { ControllerUI } from "@dclu/dclu-liveteach/src/classroom/ui/controllerUI";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom/classroomManager";
import { PeerToPeerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/peerToPeerChannel";
import * as classroomConfig from "./classroomConfigs/classroomConfig.json"
import { VideoContent } from "./Screen/content/videoContent";

export function main() {
    new ScreenManager()
    new Toaster()
    new AudioManager()
    new Podium()

    let floor: Entity = engine.addEntity()
    Transform.create(floor, {
        position: Vector3.create(8, 0, 8)
    })
    GltfContainer.create(floor, { src: "models/Floor.glb" })

    setupUi()
    const communicationChannel = new PeerToPeerChannel()
   // ClassroomManager.Initialise(classroomConfig, communicationChannel)

    ControllerUI.Show()
}