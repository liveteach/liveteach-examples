import * as vc from "@vegascity/vegas-city-library/index"
import * as ecs from "@dcl/sdk/ecs"
import * as sceneData from "../scene.json"
import { Logger } from "@vegascity/vegas-city-logger/dist/logger/Logger"
import { ReferenceServerController } from "./messaging/ReferenceServerController"
import { UserData } from "@vegascity/vegas-city-library/src/core";

import { Scene } from "./Scene"
import { setupUi } from "./ui"
import { VegasCityServerComms } from "./messaging/VegasCityServerComms"

export function main() {
  vc.setup({
    ecs: ecs,
    Logger: Logger
  })

  setupUi()

  vc.core.Helper.setSceneBounds(sceneData)
  
  vc.core.Helper.init(() => {
    vc.core.UserData.getUserData((_userData: vc.core.UserData) => {
      
      // we can simply change the Url here to inject into the ReferenceServerController to use either the Node implementation or Java
        let serverUrl = "ws://localhost:3000" //Node
        //let serverUrl = "ws://localhost:8080/websocket" //Java

        // as this scene is not currently connected to a contract we can define different users based on web3 connection to test locally
        // so a user connected via web3 is a teacher and guests are students
        let userType = UserData.cachedData.hasConnectedWeb3 ? "teacher" : "student"


        const ws = new ReferenceServerController(UserData.cachedData, userType, serverUrl)

        const serverComms = new VegasCityServerComms(UserData.cachedData)

        new Scene(ws, serverComms)

    })
  })
}