import { Entity, Material, PBVideoPlayer, TextureUnion, VideoPlayer, engine } from "@dcl/sdk/ecs";
import { ScreenContentType } from "../enums";
import { ScreenConfig, ScreenContent } from "./screenContent";

export class VideoContent extends ScreenContent {

    videoEntity: Entity
    videoTexture: TextureUnion

    constructor(_screenConfig:ScreenConfig){
        super(ScreenContentType.video, _screenConfig)

        this.videoEntity = engine.addEntity()

        VideoPlayer.createOrReplace(this.videoEntity, {
            src: _screenConfig.sourcePath,
            playing: false
        })

        this.videoTexture = Material.Texture.Video({ videoPlayerEntity: this.videoEntity })
    }

    play() {
        throw new Error("Method not implemented.");
    }
    stop() {
        VideoPlayer.getMutable(this.videoEntity).playing = false
        this.isShowing = false
    }
    pause() {
        throw new Error("Method not implemented.");
    }

    update(_dt:number){
        super.update(_dt)
    }

}