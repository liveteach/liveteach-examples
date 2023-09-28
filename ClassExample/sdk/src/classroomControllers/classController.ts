import { Classroom, StudentClassInfo } from "../classroom"

export abstract class ClassController {
    inSession: boolean = false
    classList: Classroom[] = []
    selectedClassIndex: number = 0
    activeClass: Classroom | StudentClassInfo = null

    constructor() {

    }

    isTeacher(): boolean {
        return false
    }

    isStudent(): boolean {
        return false
    }

    isInClass(): boolean {
        return false
    }

    activateClassroom(): void { }
    deactivateClassroom(): void { }
    setClass(): void { }
    fetchClassroomContent(): void { }
    startClass(): void { }
    endClass(): void { }
    joinClass(): void { }
    exitClass(): void { }
}