import { ReferenceServerController } from "./messaging/ReferenceServerController"
import { GetUserDataResponse, getUserData } from '~system/UserIdentity'
import { Scene } from "./Scene"
import { setupUi } from "./ui"
import { VegasCityServerComms } from "./messaging/VegasCityServerComms"
import { executeTask } from "@dcl/sdk/ecs"
import { UserData } from "~system/Players"

export function main() {
  let userData: GetUserDataResponse | null = null; // Initialize as null

  executeTask(async () => {
    try {
      userData = await getUserData({});
      setupUi();

      // We can simply change the Url here to inject into the ReferenceServerController to use either the Node implementation or Java
      let serverUrl = "ws://localhost:3000" //Node
      //let serverUrl = "ws://localhost:8080/websocket"; //Java

      // Check if userData is not null before accessing its properties
      let userType = userData?.data?.hasConnectedWeb3 ? "teacher" : "student";

      if (userData) {
        const ws = new ReferenceServerController(userData.data, userType, serverUrl);

        //enable servcomms if using java
        const serverComms = new VegasCityServerComms(userData.data,userType);
        new Scene(ws, serverComms);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  });
}