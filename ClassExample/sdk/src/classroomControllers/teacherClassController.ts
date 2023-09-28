import { executeTask } from "@dcl/sdk/ecs";
import { ClassController } from "./classController";
import { ControllerUI } from "../ui/controllerUI";
import { ClassroomManager } from "../classroomManager";
import { SmartContractManager } from "../smartContractManager";

export class TeacherClassController extends ClassController {
    constructor() {
        super()
    }

    override isTeacher(): boolean {
        return true
    }

    override isStudent(): boolean {
        return false
    }

    override activateClassroom(): void {
        const self = this
        executeTask(async function () {
            try {
                const classroomID = await SmartContractManager.ActicateClassroom("location")
                //TODO: Validate ID
                self.activated = true
                ControllerUI.activationMessage = "activated"
                self.contentList = await SmartContractManager.FetchClassContent()
                self.setClass()
            } catch (error) {
                ControllerUI.activationMessage = error.toString()
            }
        })
    }

    override deactivateClassroom(): void {
        const self = this
        executeTask(async function () {
            try {
                self.activated = false
                ControllerUI.activationMessage = "deactivated"
                ClassroomManager.EmitClassDeactivation({
                    teacherID: self.contentList[self.selectedContentIndex].teacherID,
                    teacherName: self.contentList[self.selectedContentIndex].teacherName,
                    classID: self.contentList[self.selectedContentIndex].classID,
                    className: self.contentList[self.selectedContentIndex].className
                })
            } catch (error) {
                ControllerUI.activationMessage = error.toString()
            }
        })
    }

    override setClass(): void {
        ClassroomManager.EmitClassActivation({
            teacherID: this.contentList[this.selectedContentIndex].teacherID,
            teacherName: this.contentList[this.selectedContentIndex].teacherName,
            classID: this.contentList[this.selectedContentIndex].classID,
            className: this.contentList[this.selectedContentIndex].className
        })
    }

    override startClass(): void {
        const self = this
        executeTask(async function () {
            try {
                const success = await SmartContractManager.StartClassroom()
                if (success) {
                    self.inSession = true
                    ClassroomManager.EmitClassStart({
                        teacherID: this.contentList[this.selectedContentIndex].teacherID,
                        teacherName: this.contentList[this.selectedContentIndex].teacherName,
                        classID: this.contentList[this.selectedContentIndex].classID,
                        className: this.contentList[this.selectedContentIndex].className
                    })
                }
            } catch (error) {

            }
        })
    }

    override endClass(): void {
        const self = this
        executeTask(async function () {
            try {
                self.inSession = false
                ClassroomManager.EmitClassEnd({
                    teacherID: this.contentList[this.selectedContentIndex].teacherID,
                    teacherName: this.contentList[this.selectedContentIndex].teacherName,
                    classID: this.contentList[this.selectedContentIndex].classID,
                    className: this.contentList[this.selectedContentIndex].className
                })
            } catch (error) {

            }
        })
    }
}