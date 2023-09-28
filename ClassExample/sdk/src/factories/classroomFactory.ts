import { Classroom, StudentClassInfo } from "../classroom";
import { SmartContractManager } from "../smartContractManager";

export abstract class ClassroomFactory {
    static CreateFromConfig(_config: string) : Classroom {
        let classroom: Classroom = Object.assign(new Classroom(), JSON.parse(_config))
        classroom.teacherID = SmartContractManager.blockchain.userData.userId
        classroom.teacherName = SmartContractManager.blockchain.userData.displayName
        classroom.students = []
        return classroom
    }

    static Create(_info: StudentClassInfo) : Classroom {
        let classroom = new Classroom()
        classroom.teacherID = _info.teacherID ?? ""
        classroom.teacherName = _info.teacherName ?? ""
        classroom.classID = _info.classID ?? ""
        classroom.className = _info.className ?? ""
        classroom.students = []
        return classroom
    }
}