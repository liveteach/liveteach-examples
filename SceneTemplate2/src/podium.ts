import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { PodiumButton } from "./podiumButton";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom";
import { MediaContentType } from "@dclu/dclu-liveteach/src/classroomContent/enums";

export class Podium {
    entity: Entity
    buttonsEntity: Entity
    muteButtonGraphic: Entity
    playPauseButtonGraphic: Entity
    imageButtonGraphic: Entity
    videoButtonGraphic: Entity
    modelButtonGraphic: Entity

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
        this.playPauseButtonGraphic = engine.addEntity()
        this.imageButtonGraphic = engine.addEntity()
        this.videoButtonGraphic = engine.addEntity()
        this.modelButtonGraphic = engine.addEntity()

        Transform.create(this.entity, {
            position: Vector3.create(21.1, 1.8, 16),
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

        Transform.create(this.playPauseButtonGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.playPauseButtonGraphic, { src: "models/podium_playpause_off.glb" })

        Transform.create(this.imageButtonGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.imageButtonGraphic, { src: "models/podium_image_off.glb" })

        Transform.create(this.videoButtonGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.videoButtonGraphic, { src: "models/podium_video_off.glb" })

        Transform.create(this.modelButtonGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.modelButtonGraphic, { src: "models/podium_3d_off.glb" })


        // Podium controls
        this.previousButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, 0),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Previous",
            function () {
                ClassroomManager.screenManager?.previous()
                self.updateButtonGraphics()
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
                self.updateButtonGraphics()
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
                self.updateButtonGraphics()
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
                self.updateButtonGraphics()
            }
        )

        const self = this
        this.presentationButton = new PodiumButton(
            this.entity,
            Vector3.create(0.43, 1.73, 0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Presentation",
            () => {
                ClassroomManager.screenManager?.showPresentation()
                self.updateButtonGraphics()
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
                self.updateButtonGraphics()
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
                self.updateButtonGraphics()
            }
        )

        this.muteButton = new PodiumButton(
            this.entity,
            Vector3.create(0.31, 1.625, 0.26),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.03, 0.025, 0.04),
            "Mute",
            () => {
                ClassroomManager.screenManager?.toggleMute()
                self.updateButtonGraphics()
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
                self.updateButtonGraphics()
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
                    ClassroomManager.StartContentUnit(ClassroomManager.activeContent.contentUnits[0].key, ClassroomManager.activeContent.contentUnits[0].data)
                    GltfContainer.createOrReplace(self.buttonsEntity, { src: "models/podium_buttons_on.glb" })
                    GltfContainer.createOrReplace(self.muteButtonGraphic, { src: "models/podium_mute_on.glb" })
                    GltfContainer.createOrReplace(self.playPauseButtonGraphic, { src: "models/podium_playpause_on.glb" })
                    GltfContainer.createOrReplace(self.imageButtonGraphic, { src: "models/podium_image_on.glb" })
                    GltfContainer.createOrReplace(self.videoButtonGraphic, { src: "models/podium_video_on.glb" })
                    GltfContainer.createOrReplace(self.modelButtonGraphic, { src: "models/podium_3d_on.glb" })
                    self.previousButton.show()
                    self.nextButton.show()
                    self.endButton.show()
                    self.startButton.show()
                    self.presentationButton.show()
                    self.videoButton.show()
                    self.modelButton.show()
                    self.muteButton.show()
                    self.playButton.show()
                    self.updateButtonGraphics()
                } else {
                    GltfContainer.createOrReplace(self.buttonsEntity, { src: "models/podium_buttons_off.glb" })
                    GltfContainer.createOrReplace(self.muteButtonGraphic, { src: "models/podium_mute_noPower.glb" })
                    GltfContainer.createOrReplace(self.playPauseButtonGraphic, { src: "models/podium_playpause_off.glb" })
                    GltfContainer.createOrReplace(self.imageButtonGraphic, { src: "models/podium_image_off.glb" })
                    GltfContainer.createOrReplace(self.videoButtonGraphic, { src: "models/podium_video_off.glb" })
                    GltfContainer.createOrReplace(self.modelButtonGraphic, { src: "models/podium_3d_off.glb" })
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

    updateButtonGraphics(): void {
        if (ClassroomManager.screenManager?.currentContent?.getContent().getContentType() == MediaContentType.image) {
            GltfContainer.createOrReplace(this.imageButtonGraphic, { src: "models/podium_image_selected.glb" })
        } else {
            GltfContainer.createOrReplace(this.imageButtonGraphic, { src: "models/podium_image_on.glb" })
        }
        if (ClassroomManager.screenManager?.currentContent?.getContent().getContentType() == MediaContentType.video) {
            GltfContainer.createOrReplace(this.videoButtonGraphic, { src: "models/podium_video_selected.glb" })
        } else {
            GltfContainer.createOrReplace(this.videoButtonGraphic, { src: "models/podium_video_on.glb" })
        }
        if (ClassroomManager.screenManager?.currentContent?.getContent().getContentType() == MediaContentType.model) {
            GltfContainer.createOrReplace(this.modelButtonGraphic, { src: "models/podium_3d_selected.glb" })
        } else {
            GltfContainer.createOrReplace(this.modelButtonGraphic, { src: "models/podium_3d_on.glb" })
        }
        if (ClassroomManager.screenManager?.muted) {
            GltfContainer.createOrReplace(this.muteButtonGraphic, { src: "models/podium_mute_off.glb" })
        } else {
            GltfContainer.createOrReplace(this.muteButtonGraphic, { src: "models/podium_mute_on.glb" })
        }
        if (ClassroomManager.screenManager?.isPaused()) {
            GltfContainer.createOrReplace(this.playPauseButtonGraphic, { src: "models/podium_playpause_selected.glb" })
        } else {
            GltfContainer.createOrReplace(this.playPauseButtonGraphic, { src: "models/podium_playpause_on.glb" })
        }
    }
}