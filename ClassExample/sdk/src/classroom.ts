export class Classroom {
    teacherID: string
    teacherName: string
    classID: string
    className: string
    capacity: number
    duration: number
    students: StudentInfo[]
}

export type StudentClassInfo = {
    teacherID: string
    teacherName: string
    classID: string
    className: string
}

export type StudentInfo = {
    studentID: string
    studentName: string
}

export type StudentJoinInfo = StudentClassInfo & StudentInfo

export type StudentExitInfo = StudentJoinInfo