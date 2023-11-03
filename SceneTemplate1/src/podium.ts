import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { PodiumButton } from "./podiumButton";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom";

export class Podium {
    entity: Entity
    buttonsEntity: Entity
    muteButtonGraphic: Entity

    previousButton: PodiumButton
    nextButton: PodiumButton
    endButton: PodiumButton
    startButton: PodiumButton
    presentationButton: PodiumButton
    videoButton: PodiumButton
    modelButton: PodiumButton
    muteButton: PodiumButton
    playButton: PodiumButton
    powerButton: PodiumButton

    constructor() {
        this.entity = engine.addEntity()
        this.buttonsEntity = engine.addEntity()
        this.muteButtonGraphic = engine.addEntity()

        Transform.create(this.entity, {
            position: Vector3.create(21.1, 2, 16),
            rotation: Quaternion.fromEulerDegrees(0, 180, 0),
            scale: Vector3.create(1, 1, 1)
        })

        GltfContainer.create(this.entity, { src: "models/podium.glb" })

        Transform.create(this.buttonsEntity, {
            parent: this.entity
        })

        GltfContainer.create(this.buttonsEntity, { src: "models/podium_buttons_off.glb" })

        Transform.create(this.muteButtonGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.muteButtonGraphic, { src: "models/podium_mute_noPower.glb" })


        // Podium controls
        this.previousButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, 0),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Previous",
            function () {
                ClassroomManager.screenManager?.previous()
            }
        )

        this.nextButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, -0.12),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Next",
            () => {
                ClassroomManager.screenManager?.next()
            }
        )

        this.startButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, 0.12),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "To Start",
            () => {
                ClassroomManager.screenManager?.toStart()
            }
        )

        this.endButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, -0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "To End",
            () => {
                ClassroomManager.screenManager?.toEnd()
            }
        )

        this.presentationButton = new PodiumButton(
            this.entity,
            Vector3.create(0.43, 1.73, 0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Presentation",
            () => {
                ClassroomManager.screenManager?.showPresentation()
            }
        )

        this.videoButton = new PodiumButton(
            this.entity,
            Vector3.create(0.375, 1.67, 0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Movie",
            () => {
                ClassroomManager.screenManager?.showVideo()
            }
        )

        this.modelButton = new PodiumButton(
            this.entity,
            Vector3.create(0.28, 1.56, 0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "3D",
            () => {
                ClassroomManager.screenManager?.showModel()
            }
        )

        const self = this
        this.muteButton = new PodiumButton(
            this.entity,
            Vector3.create(0.31, 1.625, 0.26),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.03, 0.025, 0.04),
            "Mute",
            () => {
                ClassroomManager.screenManager?.toggleMute()
                if (ClassroomManager.screenManager?.muted) {
                    GltfContainer.createOrReplace(self.muteButtonGraphic, { src: "models/podium_mute_off.glb" })
                } else {
                    GltfContainer.createOrReplace(self.muteButtonGraphic, { src: "models/podium_mute_on.glb" })
                }
            }
        )

        this.playButton = new PodiumButton(
            this.entity,
            Vector3.create(0.31, 1.625, 0.22),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.03, 0.025, 0.04),
            "Play/Pause",
            () => {
                ClassroomManager.screenManager?.playPause()
            }
        )

        this.powerButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, 0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Power",
            () => {
                ClassroomManager.screenManager?.powerToggle()
                if (ClassroomManager.screenManager?.poweredOn) {
                    GltfContainer.createOrReplace(self.buttonsEntity, { src: "models/podium_buttons_on.glb" })
                    GltfContainer.createOrReplace(self.muteButtonGraphic, { src: "models/podium_mute_on.glb" })
                    self.previousButton.show()
                    self.nextButton.show()
                    self.endButton.show()
                    self.startButton.show()
                    self.presentationButton.show()
                    self.videoButton.show()
                    self.modelButton.show()
                    self.muteButton.show()
                    self.playButton.show()
                } else {
                    GltfContainer.createOrReplace(self.buttonsEntity, { src: "models/podium_buttons_off.glb" })
                    GltfContainer.createOrReplace(self.muteButtonGraphic, { src: "models/podium_mute_noPower.glb" })
                    self.previousButton.hide()
                    self.nextButton.hide()
                    self.endButton.hide()
                    self.startButton.hide()
                    self.presentationButton.hide()
                    self.videoButton.hide()
                    self.modelButton.hide()
                    self.muteButton.hide()
                    self.playButton.hide()
                }
            }
        )
    }
}