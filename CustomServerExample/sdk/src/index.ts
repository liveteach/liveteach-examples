import { GetUserDataResponse, getUserData } from '~system/UserIdentity'
import { setupUi } from "./ui"
import { executeTask } from "@dcl/sdk/ecs"
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom/classroomManager";
import { CustomServerChannel } from './CustomServerChannel';
import { ControllerUI } from '@dclu/dclu-liveteach/src/classroom/ui/controllerUI'

import * as classroomConfig from "./classroomConfigs/classroomConfig.json"
import * as dclu from '@dclu/dclu-liveteach'
import * as ecs from "@dcl/sdk/ecs"
import { ServerParams } from '@dclu/dclu-liveteach/src/classroom/types/classroomTypes';

export function main() {
  let userData: GetUserDataResponse | null = null; // Initialize as null

  // Define the Url for the Webscoket Server
  let serverUrl = "ws://localhost:3000"

  // Setup the DCLU package
  dclu.setup({
    ecs: ecs,
    Logger: null
  })

  //setup the User Interface
  setupUi()

  executeTask(async () => {

    try {

      userData = await getUserData({});

      //setup Server Parameters for the Websocket Server
      let params: ServerParams = {
        serverUrl: serverUrl,
        wallet: userData?.data?.publicKey || 'GUEST' + userData.data?.userId
      }

      //Define the Channel to be used Using the Custom ServerChannel Class
      const communicationChannel = new CustomServerChannel();
      //Pass in the Server Parameters
      communicationChannel.serverConfig(params)
      // Initialise the Classroom Manager
      ClassroomManager.Initialise(communicationChannel, undefined, undefined, true)
      ClassroomManager.RegisterClassroom(classroomConfig)
      //show Control ui for teacher         
      ControllerUI.Show()

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  });
}
