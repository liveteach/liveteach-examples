import { UserData } from "~system/UserIdentity"
import { signedFetch } from "~system/SignedFetch"
import { GetCurrentRealmResponse, getCurrentRealm } from "~system/EnvironmentApi";
import { executeTask } from "@dcl/sdk/ecs"
import { Scene } from "../Scene";

export class VegasCityServerComms {
    static serverUrl: string = "http://localhost:8080"
    private static realm: GetCurrentRealmResponse | null = null
    public static user: UserData
    
    public static instance:VegasCityServerComms

    constructor(user: UserData){
        VegasCityServerComms.serverUrl = VegasCityServerComms.serverUrl
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

}