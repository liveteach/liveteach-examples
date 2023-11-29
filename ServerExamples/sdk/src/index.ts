import { GetUserDataResponse, getUserData } from '~system/UserIdentity'
import { setupUi } from "./ui"
import { executeTask } from "@dcl/sdk/ecs"
import { UserData } from "~system/Players"
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom/classroomManager";
import { DefaultServerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/DefaultServerChannel"
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
          
          //Is the user the Teacher
        let userType = userData?.data?.publicKey === classroomConfig.classroom.teacherID ? "teacher" : "student";
        
        //setup Server Parameters for the Websocket Server
        let params: ServerParams = {
          serverUrl: serverUrl,
          role: userType
        }

        //Define the Channel to be used
        const communicationChannel = new DefaultServerChannel();
        //Pass in the Server Parameters
        communicationChannel.serverConfig(params)
        // Initialise the Classroom Manager
        ClassroomManager.Initialise(communicationChannel, true)
        ClassroomManager.RegisterClassroom(classroomConfig)   
        //show Control ui for teacher         
        ControllerUI.Show()

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    });
  }
