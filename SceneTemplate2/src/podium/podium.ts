import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { PodiumButton } from "./podiumButton";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom";
import { MediaContentType } from "@dclu/dclu-liveteach/src/classroomContent/enums";
import { ControllerScreen } from "./controllerScreen";
import { InteractionScreen } from "./interactionScreen";

export class Podium {
    entity: Entity
    powerButtonGraphic: Entity
    prevButtonsGraphic: Entity
    nextButtonsGraphic: Entity
    muteButtonGraphic: Entity
    playPauseButtonGraphic: Entity
    imageButtonGraphic: Entity
    videoButtonGraphic: Entity
    modelButtonGraphic: Entity
    interactionButtonGraphic: Entity
    controllerGraphic: Entity

    previousButton: PodiumButton
    nextButton: PodiumButton
    interactiveContentButton: PodiumButton
    teacherControllerButton: PodiumButton
    presentationButton: PodiumButton
    videoButton: PodiumButton
    modelButton: PodiumButton
    muteButton: PodiumButton
    playButton: PodiumButton
    powerButton: PodiumButton

    controllerScreen: ControllerScreen
    interactionScreen: InteractionScreen

    constructor(_position: Vector3, _rotation: Vector3) {
        this.entity = engine.addEntity()
        this.powerButtonGraphic = engine.addEntity()
        this.prevButtonsGraphic = engine.addEntity()
        this.nextButtonsGraphic = engine.addEntity()
        this.muteButtonGraphic = engine.addEntity()
        this.playPauseButtonGraphic = engine.addEntity()
        this.imageButtonGraphic = engine.addEntity()
        this.videoButtonGraphic = engine.addEntity()
        this.modelButtonGraphic = engine.addEntity()
        this.interactionButtonGraphic = engine.addEntity()
        this.controllerGraphic = engine.addEntity()

        Transform.create(this.entity, {
            position: _position,
            rotation: Quaternion.fromEulerDegrees(_rotation.x, _rotation.y, _rotation.z),
            scale: Vector3.create(1, 1, 1)
        })

        GltfContainer.create(this.entity, { src: "models/podium/podium.glb" })

        Transform.create(this.powerButtonGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.powerButtonGraphic, { src: "models/podium/power_off.glb" })

        Transform.create(this.prevButtonsGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.prevButtonsGraphic, { src: "models/podium/prev_off.glb" })

        Transform.create(this.nextButtonsGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.nextButtonsGraphic, { src: "models/podium/next_off.glb" })

        Transform.create(this.muteButtonGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.muteButtonGraphic, { src: "models/podium/mute_noPower.glb" })

        Transform.create(this.playPauseButtonGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.playPauseButtonGraphic, { src: "models/podium/playpause_off.glb" })

        Transform.create(this.imageButtonGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.imageButtonGraphic, { src: "models/podium/image_off.glb" })

        Transform.create(this.videoButtonGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.videoButtonGraphic, { src: "models/podium/video_off.glb" })

        Transform.create(this.modelButtonGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.modelButtonGraphic, { src: "models/podium/3d_off.glb" })

        Transform.create(this.interactionButtonGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.interactionButtonGraphic, { src: "models/podium/interactiveContent_off.glb" })

        Transform.create(this.controllerGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.controllerGraphic, { src: "models/podium/teacher_off.glb" })

        // Podium controls
        this.previousButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, 0),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Previous",
            function () {
                if (self.controllerScreen.open) {
                    self.controllerScreen.previous()
                }
                else if (self.interactionScreen.open) {
                    self.interactionScreen.previous()
                }
                else {
                    ClassroomManager.screenManager?.previous()
                }
                self.updateButtonGraphics()
            },
            function () {
                if (self.controllerScreen.open) {
                    self.controllerScreen.toStart()
                }
                else if (self.interactionScreen.open) {
                    self.interactionScreen.toStart()
                }
                else {
                    ClassroomManager.screenManager?.toStart()
                }
                self.updateButtonGraphics()
            },
            true
        )

        this.nextButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, -0.12),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Next",
            function () {
                if (self.controllerScreen.open) {
                    self.controllerScreen.next()
                }
                else if (self.interactionScreen.open) {
                    self.interactionScreen.next()
                }
                else {
                    ClassroomManager.screenManager?.next()
                }
                self.updateButtonGraphics()
            },
            function () {
                if (self.controllerScreen.open) {
                    self.controllerScreen.toEnd()
                }
                else if (self.interactionScreen.open) {
                    self.interactionScreen.toEnd()
                }
                else {
                    ClassroomManager.screenManager?.toEnd()
                }
                self.updateButtonGraphics()
            },
            true
        )

        const self = this
        this.interactiveContentButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, 0.12),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Interaction",
            () => {
                self.hideControllerScreen()
                self.interactionScreen.toggle()
                self.updateButtonGraphics()
            }
        )

        this.teacherControllerButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, -0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Controller",
            () => {
                if (!ClassroomManager.classController || ClassroomManager.classController.isStudent()) return

                self.hideInteractionScreen()
                self.controllerScreen.toggle()
                self.updateButtonGraphics()
            }
        )

        this.presentationButton = new PodiumButton(
            this.entity,
            Vector3.create(0.43, 1.73, 0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Presentation",
            () => {
                self.hideControllerScreen()
                self.hideInteractionScreen()
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
                self.hideControllerScreen()
                self.hideInteractionScreen()
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
                self.hideControllerScreen()
                self.hideInteractionScreen()
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
                self.hideControllerScreen()
                self.hideInteractionScreen()
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
                self.hideControllerScreen()
                self.hideInteractionScreen()
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
                if (ClassroomManager.classController?.inSession == false) return

                self.hideControllerScreen()
                self.hideInteractionScreen()
                ClassroomManager.screenManager?.powerToggle()
                if (ClassroomManager.screenManager?.poweredOn) {
                    GltfContainer.createOrReplace(this.powerButtonGraphic, { src: "models/podium/power_on.glb" })
                    GltfContainer.createOrReplace(self.prevButtonsGraphic, { src: "models/podium/prev_on.glb" })
                    GltfContainer.createOrReplace(self.nextButtonsGraphic, { src: "models/podium/next_on.glb" })
                    GltfContainer.createOrReplace(self.muteButtonGraphic, { src: "models/podium/mute_on.glb" })
                    GltfContainer.createOrReplace(self.playPauseButtonGraphic, { src: "models/podium/playpause_on.glb" })
                    GltfContainer.createOrReplace(self.imageButtonGraphic, { src: "models/podium/image_on.glb" })
                    GltfContainer.createOrReplace(self.videoButtonGraphic, { src: "models/podium/video_on.glb" })
                    GltfContainer.createOrReplace(self.modelButtonGraphic, { src: "models/podium/3d_on.glb" })
                    GltfContainer.createOrReplace(self.interactionButtonGraphic, { src: "models/podium/interactiveContent_on.glb" })
                    self.previousButton.show()
                    self.nextButton.show()
                    self.interactiveContentButton.show()
                    self.presentationButton.show()
                    self.videoButton.show()
                    self.modelButton.show()
                    self.muteButton.show()
                    self.playButton.show()
                    self.updateButtonGraphics()
                } else {
                    if (!self.controllerScreen.open) {
                        GltfContainer.createOrReplace(self.prevButtonsGraphic, { src: "models/podium/prev_off.glb" })
                        GltfContainer.createOrReplace(self.nextButtonsGraphic, { src: "models/podium/next_off.glb" })
                        self.previousButton.hide()
                        self.nextButton.hide()
                    }

                    GltfContainer.createOrReplace(this.powerButtonGraphic, { src: "models/podium/power_off.glb" })
                    GltfContainer.createOrReplace(self.muteButtonGraphic, { src: "models/podium/mute_noPower.glb" })
                    GltfContainer.createOrReplace(self.playPauseButtonGraphic, { src: "models/podium/playpause_off.glb" })
                    GltfContainer.createOrReplace(self.imageButtonGraphic, { src: "models/podium/image_off.glb" })
                    GltfContainer.createOrReplace(self.videoButtonGraphic, { src: "models/podium/video_off.glb" })
                    GltfContainer.createOrReplace(self.modelButtonGraphic, { src: "models/podium/3d_off.glb" })
                    GltfContainer.createOrReplace(self.interactionButtonGraphic, { src: "models/podium/interactiveContent_off.glb" })
                    self.interactiveContentButton.hide()
                    self.presentationButton.hide()
                    self.videoButton.hide()
                    self.modelButton.hide()
                    self.muteButton.hide()
                    self.playButton.hide()
                    self.interactionScreen.open = false
                }
            }
        )

        this.interactiveContentButton.hide()
        this.presentationButton.hide()
        this.videoButton.hide()
        this.modelButton.hide()
        this.muteButton.hide()
        this.playButton.hide()
        this.previousButton.hide()
        this.nextButton.hide()

        this.controllerScreen = new ControllerScreen(this.controllerGraphic, this.powerOff.bind(this), this.entity)
        this.interactionScreen = new InteractionScreen(this.interactionButtonGraphic, this.entity)
    }

    updateButtonGraphics(): void {
        if (ClassroomManager.screenManager?.poweredOn == true) {
            if (ClassroomManager.screenManager?.currentContent?.getContent().getContentType() == MediaContentType.image) {
                GltfContainer.createOrReplace(this.imageButtonGraphic, { src: "models/podium/image_selected.glb" })
            } else {
                GltfContainer.createOrReplace(this.imageButtonGraphic, { src: "models/podium/image_on.glb" })
            }
            if (ClassroomManager.screenManager?.currentContent?.getContent().getContentType() == MediaContentType.video) {
                GltfContainer.createOrReplace(this.videoButtonGraphic, { src: "models/podium/video_selected.glb" })
            } else {
                GltfContainer.createOrReplace(this.videoButtonGraphic, { src: "models/podium/video_on.glb" })
            }
            if (ClassroomManager.screenManager?.currentContent?.getContent().getContentType() == MediaContentType.model) {
                GltfContainer.createOrReplace(this.modelButtonGraphic, { src: "models/podium/3d_selected.glb" })
            } else {
                GltfContainer.createOrReplace(this.modelButtonGraphic, { src: "models/podium/3d_on.glb" })
            }
            if (ClassroomManager.screenManager?.muted) {
                GltfContainer.createOrReplace(this.muteButtonGraphic, { src: "models/podium/mute_on.glb" })
            } else {
                GltfContainer.createOrReplace(this.muteButtonGraphic, { src: "models/podium/mute_off.glb" })
            }
            if (ClassroomManager.screenManager?.isPaused()) {
                GltfContainer.createOrReplace(this.playPauseButtonGraphic, { src: "models/podium/playpause_selected.glb" })
            } else {
                GltfContainer.createOrReplace(this.playPauseButtonGraphic, { src: "models/podium/playpause_on.glb" })
            }
        }


        if (this.controllerScreen.open) {
            if (this.controllerScreen.hasPrevious()) {
                GltfContainer.createOrReplace(this.prevButtonsGraphic, { src: "models/podium/prev_on.glb" })
                this.previousButton.show()
            }
            else {
                GltfContainer.createOrReplace(this.prevButtonsGraphic, { src: "models/podium/prev_off.glb" })
                this.previousButton.hide()
            }
            if (this.controllerScreen.hasNext()) {
                GltfContainer.createOrReplace(this.nextButtonsGraphic, { src: "models/podium/next_on.glb" })
                this.nextButton.show()
            }
            else {
                GltfContainer.createOrReplace(this.nextButtonsGraphic, { src: "models/podium/next_off.glb" })
                this.nextButton.hide()
            }
        } 
        else if (this.interactionScreen.open) {
            if (this.interactionScreen.hasPrevious()) {
                GltfContainer.createOrReplace(this.prevButtonsGraphic, { src: "models/podium/prev_on.glb" })
                this.previousButton.show()
            }
            else {
                GltfContainer.createOrReplace(this.prevButtonsGraphic, { src: "models/podium/prev_off.glb" })
                this.previousButton.hide()
            }
            if (this.interactionScreen.hasNext()) {
                GltfContainer.createOrReplace(this.nextButtonsGraphic, { src: "models/podium/next_on.glb" })
                this.nextButton.show()
            }
            else {
                GltfContainer.createOrReplace(this.nextButtonsGraphic, { src: "models/podium/next_off.glb" })
                this.nextButton.hide()
            }
        }
        else {
            if (ClassroomManager.screenManager?.currentContent?.index <= 0) {
                GltfContainer.createOrReplace(this.prevButtonsGraphic, { src: "models/podium/prev_off.glb" })
                this.previousButton.hide()
            }
            else {
                GltfContainer.createOrReplace(this.prevButtonsGraphic, { src: "models/podium/prev_on.glb" })
                this.previousButton.show()
            }
            if (ClassroomManager.screenManager?.currentContent?.index >= ClassroomManager.screenManager?.currentContent?.content.length - 1) {
                GltfContainer.createOrReplace(this.nextButtonsGraphic, { src: "models/podium/next_off.glb" })
                this.nextButton.hide()
            }
            else {
                GltfContainer.createOrReplace(this.nextButtonsGraphic, { src: "models/podium/next_on.glb" })
                this.nextButton.show()
            }

            if (ClassroomManager.screenManager?.poweredOn == false) {
                GltfContainer.createOrReplace(this.prevButtonsGraphic, { src: "models/podium/prev_off.glb" })
                GltfContainer.createOrReplace(this.nextButtonsGraphic, { src: "models/podium/next_off.glb" })
                this.previousButton.hide()
                this.nextButton.hide()
            }
        }
    }

    powerOff(): void {
        if (ClassroomManager.screenManager?.poweredOn == false) return

        ClassroomManager.screenManager?.powerToggle()
        GltfContainer.createOrReplace(this.powerButtonGraphic, { src: "models/podium/power_off.glb" })
        GltfContainer.createOrReplace(this.muteButtonGraphic, { src: "models/podium/mute_noPower.glb" })
        GltfContainer.createOrReplace(this.playPauseButtonGraphic, { src: "models/podium/playpause_off.glb" })
        GltfContainer.createOrReplace(this.imageButtonGraphic, { src: "models/podium/image_off.glb" })
        GltfContainer.createOrReplace(this.videoButtonGraphic, { src: "models/podium/video_off.glb" })
        GltfContainer.createOrReplace(this.modelButtonGraphic, { src: "models/podium/3d_off.glb" })
        GltfContainer.createOrReplace(this.interactionButtonGraphic, { src: "models/podium/interactiveContent_off.glb" })
        this.interactiveContentButton.hide()
        this.presentationButton.hide()
        this.videoButton.hide()
        this.modelButton.hide()
        this.muteButton.hide()
        this.playButton.hide()
        this.interactionScreen.open = false
    }

    private hideControllerScreen(): void {
        if (ClassroomManager.screenManager?.poweredOn == false) {
            GltfContainer.createOrReplace(this.prevButtonsGraphic, { src: "models/podium/prev_off.glb" })
            GltfContainer.createOrReplace(this.nextButtonsGraphic, { src: "models/podium/next_off.glb" })
            this.previousButton.hide()
            this.nextButton.hide()
        }
        this.controllerScreen.hide()
    }

    private hideInteractionScreen(): void {
        this.interactionScreen.hide()
    }
}