import { executeTask } from "@dcl/sdk/ecs";
import { ClassController } from "./classController";
import { ControllerUI } from "../ui/controllerUI";
import { ClassroomManager } from "../classroomManager";
import { SmartContractManager } from "../smartContractManager";

export class TeacherClassController extends ClassController {
    activated: boolean = false

    constructor() {
        super()
    }

    override isTeacher(): boolean {
        return true
    }

    override isStudent(): boolean {
        return false
    }
    
    override isInClass(): boolean {
        return this.activated
    }

    override activateClassroom(): void {
        const self = this
        executeTask(async function () {
            try {
                const classroomID = await SmartContractManager.ActicateClassroom("location")
                //TODO: Validate ID
                self.activated = true
                self.classList = await SmartContractManager.FetchClassContent()
                self.setClass()
                ControllerUI.activationMessage = "activated"
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
                if(self.activeClass) {
                    ClassroomManager.EmitClassDeactivation({
                        teacherID: self.activeClass.teacherID,
                        teacherName: self.activeClass.teacherName,
                        classID: self.activeClass.classID,
                        className: self.activeClass.className
                    })
                    self.activeClass = null
                    ControllerUI.activationMessage = "deactivated"
                }
                else {
                    ControllerUI.activationMessage = ""
                }
            } catch (error) {
                ControllerUI.activationMessage = error.toString()
            }
        })
    }

    override setClass(): void {
        this.activeClass = this.classList[this.selectedClassIndex]
        ClassroomManager.EmitClassActivation({
            teacherID: this.activeClass.teacherID,
            teacherName: this.activeClass.teacherName,
            classID: this.activeClass.classID,
            className: this.activeClass.className
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
                        teacherID: self.activeClass.teacherID,
                        teacherName: self.activeClass.teacherName,
                        classID: self.activeClass.classID,
                        className: self.activeClass.className
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
                    teacherID: self.activeClass.teacherID,
                    teacherName: self.activeClass.teacherName,
                    classID: self.activeClass.classID,
                    className: self.activeClass.className
                })
            } catch (error) {

            }
        })
    }
}