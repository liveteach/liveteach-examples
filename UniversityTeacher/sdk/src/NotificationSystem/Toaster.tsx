import { UiCanvasInformation, engine } from "@dcl/sdk/ecs"
import { Color4 } from "@dcl/sdk/math"
import ReactEcs, { Label, PositionUnit, UiEntity } from "@dcl/sdk/react-ecs"
import { AudioManager } from "./../audioManager"
import * as utils from '@dcl-sdk/utils'

export class Toaster {

    static message: string = ""

    static growingToast: boolean = false
    static toastGrowSpeed:number = 500
    static toastShrinkSpeed:number = 200
    static maxToastHeight: number = 50
    static minToastHeight: number = -150
    static currentToastHeight: number = Toaster.minToastHeight

    static toastHasToasted: boolean = false

    constructor() { 
        engine.addSystem(this.update) 
    }

    update(dt: number) {
        if(Toaster.growingToast){
            Toaster.currentToastHeight+= dt * Toaster.toastGrowSpeed
            if(Toaster.currentToastHeight > Toaster.maxToastHeight){
                Toaster.currentToastHeight = Toaster.maxToastHeight
            }
        } else {
            Toaster.currentToastHeight-= dt * Toaster.toastShrinkSpeed
            if(Toaster.currentToastHeight<=Toaster.minToastHeight){
                Toaster.currentToastHeight= Toaster.minToastHeight
            }
        }

        console.log(Toaster.currentToastHeight)

    }

    static popToast(_text: string) {
        Toaster.message = _text
        Toaster.growingToast = true

        utils.timers.setTimeout(() => {
            AudioManager.playNotification()
        },250)

        utils.timers.setTimeout(() => {
            Toaster.hideToast()
        },4000) 
    }

    static hideToast() {
        Toaster.growingToast = false
    }

}



export const ToastUI = () => (
    <UiEntity
        key={"toastContainer"}
        uiTransform={{
            positionType: "absolute",
            width: "100%",
            justifyContent: 'center',
            position: { bottom: Toaster.currentToastHeight }
        }}
    >
        <UiEntity
            key={"toastSubContainer"}
            uiTransform={{
                position: { bottom: 0 },
                width: 400,
                height: 150,
                justifyContent: 'center',
            }}
            uiBackground={{
                textureMode: 'nine-slices',
                texture: { src: "images/ui/notificationBackgroundSmall.png" },
                textureSlices: {
                    top: 0.5,
                    bottom: 0.5,
                    left: 0.5,
                    right: 0.5
                }
            }}
        >
        <Label
            key={"toastMessage"}
            value={Toaster.message}
            color={Color4.fromInts(255, 255, 255, 255)}
            fontSize={24}
            font="serif"
            //textAlign="middle-center"
        >
        </Label>
        </UiEntity>
    </UiEntity>
)