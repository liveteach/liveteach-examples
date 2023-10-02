import { StudentCommInfo, TeacherCommInfo } from "../classroom";

export interface IClassroomChannel {
    emitClassActivation(_info: StudentCommInfo);
    emitClassDeactivation(_info: StudentCommInfo);
    emitClassStart(_info: StudentCommInfo);
    emitClassEnd(_info: StudentCommInfo);
    emitClassJoin(_info: TeacherCommInfo);
    emitClassExit(_info: TeacherCommInfo);
}