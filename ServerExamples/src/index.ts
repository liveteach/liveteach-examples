import { GetUserDataResponse, getUserData } from '~system/UserIdentity'
import { setupUi } from "./ui"
import { RestServerComms } from "./messaging/RestServerComms"
import { executeTask } from "@dcl/sdk/ecs"
import { UserData } from "~system/Players"
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom/classroomManager";
import { ServerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/serverChannel"
import { ControllerUI } from '@dclu/dclu-liveteach/src/classroom/ui/controllerUI'

export function main() {
    let userData: GetUserDataResponse | null = null; // Initialize as null
    let serverUrl = "ws://localhost:3000"

   
    executeTask(async () => {
      try {
        userData = await getUserData({});
        setupUi()
        let userType = userData?.data?.hasConnectedWeb3 ? "teacher" : "student";
      
        let config = {
          "classroom": {
              "guid": "382c74c3-721d-4f34-80e5-57657b6cbc27",
              "teacherID": "",
              "teacherName": "",
              "className": "",
              "classDescription": "",
              "location": "classroom_1",
              "capacity": "20",
              "duration": "60",
              "seatingEnabled": true,
              "videoPlaying": false,
              "skybox": "default",
              "displayedImage": {
                  "src": "",
                  "caption": ""
              },
              "displayedVideo": {
                  "src": "",
                  "caption": ""
              },
              "displayedModels": [],
              "students": []
          }
      }

        const communicationChannel = new ServerChannel(userData.data, userType, serverUrl);
        if (userData) {
            ClassroomManager.Initialise(config, communicationChannel, [],[])

            ControllerUI.Show()
            //const serverComms = new RestServerComms(userData.data,userType);
            //new Scene(serverComms)
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    });
  }
