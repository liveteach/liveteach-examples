import { ClassroomManager } from "../classroomManager";
import { SmartContractManager } from "../smartContractManager";
import { ClassController } from "./classController";

export class StudentClassController extends ClassController {

    constructor() {
        super()
    }

    override isTeacher(): boolean {
        return false
    }

    override isStudent(): boolean {
        return true
    }

    override isInClass(): boolean {
        return (this.activeClass !== undefined && this.activeClass !== null)
    }

    override joinClass(): void {
        this.activeClass = {
            teacherID: this.classList[this.selectedClassIndex].teacherID,
            teacherName: this.classList[this.selectedClassIndex].teacherName,
            classID: this.classList[this.selectedClassIndex].classID,
            className: this.classList[this.selectedClassIndex].className,
        }
        ClassroomManager.EmitClassJoin({
            studentID: SmartContractManager.blockchain.userData.userId,
            studentName: SmartContractManager.blockchain.userData.displayName,
            teacherID: this.activeClass.teacherID,
            teacherName: this.activeClass.teacherName,
            classID: this.activeClass.classID,
            className: this.activeClass.className
        })
    }

    override exitClass(): void {
        if(this.activeClass) {
            ClassroomManager.EmitClassExit({
                studentID: SmartContractManager.blockchain.userData.userId,
                studentName: SmartContractManager.blockchain.userData.displayName,
                teacherID: this.activeClass.teacherID,
                teacherName: this.activeClass.teacherName,
                classID: this.activeClass.classID,
                className: this.activeClass.className
            })
            this.activeClass = null
        }
    }
}