import { Entity, GltfContainer, InputAction, Material, MeshCollider, MeshRenderer, TextShape, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";
import { PodiumButton } from "./podiumButton";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom";
import { MediaContentType } from "@dclu/dclu-liveteach/src/classroomContent/enums";
import { ContentUnitManager } from "@dclu/dclu-liveteach/src/contentUnits";

export class Podium {
    entity: Entity
    powerButtonGraphic: Entity
    prevNextButtonsGraphic: Entity
    muteButtonGraphic: Entity
    playPauseButtonGraphic: Entity
    imageButtonGraphic: Entity
    videoButtonGraphic: Entity
    modelButtonGraphic: Entity
    interactionButtonGraphic: Entity
    teacherControllerGraphic: Entity

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

    interactionSelected: boolean = false
    controllerOpen: boolean = false

    controllerEntity: Entity
    controllerTitle: Entity
    controllerClassName: Entity
    controllerStartEndButton: Entity
    controllerStartEndButtonText: Entity

    interactionIndex: number = 0
    interactionEntity: Entity
    interactionTitle: Entity
    interactionName: Entity
    interactionStartEndButton: Entity
    interactionStartEndButtonText: Entity

    constructor() {
        this.entity = engine.addEntity()
        this.powerButtonGraphic = engine.addEntity()
        this.prevNextButtonsGraphic = engine.addEntity()
        this.muteButtonGraphic = engine.addEntity()
        this.playPauseButtonGraphic = engine.addEntity()
        this.imageButtonGraphic = engine.addEntity()
        this.videoButtonGraphic = engine.addEntity()
        this.modelButtonGraphic = engine.addEntity()
        this.interactionButtonGraphic = engine.addEntity()
        this.teacherControllerGraphic = engine.addEntity()

        Transform.create(this.entity, {
            position: Vector3.create(21.1, 1.8, 16),
            rotation: Quaternion.fromEulerDegrees(0, 180, 0),
            scale: Vector3.create(1, 1, 1)
        })

        GltfContainer.create(this.entity, { src: "models/podium/podium.glb" })

        Transform.create(this.powerButtonGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.powerButtonGraphic, { src: "models/podium/power_off.glb" })

        Transform.create(this.prevNextButtonsGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.prevNextButtonsGraphic, { src: "models/podium/prevNext_off.glb" })

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

        Transform.create(this.teacherControllerGraphic, {
            parent: this.entity
        })

        GltfContainer.create(this.teacherControllerGraphic, { src: "models/podium/teacher_off.glb" })


        // Podium controls
        this.previousButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, 0),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Previous",
            function () {
                if (self.controllerOpen) {
                    if (ClassroomManager.classController) {
                        ClassroomManager.classController.selectedClassIndex--
                        if (ClassroomManager.classController.selectedClassIndex < 0) {
                            ClassroomManager.classController.selectedClassIndex = ClassroomManager.classController.classList.length - 1
                        }
                        TextShape.getMutable(self.controllerClassName).text = ClassroomManager.classController.classList[ClassroomManager.classController.selectedClassIndex].name
                    }
                }
                else if(self.interactionSelected) {
                    self.interactionIndex--
                    if (self.interactionIndex < 0) {
                        self.interactionIndex = ClassroomManager.activeContent.contentUnits.length - 1
                    }
                    TextShape.getMutable(self.interactionName).text = ClassroomManager.activeContent.contentUnits[self.interactionIndex].name
                }
                else {
                    ClassroomManager.screenManager?.previous()
                    self.updateButtonGraphics()
                }
            }
        )

        this.nextButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, -0.12),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Next",
            () => {
                if (self.controllerOpen) {
                    if (ClassroomManager.classController) {
                        ClassroomManager.classController.selectedClassIndex++
                        if (ClassroomManager.classController.selectedClassIndex >= ClassroomManager.classController.classList.length) {
                            ClassroomManager.classController.selectedClassIndex = 0
                        }
                        TextShape.getMutable(self.controllerClassName).text = ClassroomManager.classController.classList[ClassroomManager.classController.selectedClassIndex].name
                    }
                }
                else if(self.interactionSelected) {
                    self.interactionIndex++
                    if (self.interactionIndex >= ClassroomManager.activeContent.contentUnits.length) {
                        self.interactionIndex = 0
                    }
                    TextShape.getMutable(self.interactionName).text = ClassroomManager.activeContent.contentUnits[self.interactionIndex].name
                }
                else {
                    ClassroomManager.screenManager?.next()
                    self.updateButtonGraphics()
                }
            }
        )

        const self = this
        this.interactiveContentButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, 0.12),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Interaction",
            () => {
                self.hideControllerMenu()
                self.interactionSelected = !self.interactionSelected
                if (self.interactionSelected) {
                    TextShape.getMutable(self.interactionName).text = ClassroomManager.activeContent.contentUnits[self.interactionIndex].name
                    GltfContainer.createOrReplace(self.interactionButtonGraphic, { src: "models/podium/interactiveContent_selected.glb" })
                    Transform.getMutable(self.interactionEntity).scale = Vector3.create(0.44, 0.33, 1)
                }
                else {
                    GltfContainer.createOrReplace(self.interactionButtonGraphic, { src: "models/podium/interactiveContent_on.glb" })
                    Transform.getMutable(self.interactionEntity).scale = Vector3.Zero()
                }
            }
        )

        this.teacherControllerButton = new PodiumButton(
            this.entity,
            Vector3.create(0.2, 1.5, -0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Controller",
            () => {
                self.hideInteractionMenu()
                self.controllerOpen = !self.controllerOpen
                if (self.controllerOpen) {
                    TextShape.getMutable(self.controllerClassName).text = ClassroomManager.classController ? ClassroomManager.classController.classList[ClassroomManager.classController.selectedClassIndex].name : ""
                    GltfContainer.createOrReplace(self.prevNextButtonsGraphic, { src: "models/podium/prevNext_on.glb" })
                    GltfContainer.createOrReplace(self.teacherControllerGraphic, { src: "models/podium/teacher_selected.glb" })
                    Transform.getMutable(self.controllerEntity).scale = Vector3.create(0.44, 0.33, 1)
                    self.previousButton.show()
                    self.nextButton.show()
                }
                else {
                    if (ClassroomManager.screenManager?.poweredOn == false) {
                        GltfContainer.createOrReplace(self.prevNextButtonsGraphic, { src: "models/podium/prevNext_off.glb" })
                        self.previousButton.hide()
                        self.nextButton.hide()
                    }
                    if (ClassroomManager.classController?.inSession) {
                        GltfContainer.createOrReplace(self.teacherControllerGraphic, { src: "models/podium/teacher_on.glb" })
                    }
                    else {
                        GltfContainer.createOrReplace(self.teacherControllerGraphic, { src: "models/podium/teacher_off.glb" })
                    }
                    Transform.getMutable(self.controllerEntity).scale = Vector3.Zero()
                }
            }
        )

        this.presentationButton = new PodiumButton(
            this.entity,
            Vector3.create(0.43, 1.73, 0.24),
            Quaternion.fromEulerDegrees(0, 0, 45),
            Vector3.create(0.1, 0.05, 0.1),
            "Presentation",
            () => {
                self.hideControllerMenu()
                self.hideInteractionMenu()
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
                self.hideControllerMenu()
                self.hideInteractionMenu()
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
                self.hideControllerMenu()
                self.hideInteractionMenu()
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
                self.hideControllerMenu()
                self.hideInteractionMenu()
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
                self.hideControllerMenu()
                self.hideInteractionMenu()
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

                self.hideControllerMenu()
                self.hideInteractionMenu()
                ClassroomManager.screenManager?.powerToggle()
                if (ClassroomManager.screenManager?.poweredOn) {
                    GltfContainer.createOrReplace(self.prevNextButtonsGraphic, { src: "models/podium/prevNext_on.glb" })
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
                    if (!self.controllerOpen) {
                        GltfContainer.createOrReplace(self.prevNextButtonsGraphic, { src: "models/podium/prevNext_off.glb" })
                        self.previousButton.hide()
                        self.nextButton.hide()
                    }
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
                    self.interactionSelected = false
                }
            }
        )


        //CONTROLLER
        this.controllerEntity = engine.addEntity()
        Transform.create(this.controllerEntity, {
            parent: this.entity,
            position: Vector3.create(0.34, 1.7, -0.06),
            rotation: Quaternion.fromEulerDegrees(45, 90, 0),
            scale: Vector3.Zero()
        })
        MeshRenderer.setPlane(this.controllerEntity)
        Material.setPbrMaterial(this.controllerEntity, {
            albedoColor: Color4.create(0.1, 0.1, 0.1),
            emissiveColor: Color4.create(0.1, 0.1, 0.1),
            emissiveIntensity: 0.5
        })

        this.controllerTitle = engine.addEntity()
        Transform.create(this.controllerTitle, {
            parent: this.controllerEntity,
            position: Vector3.create(0, 0.32, -0.01),
            scale: Vector3.create(0.1, 0.1, 0.1)
        })
        TextShape.create(this.controllerTitle, {
            text: "CLASS SELECTION",
            fontSize: 6,
            textColor: Color4.White()
        })

        this.controllerClassName = engine.addEntity()
        Transform.create(this.controllerClassName, {
            parent: this.controllerEntity,
            position: Vector3.create(0, 0, -0.01),
            scale: Vector3.create(0.1, 0.1, 0.1)
        })
        TextShape.create(this.controllerClassName, {
            text: "",
            fontSize: 5,
            textColor: Color4.White()
        })

        this.controllerStartEndButtonText = engine.addEntity()
        Transform.create(this.controllerStartEndButtonText, {
            parent: this.controllerEntity,
            position: Vector3.create(0, -0.3, -0.02),
            scale: Vector3.create(0.1, 0.1, 0.1)
        })
        TextShape.create(this.controllerStartEndButtonText, {
            text: "Start",
            fontSize: 5,
            textColor: Color4.Black()
        })

        this.controllerStartEndButton = engine.addEntity()
        Transform.create(this.controllerStartEndButton, {
            parent: this.controllerEntity,
            position: Vector3.create(0, -0.3, -0.01),
            scale: Vector3.create(0.3, 0.1, 0.01)
        })
        MeshRenderer.setBox(this.controllerStartEndButton)
        MeshCollider.setBox(this.controllerStartEndButton)
        Material.setPbrMaterial(this.controllerStartEndButton, {
            albedoColor: Color4.Green(),
            emissiveColor: Color4.Green(),
            emissiveIntensity: 0.5
        })
        pointerEventsSystem.onPointerDown(
            {
                entity: this.controllerStartEndButton,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: "click"
                }
            },
            function () {
                if (!ClassroomManager.classController) return

                if (ClassroomManager.classController.inSession) {
                    ClassroomManager.classController.endClass()
                    Material.setPbrMaterial(self.controllerStartEndButton, {
                        albedoColor: Color4.Green(),
                        emissiveColor: Color4.Green(),
                        emissiveIntensity: 0.5
                    })
                    TextShape.getMutable(self.controllerStartEndButtonText).text = "Start"

                    if (ClassroomManager.screenManager?.poweredOn) {
                        ClassroomManager.screenManager?.powerToggle()
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
                        self.interactionSelected = false
                    }
                }
                else {
                    ClassroomManager.classController.startClass()
                    Material.setPbrMaterial(self.controllerStartEndButton, {
                        albedoColor: Color4.Red(),
                        emissiveColor: Color4.Red(),
                        emissiveIntensity: 0.5
                    })
                    TextShape.getMutable(self.controllerStartEndButtonText).text = "End"
                }
            }
        )

        //INTERACTION
        this.interactionEntity = engine.addEntity()
        Transform.create(this.interactionEntity, {
            parent: this.entity,
            position: Vector3.create(0.34, 1.7, -0.06),
            rotation: Quaternion.fromEulerDegrees(45, 90, 0),
            scale: Vector3.Zero()
        })
        MeshRenderer.setPlane(this.interactionEntity)
        Material.setPbrMaterial(this.interactionEntity, {
            albedoColor: Color4.create(0.1, 0.1, 0.1),
            emissiveColor: Color4.create(0.1, 0.1, 0.1),
            emissiveIntensity: 0.5
        })

        this.interactionTitle = engine.addEntity()
        Transform.create(this.interactionTitle, {
            parent: this.interactionEntity,
            position: Vector3.create(0, 0.32, -0.01),
            scale: Vector3.create(0.1, 0.1, 0.1)
        })
        TextShape.create(this.interactionTitle, {
            text: "INTERACTIONS",
            fontSize: 6,
            textColor: Color4.White()
        })

        this.interactionName = engine.addEntity()
        Transform.create(this.interactionName, {
            parent: this.interactionEntity,
            position: Vector3.create(0, 0, -0.01),
            scale: Vector3.create(0.1, 0.1, 0.1)
        })
        TextShape.create(this.interactionName, {
            text: "",
            fontSize: 5,
            textColor: Color4.White()
        })

        this.interactionStartEndButtonText = engine.addEntity()
        Transform.create(this.interactionStartEndButtonText, {
            parent: this.interactionEntity,
            position: Vector3.create(0, -0.3, -0.02),
            scale: Vector3.create(0.1, 0.1, 0.1)
        })
        TextShape.create(this.interactionStartEndButtonText, {
            text: "Start",
            fontSize: 5,
            textColor: Color4.Black()
        })

        this.interactionStartEndButton = engine.addEntity()
        Transform.create(this.interactionStartEndButton, {
            parent: this.interactionEntity,
            position: Vector3.create(0, -0.3, -0.01),
            scale: Vector3.create(0.3, 0.1, 0.01)
        })
        MeshRenderer.setBox(this.interactionStartEndButton)
        MeshCollider.setBox(this.interactionStartEndButton)
        Material.setPbrMaterial(this.interactionStartEndButton, {
            albedoColor: Color4.Green(),
            emissiveColor: Color4.Green(),
            emissiveIntensity: 0.5
        })
        pointerEventsSystem.onPointerDown(
            {
                entity: this.interactionStartEndButton,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: "click"
                }
            },
            function () {
                if (ContentUnitManager.activeUnit) {
                    Material.setPbrMaterial(self.interactionStartEndButton, {
                        albedoColor: Color4.Green(),
                        emissiveColor: Color4.Green(),
                        emissiveIntensity: 0.5
                    })
                    TextShape.getMutable(self.interactionStartEndButtonText).text = "Start"

                    ClassroomManager.EndContentUnit()
                }
                else {
                    Material.setPbrMaterial(self.interactionStartEndButton, {
                        albedoColor: Color4.Red(),
                        emissiveColor: Color4.Red(),
                        emissiveIntensity: 0.5
                    })
                    TextShape.getMutable(self.interactionStartEndButtonText).text = "End"

                    ClassroomManager.StartContentUnit(ClassroomManager.activeContent.contentUnits[self.interactionIndex].key, ClassroomManager.activeContent.contentUnits[self.interactionIndex].data)
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

        engine.addSystem(this.update.bind(this))
    }

    updateButtonGraphics(): void {
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
            console.log("yes")
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

    hideControllerMenu(): void {
        this.controllerOpen = false
        if (ClassroomManager.screenManager?.poweredOn == false) {
            GltfContainer.createOrReplace(this.prevNextButtonsGraphic, { src: "models/podium/prevNext_off.glb" })
            this.previousButton.hide()
            this.nextButton.hide()
        }
        if (ClassroomManager.classController?.inSession) {
            GltfContainer.createOrReplace(this.teacherControllerGraphic, { src: "models/podium/teacher_on.glb" })
        }
        else {
            GltfContainer.createOrReplace(this.teacherControllerGraphic, { src: "models/podium/teacher_off.glb" })
        }
        Transform.getMutable(this.controllerEntity).scale = Vector3.Zero()
    }

    hideInteractionMenu(): void {
        this.interactionSelected = false
        if (ClassroomManager.screenManager?.poweredOn) {
            GltfContainer.createOrReplace(this.interactionButtonGraphic, { src: "models/podium/interactiveContent_on.glb" })
        }
        else {
            GltfContainer.createOrReplace(this.interactionButtonGraphic, { src: "models/podium/interactiveContent_off.glb" })
        }
        Transform.getMutable(this.interactionEntity).scale = Vector3.Zero()
    }

    update(): void {
        if (!ContentUnitManager.activeUnit) {
            Material.setPbrMaterial(this.interactionStartEndButton, {
                albedoColor: Color4.Green(),
                emissiveColor: Color4.Green(),
                emissiveIntensity: 0.5
            })
            TextShape.getMutable(this.interactionStartEndButtonText).text = "Start"
        }
    }
}