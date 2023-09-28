import { Classroom } from "../classroom"

export abstract class ClassController {
    inSession: boolean = false
    activated: boolean = false
    contentList: Classroom[] = []
    selectedContentIndex: number = 0

    constructor() {

    }

    isTeacher(): boolean {
        return false
    }

    isStudent(): boolean {
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