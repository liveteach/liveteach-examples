import { Color4 } from "@dcl/sdk/math";
import { ScreenContentType } from "../enums";

export type ScreenConfig = Partial<ScreenConfigType>;
export type ScreenConfigType = {
    sourcePath:string // Path to audio, images and video be it internal or external

    length: number // Length in miliseconds to show/play content for. -1 is endless.

    ratio: number // Increases width by ratio amount for different sized content

    // Text content
    text: string // The text that will appear on the screen
    textSize: number // Size of font used on the screen
    textColour:Color4 // Color of font used on the screen
}

export abstract class ScreenContent {
    configuration: ScreenConfig
    currentLength:number = 0
    isShowing:boolean = false
    isCompleted:boolean = false
    contentType: ScreenContentType;

    constructor(_contentType:ScreenContentType, _screenConfig:ScreenConfig){
        this.contentType = _contentType
        this.configuration = _screenConfig
    }

    abstract play();

    abstract stop();

    abstract pause();


    update(_dt:number){
        if(this.configuration.length!=-1 && this.isShowing && !this.isCompleted){
            // Length isn't unlimited so time how long this is displayed for
            this.currentLength+=_dt
            if(this.currentLength>=this.configuration.length){
                this.isCompleted = true
                this.stop()
                this.currentLength = 0
            }
        }
    }
        
}