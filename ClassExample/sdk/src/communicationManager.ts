import { MessageBus } from "@dcl/sdk/message-bus"
import { ClassroomManager } from "./classroomManager"
import { DebugPanel } from "./ui/debugPanel"
import { TeacherClassroom, StudentClassroom, TeacherCommInfo, StudentCommInfo } from "./classroom"
import { ClassroomFactory } from "./factories/classroomFactory"
import { Color4 } from "@dcl/sdk/math"
import { ClassMemberData } from "./classMemberData"

export class CommunicationManager {
    static messageBus: MessageBus

    static Initialise(): void {
        if (CommunicationManager.messageBus === undefined || CommunicationManager.messageBus === null) {
            CommunicationManager.messageBus = new MessageBus()

            CommunicationManager.messageBus.on('activate_class', (info: StudentCommInfo) => {
                if (ClassroomManager.classController && ClassroomManager.classController.isStudent()) {
                    let classFound: boolean = false
                    for (let i = 0; i < ClassroomManager.classController.classList.length; i++) {
                        if (ClassroomManager.classController.classList[i].teacherID == info.teacherID) {
                            ClassroomManager.classController.classList[i].classID = info.classID
                            ClassroomManager.classController.classList[i].className = info.className
                            classFound = true
                            console.log("Class updated - " + info.teacherName + " is now teaching " + info.className)
                            break
                        }
                    }
                    if (!classFound) {
                        ClassroomManager.classController.classList.push(ClassroomFactory.CreateStudentClassroom(info))
                        console.log("Class activated - " + info.teacherName + " is teaching " + info.className)
                    }
                }
            })

            CommunicationManager.messageBus.on('deactivate_class', (info: StudentCommInfo) => {
                if (ClassroomManager.classController && ClassroomManager.classController.isStudent()) {
                    for (let i = 0; i < ClassroomManager.classController.classList.length; i++) {
                        if (ClassroomManager.classController.classList[i].teacherID == info.teacherID) {
                            ClassroomManager.classController.classList.splice(i, 1)
                            if (ClassroomManager.classController.selectedClassIndex == i) {
                                ClassroomManager.classController.selectedClassIndex = Math.max(0, i - 1)
                            }
                            console.log(info.teacherName + " deactivated " + info.className)
                            break
                        }
                    }
                }
            })

            CommunicationManager.messageBus.on('start_class', (info: StudentCommInfo) => {
                if (ClassroomManager.classController && ClassroomManager.classController.isStudent() && ClassroomManager.activeClassroom && ClassroomManager.activeClassroom.teacherID == info.teacherID) {
                    console.log(info.teacherName + " started teaching " + info.className)
                }
            })

            CommunicationManager.messageBus.on('end_class', (info: StudentCommInfo) => {
                if (ClassroomManager.classController && ClassroomManager.classController.isStudent() && ClassroomManager.activeClassroom && ClassroomManager.activeClassroom.teacherID == info.teacherID) {
                    console.log(info.teacherName + " stopped teaching " + info.className)
                }
            })

            CommunicationManager.messageBus.on('join_class', (info: TeacherCommInfo) => {
                if (ClassroomManager.classController && ClassroomManager.classController.isTeacher() && ClassroomManager.activeClassroom && ClassroomManager.activeClassroom.teacherID == info.teacherID) {
                    (ClassroomManager.activeClassroom as TeacherClassroom).students.push({
                        studentID: info.studentID,
                        studentName: info.studentName
                    })
                    console.log(info.studentName + " joined your class")
                }
                else if (ClassroomManager.classController && ClassroomManager.classController.isStudent() && ClassroomManager.activeClassroom && ClassroomManager.activeClassroom.teacherID == info.teacherID && ClassMemberData.GetUserId() != info.studentID) {
                    console.log(info.studentName + " joined the class")
                }
            })

            CommunicationManager.messageBus.on('exit_class', (info: TeacherCommInfo) => {
                if (ClassroomManager.classController && ClassroomManager.classController.isTeacher() && ClassroomManager.activeClassroom && ClassroomManager.activeClassroom.teacherID == info.teacherID) {
                    for (let i = 0; i < (ClassroomManager.activeClassroom as TeacherClassroom).students.length; i++) {
                        if ((ClassroomManager.activeClassroom as TeacherClassroom).students[i].studentID == info.studentID) {
                            (ClassroomManager.activeClassroom as TeacherClassroom).students.splice(i, 1)
                            console.log(info.studentName + " left your class")
                            break
                        }
                    }
                }
                else if (ClassroomManager.classController && ClassroomManager.classController.isStudent() && ClassroomManager.activeClassroom && ClassroomManager.activeClassroom.teacherID == info.teacherID && ClassMemberData.GetUserId() != info.studentID) {
                    console.log(info.studentName + " left the class")
                }
            })

            CommunicationManager.messageBus.on('log', (info: any) => {
                DebugPanel.LogClassEvent(info.message, info.color, info.isTeacher)
            })
        }
    }

    static EmitClassActivation(_info: StudentCommInfo): void {
        CommunicationManager.messageBus.emit('activate_class', _info)
        CommunicationManager.EmitLog(_info.teacherName + " activated class " + _info.className, Color4.Yellow(), ClassroomManager.classController?.isTeacher())
    }

    static EmitClassDeactivation(_info: StudentCommInfo): void {
        CommunicationManager.messageBus.emit('deactivate_class', _info)
    }

    static EmitClassStart(_info: StudentCommInfo): void {
        CommunicationManager.messageBus.emit('start_class', _info)
    }

    static EmitClassEnd(_info: StudentCommInfo): void {
        CommunicationManager.messageBus.emit('end_class', _info)
    }

    static EmitClassJoin(_info: TeacherCommInfo): void {
        CommunicationManager.messageBus.emit('join_class', _info)
    }

    static EmitClassExit(_info: TeacherCommInfo): void {
        CommunicationManager.messageBus.emit('exit_class', _info)
    }

    static EmitLog(_message: string, _color: Color4, _isTeacher: boolean): void {
        CommunicationManager.messageBus.emit('log', {
            message: _message,
            color: _color,
            isTeacher: _isTeacher
        })
    }
}