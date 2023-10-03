import { EnvironmentType, Helper } from "@vegascity/vegas-city-library/src/core";
import { UserData } from "~system/UserIdentity"
import { GetCurrentRealmResponse } from "~system/EnvironmentApi";
import * as ui from 'dcl-ui-toolkit'
import { DelayedTask } from "@vegascity/vegas-city-library/src/tasks";
import { Scene } from "../Scene";
import { ClickableBoxes } from "../ClickableBoxes";

export class ReferenceServerController {
    
    private serverUrl: string
    private static realm: GetCurrentRealmResponse | null = null
    private user: UserData
    private wallet: string
    webSocket: WebSocket
    public announcement = ui.createComponent(ui.Announcement, { value: "", duration: 2 })

    constructor(_userData: UserData, role:string,serverUrl: string) {
        
        this.serverUrl = serverUrl
        this.user = _userData
        this.wallet = this.user.publicKey || "GUEST_" + this.user.userId

        this.webSocket = new WebSocket(this.serverUrl)

        this.webSocket.onopen = (event) => {

            this.webSocket.send(JSON.stringify({
                "header": {
                    "type": "SUBSCRIBE",
                    "timestamp": new Date().toISOString()
                },
                "body": {
                    "topic": role  // this value will need to be injected depending on the users status "student" or "teacher"
                }
            }))
            console.log("web-socket open?  " + event.type)
        };

        this.webSocket.onmessage = (event) => {
            let message = JSON.parse(event.data)
            console.log("websocket-message : " + event.data)
            this.executeNext(message)
        };

        this.webSocket.onerror = (event) => {
            console.log('web-socket error:', event);
        };

        this.webSocket.onclose = (event) => {
            console.log('web-socket connection closed.');
        };
    }


    public sendCommand(_type: string, topic: string, message: string, from:string) {
        this.webSocket.send(this.getWebSocketMessage(_type, topic, message,from))
    }


    public executeNext(message: any) {
        console.log("new-ws-message : " + JSON.stringify(message))
        switch (message.type) {
            case "guid":
                Scene.teacherGuid = message.data
                this.showMessage(message)
                this.subscribeToTopic(message.data)
            break;
            case "activate_class":
               this.showMessage(message)
            break;
            case "deactivate_class":
                this.showMessage(message)
            break;
            case "start_class":
                this.showMessage(message)
            break;
            case "end_class":
                this.showMessage(message)
            break;
            case "join_class":
                this.showMessage(message)
            break;
            case "exit_class":
                this.showMessage(message)
            break;
            case "log":
                this.showMessage(message)
            break;
        }
    }

    showMessage(msg: string){
        this.announcement.value = JSON.stringify(msg)
        this.announcement.show()
        new DelayedTask(() => {
            this.announcement.hide()
        }, 3)
    }

    getWebSocketMessage(_type: string, topic: string, message: string, from:string): string {

        let msg = {
            "header": {
                "type": _type,
                "timestamp": new Date().toISOString()
            },
            "body": {
                "topic": topic,
                "message": message,
                "from": from,
                "guid": Scene.teacherGuid,
                "wallet": this.wallet
            }
        }
        return JSON.stringify(msg)
    }

    getServerUrl(_environment: EnvironmentType): string {
         
        switch (_environment) {
            case EnvironmentType.Localhost:
                return "ws://localhost:3000" 
            case EnvironmentType.Test:
                return "wss://liveteach.vegascity.cloud/websocket"
            case EnvironmentType.Live:
                return "wss://liveteach.vegascity.cloud/websocket"
            default:
                throw Error("Live server URL is not defined")
        }
    }

    subscribeToTopic(guid:string){
        this.webSocket.send(JSON.stringify({
            "header": {
                "type": "register",
                "timestamp": new Date().toISOString()
            },
            "body": {
                "topic": guid,
                "guid": guid,
                "wallet": this.wallet
            }
        }))
    }

}