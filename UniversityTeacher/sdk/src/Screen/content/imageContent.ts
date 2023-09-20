import { ScreenContentType } from "../enums";
import { ScreenConfig, ScreenContent } from "./screenContent";

export class ImageContent extends ScreenContent {

    constructor(_screenConfig:ScreenConfig){
        super(ScreenContentType.image, _screenConfig)
    }

    play() {
        throw new Error("Method not implemented.");
    }
    stop() {
        this.isCompleted = true
    }
    pause() {
        throw new Error("Method not implemented.");
    }

    update(_dt:number){
        super.update(_dt)
    }

}