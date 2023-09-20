import { engine } from "@dcl/sdk/ecs";
import { ImageContent } from "./content/imageContent";
import { ScreenConfig, ScreenContent } from "./content/screenContent";
import { ScreenDisplay } from "./screenDisplay";
import { Vector3 } from "@dcl/sdk/math";
import { VideoContent } from "./content/videoContent";
import { DisplayPanel } from "./displayPanel";

export class ScreenManager {

    screenDisplays: ScreenDisplay[] = []

    currentContentIndex: number = 0
    screenContent: ScreenContent[] = []

    static instance

    constructor(){
        this.loadContent()

        this.createScreens()

        this.playContent()

        engine.addSystem(this.update)

        ScreenManager.instance = this
    }

    static next(){
        ScreenManager.instance.screenContent[ScreenManager.instance.currentContentIndex].stop()
        ScreenManager.instance.currentContentIndex+=1
        if(ScreenManager.instance.currentContentIndex>ScreenManager.instance.screenContent.length-1){
            ScreenManager.instance.currentContentIndex = 0
        }
        ScreenManager.instance.playContent()
    }

    static previous(){
        ScreenManager.instance.screenContent[ScreenManager.instance.currentContentIndex].stop()
        ScreenManager.instance.currentContentIndex-=1
        if(ScreenManager.instance.currentContentIndex<0){
            ScreenManager.instance.currentContentIndex = ScreenManager.instance.screenContent.length-1
        }
        ScreenManager.instance.playContent()
    }

    static toStart(){
        ScreenManager.instance.currentContentIndex = 0
        ScreenManager.instance.playContent()
    }

    static toEnd(){
        ScreenManager.instance.currentContentIndex = ScreenManager.instance.screenContent.length-1
        ScreenManager.instance.playContent()
    }

    playContent(){
        this.screenDisplays.forEach(display => {
            display.startContent(this.screenContent[this.currentContentIndex])
        });
    }

    loadContent(){
        this.screenContent.push(new ImageContent({sourcePath: "images/1.jpg",length:-1}))
        this.screenContent.push(new VideoContent({sourcePath: "video/pexels-artem-podrez.mp4",length:-1, ratio:1.7}))
        this.screenContent.push(new ImageContent({sourcePath: "images/2.jpg",length:-1}))
        this.screenContent.push(new ImageContent({sourcePath: "images/3.jpg",length:-1}))
        this.screenContent.push(new ImageContent({sourcePath: "images/4.jpg",length:-1}))
        this.screenContent.push(new ImageContent({sourcePath: "images/5.jpg",length:-1}))
        this.screenContent.push(new ImageContent({sourcePath: "images/6.jpg",length:-1}))
    }

    createScreens(){
        new DisplayPanel(Vector3.create(8,0,8.1),Vector3.create(0,180,0),Vector3.create(1,1,1))
        this.screenDisplays.push(new ScreenDisplay(Vector3.create(8,2.6,8),Vector3.create(0,0,0),Vector3.create(2.84,2.84,2.84)))
    }

    update(_dt:number){ 
        let instance = ScreenManager.instance
        let content = instance.screenContent[instance.currentContentIndex]
        content.update(_dt)
        if(content.isCompleted && content.isShowing){ 
            content.isCompleted = false
            content.isShowing = false
            instance.currentContentIndex+=1
            if(instance.currentContentIndex>instance.screenContent.length-1){
                instance.currentContentIndex = 0
            }
            instance.playContent()
        }
    }
}