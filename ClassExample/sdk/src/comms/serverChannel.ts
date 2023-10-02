import { StudentCommInfo, TeacherCommInfo } from "../classroom";
import { IClassroomChannel } from "./IClassroomChannel";

export class ServerChannel implements IClassroomChannel{
    emitClassActivation(_info: StudentCommInfo) {
        throw new Error("Method not implemented.");
    }
    emitClassDeactivation(_info: StudentCommInfo) {
        throw new Error("Method not implemented.");
    }
    emitClassStart(_info: StudentCommInfo) {
        throw new Error("Method not implemented.");
    }
    emitClassEnd(_info: StudentCommInfo) {
        throw new Error("Method not implemented.");
    }
    emitClassJoin(_info: TeacherCommInfo) {
        throw new Error("Method not implemented.");
    }
    emitClassExit(_info: TeacherCommInfo) {
        throw new Error("Method not implemented.");
    }
}