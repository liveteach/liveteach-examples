import { ClassController } from "./classroomControllers/classController";
import { ClassControllerFactory, ClassControllerType } from "./factories/classControllerFactory";
import { MessageBus } from '@dcl/sdk/message-bus'
import { SmartContractManager } from "./smartContractManager";
import { StudentClassInfo, StudentExitInfo, StudentJoinInfo } from "./classroom";
import { ClassroomFactory } from "./factories/classroomFactory";

export abstract class ClassroomManager {
    static messageBus: MessageBus
    static classController: ClassController

    static Initialise(): void {
        SmartContractManager.Initialise()

        if (ClassroomManager.messageBus === undefined || ClassroomManager.messageBus === null) {
            ClassroomManager.InitialisePeerToPeer()
        }
    }

    static SetClassController(type: ClassControllerType): void {
        if (ClassroomManager.classController && ClassroomManager.classController.isTeacher() && type === ClassControllerType.TEACHER) {
            ClassroomManager.classController = null
            return
        }

        if (ClassroomManager.classController && ClassroomManager.classController.isStudent() && type === ClassControllerType.STUDENT) {
            ClassroomManager.classController = null
            return
        }

        if (ClassroomManager.classController && ClassroomManager.classController.isTeacher()  && type === ClassControllerType.STUDENT) {
            ClassroomManager.classController.deactivateClassroom()
        }
        ClassroomManager.classController = ClassControllerFactory.Create(type)
    }

    static EmitClassActivation(_info: StudentClassInfo): void {
        ClassroomManager.messageBus.emit('activate_class', _info)
    }

    static EmitClassDeactivation(_info: StudentClassInfo): void {
        ClassroomManager.messageBus.emit('deactivate_class', _info)
    }

    static EmitClassStart(_info: StudentClassInfo): void {
        ClassroomManager.messageBus.emit('start_class', _info)
    }

    static EmitClassEnd(_info: StudentClassInfo): void {
        ClassroomManager.messageBus.emit('end_class', _info)
    }

    static EmitClassJoin(_info: StudentJoinInfo): void {
        ClassroomManager.messageBus.emit('join_class', _info)
    }

    static EmitClassExit(_info: StudentExitInfo): void {
        ClassroomManager.messageBus.emit('exit_class', _info)
    }

    private static InitialisePeerToPeer(): void {
        ClassroomManager.messageBus = new MessageBus()

        ClassroomManager.messageBus.on('activate_class', (info: StudentClassInfo) => {
            if (ClassroomManager.classController && ClassroomManager.classController.isStudent()) {
                let classFound: boolean = false
                for (let i = 0; i < ClassroomManager.classController.contentList.length; i++) {
                    if (ClassroomManager.classController.contentList[i].teacherID == info.teacherID) {
                        ClassroomManager.classController.contentList[i].classID = info.classID
                        ClassroomManager.classController.contentList[i].className = info.className
                        classFound = true
                        console.log("Class updated - " + info.teacherName + " is now teaching " + info.className)
                        break
                    }
                }
                if (!classFound) {
                    ClassroomManager.classController.contentList.push(ClassroomFactory.Create(info))
                    console.log("Class activated - " + info.teacherName + " is teaching " + info.className)
                }
            }
        })

        ClassroomManager.messageBus.on('deactivate_class', (info: StudentClassInfo) => {
            if (ClassroomManager.classController && ClassroomManager.classController.isStudent()) {
                for (let i = 0; i < ClassroomManager.classController.contentList.length; i++) {
                    if (ClassroomManager.classController.contentList[i].teacherID == info.teacherID) {
                        ClassroomManager.classController.contentList.splice(i, 1)
                        if(ClassroomManager.classController.selectedContentIndex == i) {
                            ClassroomManager.classController.selectedContentIndex = Math.max(0, i - 1)
                        }
                        console.log(info.teacherName + " deactivated " + info.className)
                        break
                    }
                }
            }
        })

        ClassroomManager.messageBus.on('start_class', (info: StudentClassInfo) => {
            if (ClassroomManager.classController && ClassroomManager.classController.isStudent()) {
                console.log(info.teacherName + " started teaching " + info.className)
            }
        })

        ClassroomManager.messageBus.on('end_class', (info: StudentClassInfo) => {
            if (ClassroomManager.classController && ClassroomManager.classController.isStudent()) {
                console.log(info.teacherName + " stopped teaching " + info.className)
            }
        })

        ClassroomManager.messageBus.on('join_class', (info: StudentJoinInfo) => {
            if (ClassroomManager.classController && ClassroomManager.classController.isTeacher() && ClassroomManager.classController.contentList[ClassroomManager.classController.selectedContentIndex].teacherID == info.teacherID) {
                console.log(info.studentName + " joined your class")
            }
        })

        ClassroomManager.messageBus.on('exit_class', (info: StudentExitInfo) => {
            if (ClassroomManager.classController && ClassroomManager.classController.isTeacher() && ClassroomManager.classController.contentList[ClassroomManager.classController.selectedContentIndex].teacherID == info.teacherID) {
                console.log(info.studentName + " left your class")
            }
        })
    }
}