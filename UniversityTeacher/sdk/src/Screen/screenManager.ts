import { GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { ImageContent } from "./content/imageContent";
import { ScreenContent } from "./content/screenContent";
import { ScreenDisplay } from "./screenDisplay";
import { Vector3 } from "@dcl/sdk/math";
import { VideoContent } from "./content/videoContent";
import { DisplayPanel } from "./displayPanel";
import { ModelContent } from "./content/modelContent";
import { ScreenContentType } from "./enums";
import { ContentList } from "./content/contentList";
import { Toaster } from "../NotificationSystem/Toaster";
import { Podium } from "../podium";

export class ScreenManager {

    screenDisplays: ScreenDisplay[] = []

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
        if(!this.instance.poweredOn){
            return
        }
        ScreenManager.instance.currentContent.next()
        ScreenManager.instance.playContent()
    }

    static previous() { 
        if(!this.instance.poweredOn){
            return
        }
        ScreenManager.instance.currentContent.previous()
        ScreenManager.instance.playContent() 
    }

    static toStart() {
        if(!this.instance.poweredOn){
            return
        }
        ScreenManager.instance.currentContent.toStart()
        ScreenManager.instance.playContent()
    }

    static toEnd() {
        if(!this.instance.poweredOn){
            return
        }
        ScreenManager.instance.currentContent.toEnd()
        ScreenManager.instance.playContent()
    }

    static showPresentation() {
        if(!this.instance.poweredOn){
            return
        }
        if(ScreenManager.instance.currentContent!=undefined){
            ScreenManager.instance.currentContent.stop()
        }
        ScreenManager.instance.currentContent = ScreenManager.instance.imageContent
        ScreenManager.instance.playContent()
    }

    static showVideo() {
        if(!this.instance.poweredOn){
            return
        }
        if(ScreenManager.instance.currentContent!=undefined){
            ScreenManager.instance.currentContent.stop() 
        }
        ScreenManager.instance.currentContent = ScreenManager.instance.videoContent
        ScreenManager.instance.playContent()
    }

    static showModel() {
        if(!this.instance.poweredOn){
            return
        }
        if(ScreenManager.instance.currentContent!=undefined){
            ScreenManager.instance.currentContent.stop()
        }
        ScreenManager.instance.currentContent = ScreenManager.instance.modelContent
        ScreenManager.instance.playContent()
    }

    static powerToggle(_podium:Podium) {
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
        } else if (!instance.poweredOn){
            ScreenManager.instance.hideContent()
        } else if(instance.poweredOn){
            ScreenManager.instance.unHideContent()
        }

        if(instance.poweredOn){
            GltfContainer.createOrReplace(_podium.entity, { src: "models/podium.glb" })
            _podium.previousButton.show()
            _podium.nextButton.show()
            _podium.endButton.show()
            _podium.startButton.show()
            _podium.presentationButton.show()
            _podium.videoButton.show()
            _podium.modelButton.show()
        } else {
            GltfContainer.createOrReplace(_podium.entity, { src: "models/podium_off.glb" })
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
        this.screenDisplays.forEach(display => {
            display.startContent(this.currentContent.getContent())
        });
    }

    hideContent(){
        this.screenDisplays.forEach(display => {
            display.hideContent()
        });
    }

    unHideContent(){
        this.screenDisplays.forEach(display => {
            display.unHideContent()
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
            new ModelContent({ sourcePath: "models/LessonModels/model1.glb" }),
            new ModelContent({ sourcePath: "models/LessonModels/model2.glb" }),
            new ModelContent({ sourcePath: "models/LessonModels/model3.glb" }),
            new ModelContent({ sourcePath: "models/LessonModels/model4.glb" })
        ], ScreenContentType.model)
    }

    createScreens() {
        new DisplayPanel(Vector3.create(8, 0, 8.1), Vector3.create(0, 180, 0), Vector3.create(1, 1, 1))
        this.screenDisplays.push(new ScreenDisplay(Vector3.create(8, 2.6, 8), Vector3.create(0, 0, 0), Vector3.create(2.84, 2.84, 2.84)))
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
    }
}