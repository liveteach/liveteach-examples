export class Classroom {
    teacherID: string
    teacherName: string
    classID: string
    className: string
    capacity: number
    duration: number
}

export type StudentClassInfo = {
    teacherID: string
    teacherName: string
    classID: string
    className: string
}

export type StudentJoinInfo = StudentClassInfo & {
    studentID: string
    studentName: string
}

export type StudentExitInfo = StudentJoinInfo