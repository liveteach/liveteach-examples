import { GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { ImageContent } from "./content/imageContent";
import { ScreenContent } from "./content/screenContent";
import { ScreenDisplay } from "./screenDisplay";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { VideoContent } from "./content/videoContent";
import { DisplayPanel } from "./displayPanel";
import { ModelContent } from "./content/modelContent";
import { ScreenContentType } from "./enums";
import { ContentList } from "./content/contentList";
import { Toaster } from "../NotificationSystem/Toaster";
import { Podium } from "../podium";

export class ScreenManager {

    static screenDisplays: ScreenDisplay[] = []

    currentContent: ContentList

    imageContent: ContentList
    videoContent: ContentList
    modelContent: ContentList


    poweredOn: boolean = true

    static instance: ScreenManager

    constructor() {
        this.loadContent()

        this.createScreens()

        engine.addSystem(this.update)

        ScreenManager.instance = this
    }

    static next() {
        if (!this.instance.poweredOn) {
            return
        }
        ScreenManager.instance.currentContent.next()
        ScreenManager.instance.playContent()
    }

    static previous() {
        if (!this.instance.poweredOn) {
            return
        }
        ScreenManager.instance.currentContent.previous()
        ScreenManager.instance.playContent()
    }

    static toStart() {
        if (!this.instance.poweredOn) {
            return
        }
        ScreenManager.instance.currentContent.toStart()
        ScreenManager.instance.playContent()
    }

    static toEnd() {
        if (!this.instance.poweredOn) {
            return
        }
        ScreenManager.instance.currentContent.toEnd()
        ScreenManager.instance.playContent()
    }

    static showPresentation() {
        console.log("show presentation")
        if (!this.instance.poweredOn) {
            return
        }
        if (ScreenManager.instance.currentContent != undefined) {
            ScreenManager.instance.currentContent.stop()
        }
        ScreenManager.instance.currentContent = ScreenManager.instance.imageContent
        ScreenManager.instance.playContent()
    }

    static showVideo() {
        console.log("show video")
        if (!this.instance.poweredOn) {
            return
        }
        if (ScreenManager.instance.currentContent != undefined) {
            ScreenManager.instance.currentContent.stop()
        }
        ScreenManager.instance.currentContent = ScreenManager.instance.videoContent
        ScreenManager.instance.playContent()
    }

    static showModel() {
        console.log("show model")
        if (!this.instance.poweredOn) {
            return
        }
        if (ScreenManager.instance.currentContent != undefined) {
            ScreenManager.instance.currentContent.stop()
        }
        ScreenManager.instance.currentContent = ScreenManager.instance.modelContent
        ScreenManager.instance.playContent()
    }

    static powerToggle(_podium: Podium) {
        let instance = ScreenManager.instance

        instance.poweredOn = !instance.poweredOn

        // When turning on try and find content to auto set to
        if (instance.poweredOn && instance.currentContent == undefined) {
            if (instance.imageContent != undefined) {
                ScreenManager.showPresentation()
            } else if (instance.videoContent != undefined) {
                ScreenManager.showVideo()
            } else if (instance.modelContent != undefined) {
                ScreenManager.showModel()
            }
            ScreenManager.instance.unHideContent()
        } else if (!instance.poweredOn) {
            if (ScreenManager.instance.currentContent != undefined) {
                ScreenManager.instance.currentContent.stop()
            }
            ScreenManager.instance.hideContent()
        } else if (instance.poweredOn) {
            ScreenManager.instance.unHideContent()
        }

        if (instance.poweredOn) {
            GltfContainer.createOrReplace(_podium.buttonsEntity, { src: "models/podium_buttons_on.glb" })
            _podium.previousButton.show()
            _podium.nextButton.show()
            _podium.endButton.show()
            _podium.startButton.show()
            _podium.presentationButton.show()
            _podium.videoButton.show()
            _podium.modelButton.show()
        } else {
            GltfContainer.createOrReplace(_podium.buttonsEntity, { src: "models/podium_buttons_off.glb" })
            _podium.previousButton.hide()
            _podium.nextButton.hide()
            _podium.endButton.hide()
            _podium.startButton.hide()
            _podium.presentationButton.hide()
            _podium.videoButton.hide()
            _podium.modelButton.hide()
        }
    }

    playContent() {
        ScreenManager.screenDisplays.forEach((display,index) => {
            display.startContent(this.currentContent.getContent(),index)
        });
    }

    hideContent() {
        ScreenManager.screenDisplays.forEach((display,index) => {
            display.hideContent(index)
        });
    }

    unHideContent() {
        ScreenManager.screenDisplays.forEach((display,index) => {
            display.unHideContent(index)
        });
    }

    loadContent() {
        this.imageContent = new ContentList([
            new ImageContent({ sourcePath: "images/1.jpg" }),
            new ImageContent({ sourcePath: "images/2.jpg" }),
            new ImageContent({ sourcePath: "images/3.jpg" }),
            new ImageContent({ sourcePath: "images/4.jpg" }),
            new ImageContent({ sourcePath: "images/5.jpg" }),
            new ImageContent({ sourcePath: "images/6.jpg" })
        ], ScreenContentType.image)

        this.videoContent = new ContentList([
            new VideoContent({ sourcePath: "video/pexels-artem-podrez.mp4", ratio: 1.7 }),
            new VideoContent({ sourcePath: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", ratio: 1.7 })
        ], ScreenContentType.video)

        this.modelContent = new ContentList([
            new ModelContent({ sourcePath: "models/LessonModels/cake.glb", modelScale: Vector3.create(0.3, 0.3, 0.3), unique: false, spin: true, spinSpeed: 40 }),
            new ModelContent({ sourcePath: "models/LessonModels/pizza.glb", modelScale: Vector3.create(8, 8, 8), unique: true, overiddenPosition: Vector3.create(8, 8, 8),overiddenRotation: Quaternion.fromEulerDegrees(90,0,180), spin: true, spinSpeed: 4 })
        ], ScreenContentType.model)
    }

    createScreens() {
        new DisplayPanel(Vector3.create(3, 0, 8.1), Vector3.create(0, 180, 0), Vector3.create(0.5, 0.5, 0.5))
        ScreenManager.screenDisplays.push(new ScreenDisplay(Vector3.create(3, 1.3, 8.05), Vector3.create(0, 0, 0), Vector3.create(1.42, 1.42, 1.42), false))

        new DisplayPanel(Vector3.create(8, 0, 8.1), Vector3.create(0, 180, 0), Vector3.create(1, 1, 1))
        ScreenManager.screenDisplays.push(new ScreenDisplay(Vector3.create(8, 2.6, 8), Vector3.create(0, 0, 0), Vector3.create(2.84, 2.84, 2.84), false))

        new DisplayPanel(Vector3.create(13.1, 0, 8.1), Vector3.create(0, 225, 0), Vector3.create(1, 1, 1))
        ScreenManager.screenDisplays.push(new ScreenDisplay(Vector3.create(13, 2.6, 8), Vector3.create(0, 45, 0), Vector3.create(2.84, 2.84, 2.84), false))
    }

    update(_dt: number) {
        let instance = ScreenManager.instance
        if (instance.poweredOn) {
            let content = instance.currentContent.getContent()
            content.update(_dt)
            if (!content.isShowing) {
                instance.currentContent.next()
            }
        }

        ScreenManager.screenDisplays.forEach(display => {
            display.update(_dt)
        });

    } 
}