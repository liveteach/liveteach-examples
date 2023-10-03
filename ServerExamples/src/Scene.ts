import { InputAction, MeshCollider, MeshRenderer, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { ReferenceServerController } from "./messaging/ReferenceServerController";
import { VegasCityServerComms } from "./messaging/VegasCityServerComms";
import { ClickableBoxes } from "./ClickableBoxes";
import { DelayedTask } from "@vegascity/vegas-city-library/src/tasks";

export class Scene{

    public static teacherGuid: string = "student"

    constructor(ws:ReferenceServerController, serverComms:VegasCityServerComms){

        //students
            new ClickableBoxes(ws,serverComms, "join_class", "teacher", "Join Class\n Student",Vector3.create(4,1,8), "student")
            new ClickableBoxes(ws,serverComms, "exit_class", "teacher", "Exit Class\n Student",Vector3.create(5,1,8), "student")

        //teacher
        new DelayedTask(() => {
            new ClickableBoxes(ws,serverComms, "activate_class", "student", "Activate Class\n Teacher",Vector3.create(6,1,8), "teacher")
            new ClickableBoxes(ws,serverComms, "deactivate_class", "student", "Deactivate Class\n Teacher",Vector3.create(7,1,8), "teacher")
            new ClickableBoxes(ws,serverComms, "start_class", "student", "Start Class\n Teacher",Vector3.create(8,1,8), "teacher")
            new ClickableBoxes(ws,serverComms, "end_class", "student", "End Class\n Teacher",Vector3.create(9,1,8), "teacher")
        }, 5)
       
    }
}