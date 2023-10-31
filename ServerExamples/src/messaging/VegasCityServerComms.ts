import { UserData } from "~system/UserIdentity"
import { signedFetch } from "~system/SignedFetch"
import { GetCurrentRealmResponse, getCurrentRealm } from "~system/EnvironmentApi";
import { executeTask } from "@dcl/sdk/ecs"
import { ReferenceServerWebsocketManager } from "@dclu/dclu-liveteach/src/classroom/websocket/ReferenceServerWebsocketManager";
export class VegasCityServerComms {
    static serverUrl: string = "http://localhost:8080/"
    private static realm: GetCurrentRealmResponse | null = null
    public static user: UserData
    private static userType: string
    
    public static instance:VegasCityServerComms

    constructor(user: UserData, userType: string){
        VegasCityServerComms.serverUrl = VegasCityServerComms.serverUrl
        VegasCityServerComms.instance = this
        VegasCityServerComms.user = user
        VegasCityServerComms.userType = userType
        if(userType === "teacher"){
            this.getGuid()
        }
        
    }

    public sendMessage(message: string, topic: string, from: string) {
        let walletAddress: string = VegasCityServerComms.user.publicKey || "GUEST_" + VegasCityServerComms.user.userId
        return executeTask(async ()=>{
            try {
                let reqObj = {
                    classId: "b8b3ca99-87d1-4133-90da-529537ef42c9",
                    message:message,
                    user: walletAddress,
                    guid: ReferenceServerWebsocketManager.guid,
                    topic: topic,
                    from: from
                }

                let response = await signedFetch({
                    url: VegasCityServerComms.serverUrl +"api/" + VegasCityServerComms.userType +"/command", 
                    init:{
                        headers: { "Content-Type": "application/json" },
                        method: "POST",
                        body: JSON.stringify(reqObj)
                    }
                    
                })
                console.log(response)                

            } catch (error) {
                console.log("serverComms.sendMessage() Error "+error)
            }
        })
    }

    public getGuid() {
        let walletAddress: string = VegasCityServerComms.user.publicKey || "GUEST_" + VegasCityServerComms.user.userId
        return executeTask(async ()=>{
            try {
                let response = await signedFetch({
                    url: VegasCityServerComms.serverUrl +"api/teacher/guid?message=" + walletAddress, 
                    init:{
                        headers: { "Content-Type": "application/json" },
                        method: "GET"
                    }
                    
                })
                console.log(response)                
            } catch (error) {
                console.log("serverComms.getGuid() Error "+error)
            }
        })
    }
}