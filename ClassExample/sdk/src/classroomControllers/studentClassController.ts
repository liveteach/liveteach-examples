import { ClassroomManager } from "../classroomManager";
import { SmartContractManager } from "../smartContractManager";
import { ClassController } from "./classController";

export class StudentClassController extends ClassController {

    constructor() {
        super()
    }

    override isTeacher() : boolean {
        return false
    }

    override isStudent() : boolean {
        return true
    }

    override joinClass() : void {
        this.activated = true
        ClassroomManager.EmitClassJoin({
            studentID: SmartContractManager.blockchain.userData.userId,
            studentName: SmartContractManager.blockchain.userData.displayName,
            teacherID: this.contentList[this.selectedContentIndex].teacherID,
            teacherName: this.contentList[this.selectedContentIndex].teacherName,
            classID: this.contentList[this.selectedContentIndex].classID,
            className: this.contentList[this.selectedContentIndex].className
        })
    }

    override exitClass() : void {
        this.activated = false
        ClassroomManager.EmitClassExit({
            studentID: SmartContractManager.blockchain.userData.userId,
            studentName: SmartContractManager.blockchain.userData.displayName,
            teacherID: this.contentList[this.selectedContentIndex].teacherID,
            teacherName: this.contentList[this.selectedContentIndex].teacherName,
            classID: this.contentList[this.selectedContentIndex].classID,
            className: this.contentList[this.selectedContentIndex].className
        })
    }
}