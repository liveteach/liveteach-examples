import { ScreenContentType } from "../enums";
import { ScreenConfig, ScreenContent } from "./screenContent";

export class ModelContent extends ScreenContent {

    
    constructor(_screenConfig:ScreenConfig){
        super(ScreenContentType.model, _screenConfig)
    }

    play() {
        throw new Error("Method not implemented.");
    }
    stop() {
        this.isShowing = false
    }
    pause() {
        throw new Error("Method not implemented.");
    }

    update(_dt:number){
        super.update(_dt)
    }

} 