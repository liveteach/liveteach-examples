import { StudentCommInfo, TeacherCommInfo } from "../classroom";
import { IClassroomChannel } from "./IClassroomChannel";
import { CommunicationManager } from "./communicationManager";

export class PeerToPeerChannel implements IClassroomChannel{
    emitClassActivation(_info: StudentCommInfo) {
        CommunicationManager.messageBus.emit('activate_class', _info)
    }
    emitClassDeactivation(_info: StudentCommInfo) {
        CommunicationManager.messageBus.emit('deactivate_class', _info)
    }
    emitClassStart(_info: StudentCommInfo) {
        CommunicationManager.messageBus.emit('start_class', _info)
    }
    emitClassEnd(_info: StudentCommInfo) {
        CommunicationManager.messageBus.emit('end_class', _info)
    }
    emitClassJoin(_info: TeacherCommInfo) {
        CommunicationManager.messageBus.emit('join_class', _info)
    }
    emitClassExit(_info: TeacherCommInfo) {
        CommunicationManager.messageBus.emit('exit_class', _info)
    }
}