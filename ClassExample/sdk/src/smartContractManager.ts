import { ClassroomFactory } from "./factories/classroomFactory"
import { Classroom } from "./classroom"
import { BlockChain } from "./blockchain"
import * as biologyConfig from "./classroomConfigs/biologyConfig.json"
import * as frenchConfig from "./classroomConfigs/frenchConfig.json"
import * as historyConfig from "./classroomConfigs/historyConfig.json"
import * as mathConfig from "./classroomConfigs/mathConfig.json"
import * as physicsConfig from "./classroomConfigs/physicsConfig.json"

export class SmartContractManager {
    private static readonly USE_LOCAL_DATA: boolean = true
    static blockchain: BlockChain

    static Initialise(): void {
        if (SmartContractManager.blockchain === undefined || SmartContractManager.blockchain === null) {
            SmartContractManager.blockchain = new BlockChain()
        }
    }

    static async ActicateClassroom(_location: string): Promise<string> {
        if (!SmartContractManager.blockchain.userData || !SmartContractManager.blockchain.userData.userId) return ""

        if (SmartContractManager.USE_LOCAL_DATA) {
            return "CLASSROOM_ID_TEST"
        }
        else {
            //TODO
            return "NOT_IMPLEMENTED"
        }
    }

    static async FetchClassContent(): Promise<Classroom[]> {
        if (SmartContractManager.USE_LOCAL_DATA) {
            const biologyContent = ClassroomFactory.CreateFromConfig(JSON.stringify(biologyConfig.classroom))
            const frenchContent = ClassroomFactory.CreateFromConfig(JSON.stringify(frenchConfig.classroom))
            const historyContent = ClassroomFactory.CreateFromConfig(JSON.stringify(historyConfig.classroom))
            const mathContent = ClassroomFactory.CreateFromConfig(JSON.stringify(mathConfig.classroom))
            const physicsContent = ClassroomFactory.CreateFromConfig(JSON.stringify(physicsConfig.classroom))
            return [biologyContent, frenchContent, historyContent, mathContent, physicsContent]
        }
        else {
            //TODO
            return []
        }
    }

    static async StartClassroom(): Promise<boolean> {
        if (SmartContractManager.USE_LOCAL_DATA) {
            return true
        }
        else {
            SmartContractManager.blockchain.startClass()
            return false
        }
    }
}