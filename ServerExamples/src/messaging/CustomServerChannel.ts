
import { ServerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/serverChannel";
import { UserData } from "~system/UserIdentity";
import { RestServerComms } from "./RestServerComms";
import { ClassContentPacket, ClassPacket, Classroom, StudentCommInfo } from "@dclu/dclu-liveteach/src/classroom/classroomTypes";

export class CustomServerChannel extends ServerChannel{

    constructor(_userData: UserData, role:string,serverUrl: string){
        super(_userData,role,serverUrl)
    }

    emitClassActivation(_info: ClassPacket) {
        RestServerComms.sendMessage("student", "activate_class",_info, "teacher")
    }
    emitClassDeactivation(_info: ClassPacket) {
        RestServerComms.sendMessage("student", "deactivate_class",_info, "teacher")
    }
    emitClassStart(_info: ClassPacket) {
        RestServerComms.sendMessage("student","start_class" ,_info, "teacher")
    }
    emitClassEnd(_info: ClassPacket) {
        RestServerComms.sendMessage("student", "end_class",_info, "teacher")
    }
    emitClassJoin(_info: StudentCommInfo) {
        RestServerComms.sendMessage("teacher", "join_class",_info,"student")
    }
    emitClassExit(_info: StudentCommInfo) {
        RestServerComms.sendMessage("teacher", "exit_class",_info,"student")
    }
    emitClassroomConfig(_info: Classroom) {
        RestServerComms.sendMessage("teacher", "config_class",_info,"student")
    }
    emitImageDisplay(_info: ClassContentPacket) {
        throw new Error("Method not implemented.");
    }
    emitVideoDisplay(_info: ClassContentPacket) {
        throw new Error("Method not implemented.");
    }
    emitModelDisplay(_info: ClassContentPacket) {
        throw new Error("Method not implemented.");
    }
}