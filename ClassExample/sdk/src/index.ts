
import { ClassroomManager } from "./classroomManager";
import { ControllerUI } from "./ui/controllerUI";
import { DebugPanel } from "./ui/debugPanel";
import { setupUI } from "./ui/ui";

setupUI() 
ClassroomManager.Initialise()
ControllerUI.Show()
DebugPanel.Show()