import { UserData } from "~system/UserIdentity"
import { signedFetch } from "~system/SignedFetch"
import { GetCurrentRealmResponse, getCurrentRealm } from "~system/EnvironmentApi";
import { executeTask } from "@dcl/sdk/ecs"
import { ReferenceServerWebsocketManager } from "@dclu/dclu-liveteach/src/classroom/websocket/ReferenceServerWebsocketManager";
export class RestServerComms {

    static serverUrl: string = "http://localhost:8080/"
    private static realm: GetCurrentRealmResponse | null = null
    public static user: UserData
    private static userType: string
    
    public static instance:RestServerComms

    constructor(user: UserData, userType: string){
        RestServerComms.serverUrl = RestServerComms.serverUrl
        RestServerComms.instance = this
        RestServerComms.user = user
        RestServerComms.userType = userType
        if(userType === "teacher"){
            RestServerComms.getGuid()
        }
        
    }

    static sendMessage(topic: string, message: string, payload:object,  from: string) {
        let walletAddress: string = RestServerComms.user.publicKey || "GUEST_" + RestServerComms.user.userId
        return executeTask(async ()=>{
            try {
                let reqObj = {
                    classId: "b8b3ca99-87d1-4133-90da-529537ef42c9",
                    message:message,
                    payload: payload,
                    user: walletAddress,
                    guid: ReferenceServerWebsocketManager.guid,
                    topic: topic,
                    from: from
                }

                let response = await signedFetch({
                    url: RestServerComms.serverUrl +"api/" + RestServerComms.userType +"/command", 
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

    static getGuid() {
        let walletAddress: string = RestServerComms.user.publicKey || "GUEST_" + RestServerComms.user.userId
        return executeTask(async ()=>{
            try {
                let response = await signedFetch({
                    url: RestServerComms.serverUrl +"api/teacher/guid?message=" + walletAddress, 
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