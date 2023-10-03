import { UserData } from "~system/UserIdentity"
import { signedFetch } from "~system/SignedFetch"
import { EnvironmentType } from "@vegascity/vegas-city-library/src/core/EnvironmentType"
import { GetCurrentRealmResponse, getCurrentRealm } from "~system/EnvironmentApi";
import { executeTask } from "@dcl/sdk/ecs"
import { Helper } from "@vegascity/vegas-city-library/src/core/Helper"
import { Scene } from "../Scene";

export class VegasCityServerComms {
    static serverUrl: string = "http://localhost:8080"
    private static realm: GetCurrentRealmResponse | null = null
    public static user: UserData
    public static environment: EnvironmentType
    public static instance:VegasCityServerComms

    constructor(user: UserData){
        VegasCityServerComms.serverUrl = this.getServerUrl(Helper.getEnvironmentType())
        VegasCityServerComms.instance = this
        VegasCityServerComms.user = user
    }

    public sendMessage(message: string) {
        let walletAddress: string = VegasCityServerComms.user.publicKey || "GUEST_" + VegasCityServerComms.user.userId
        return executeTask(async ()=>{
            try {
                let reqObj = {
                    classId: "b8b3ca99-87d1-4133-90da-529537ef42c9",
                    message:message,
                    user: walletAddress,
                    guid: Scene.teacherGuid
                }

                let response = await signedFetch({
                    url: VegasCityServerComms.serverUrl +"api/teacher/command", 
                    init:{
                        headers: { "Content-Type": "application/json" },
                        method: "POST",
                        body: JSON.stringify(reqObj)
                    }
                    
                })
                console.log(response)                

            } catch (error) {
                console.log("serverComms.postAnswer() Error "+error)
            }
        })
    }

   

    getServerUrl(_environment: EnvironmentType): string {
        switch (_environment) {
            case EnvironmentType.Localhost:
                return "http://localhost:8080/"
            case EnvironmentType.Test:
                
            case EnvironmentType.Live:
               
            default:
                throw Error("Live server URL is not defined")
        }
    }
}