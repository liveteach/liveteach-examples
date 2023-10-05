import { ControllerUI } from "@dclu/dclu-liveteach/src/classroom/ui/controllerUI";
import { setupUI } from "./ui";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom/classroomManager";

setupUI()
ClassroomManager.Initialise()
ControllerUI.Show()