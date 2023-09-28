import { Color4 } from "@dcl/sdk/math"
import ReactEcs, { Button, Label, UiEntity } from "@dcl/sdk/react-ecs"
import { ClassroomManager } from "../classroomManager";
import { ClassControllerType } from "../factories/classControllerFactory";

export class ControllerUI {
    static visibility: boolean = false
    static activationMessage: string = ""

    private static component = () => (
        <UiEntity
            uiTransform={{
                position: { left: '0px', bottom: '380px' },
                height: "240px",
                width: "380px",
                positionType: 'absolute',
                display: ControllerUI.visibility ? 'flex' : 'none'
            }}
            uiBackground={{ color: Color4.create(0, 0, 0, 0.8) }}
        >
            <UiEntity // TEACHER / STUDENT
                uiTransform={{
                    position: { left: "10px", top: "10px" },
                    height: "200px",
                    width: "300px",
                    positionType: 'absolute',
                    display: "flex"
                }}
            >
                <Button
                    value="Teacher"
                    fontSize={18}
                    color={Color4.Black()}
                    variant={ClassroomManager.classController?.isTeacher() ? 'primary' : 'secondary'}
                    uiTransform={{ width: 80, height: 40, margin: 4 }}
                    onMouseDown={() => { ControllerUI.ToggleTeacher() }}
                />
                <Button
                    value="Student"
                    fontSize={18}
                    color={Color4.Black()}
                    variant={ClassroomManager.classController?.isStudent() ? 'primary' : 'secondary'}
                    uiTransform={{ width: 80, height: 40, margin: 4 }}
                    onMouseDown={() => { ControllerUI.ToggleStudent() }}
                />
            </UiEntity>
            <UiEntity // CLASSROOM ACTIVATION
                uiTransform={{
                    position: { left: "10px", top: "60px" },
                    height: "200px",
                    width: "500px",
                    positionType: 'absolute',
                    display: ClassroomManager.classController?.isTeacher() ? "flex" : "none"
                }}
            >
                <Button
                    value="Activate Classroom"
                    fontSize={16}
                    color={Color4.Black()}
                    variant={ClassroomManager.classController?.activated ? 'primary' : 'secondary'}
                    uiTransform={{ width: 160, height: 40, margin: 4 }}
                    onMouseDown={() => { ControllerUI.ToggleActivateClass() }}
                />
                <Label
                    value={ControllerUI.activationMessage}
                    color={ClassroomManager.classController?.activated ? Color4.Green() : Color4.Red()}
                    uiTransform={{ width: 160, height: 40, margin: 4 }}
                    fontSize={16}
                    font="serif"
                    textAlign="top-left"
                />
            </UiEntity>
            <UiEntity // CLASS SELECTION
                uiTransform={{
                    position: { left: "10px", top: "110px" },
                    height: "200px",
                    width: "500px",
                    positionType: 'absolute',
                    display: (ClassroomManager.classController?.isTeacher() && ClassroomManager.classController?.activated) || (ClassroomManager.classController?.isStudent() && ClassroomManager.classController?.contentList?.length > 0) ? "flex" : "none"
                }}
            >
                <Button
                    value="<"
                    fontSize={16}
                    color={Color4.Black()}
                    variant={ControllerUI.CanPrevContent() ? 'primary' : 'secondary'}
                    uiTransform={{ width: 40, height: 40, margin: 4 }}
                    onMouseDown={() => { ControllerUI.PrevContent() }}
                />
                <Button
                    value={ControllerUI.GetSelectedContent()}
                    fontSize={16}
                    color={Color4.Black()}
                    variant='secondary'
                    uiTransform={{ width: 260, height: 40, margin: 4 }}
                />
                <Button
                    value=">"
                    fontSize={16}
                    color={Color4.Black()}
                    variant={ControllerUI.CanNextContent() ? 'primary' : 'secondary'}
                    uiTransform={{ width: 40, height: 40, margin: 4 }}
                    onMouseDown={() => { ControllerUI.NextContent() }}
                />
            </UiEntity>
            <UiEntity // START CLASS / JOIN CLASS
                uiTransform={{
                    position: { left: "10px", top: "160px" },
                    height: "200px",
                    width: "500px",
                    positionType: 'absolute',
                    display: (ClassroomManager.classController?.isTeacher() && ClassroomManager.classController?.activated) || (ClassroomManager.classController?.isStudent() && ClassroomManager.classController?.contentList?.length > 0) ? "flex" : "none"
                }}
            >
                <Button
                    value={ClassroomManager.classController?.isTeacher() ? (ClassroomManager.classController?.inSession ? "End Class" : "Start Class") : (ClassroomManager.classController?.activated ? "Exit Class" : "Join Class")}
                    fontSize={16}
                    color={Color4.Black()}
                    variant={(ClassroomManager.classController?.isTeacher() && ClassroomManager.classController?.inSession) || (ClassroomManager.classController?.isStudent() && ClassroomManager.classController?.activated) ? 'primary' : 'secondary'}
                    uiTransform={{ width: 160, height: 40, margin: 4 }}
                    onMouseDown={() => { ClassroomManager.classController?.isTeacher() ? ControllerUI.ToggleStartClass() : ControllerUI.ToggleJoinClass() }}
                />
            </UiEntity>
        </UiEntity>
    )

    private static GetSelectedContent(): string {
        if (ClassroomManager.classController && ClassroomManager.classController.contentList.length > 0) {
            return ClassroomManager.classController.contentList[ClassroomManager.classController.selectedContentIndex].className
        }
        return ""
    }

    private static CanPrevContent(): boolean {
        if (ClassroomManager.classController && ClassroomManager.classController.selectedContentIndex > 0) {
            return true
        }
        return false
    }

    private static CanNextContent(): boolean {
        if (ClassroomManager.classController && ClassroomManager.classController.selectedContentIndex < ClassroomManager.classController.contentList.length - 1) {
            return true
        }
        return false
    }

    private static PrevContent(): void {
        if (ControllerUI.CanPrevContent()) {
            ClassroomManager.classController.selectedContentIndex--
            if (ClassroomManager.classController?.isTeacher()) {
                ClassroomManager.classController.setClass()
            }
        }
    }

    private static NextContent(): void {
        if (ControllerUI.CanNextContent()) {
            ClassroomManager.classController.selectedContentIndex++
            if (ClassroomManager.classController?.isTeacher()) {
                ClassroomManager.classController.setClass()
            }
        }
    }

    private static ToggleTeacher(): void {
        ClassroomManager.SetClassController(ClassControllerType.TEACHER)
    }

    private static ToggleStudent(): void {
        ClassroomManager.SetClassController(ClassControllerType.STUDENT)
    }

    private static ToggleActivateClass(): void {
        if (ClassroomManager.classController.activated) {
            ClassroomManager.classController.deactivateClassroom()
        }
        else {
            ClassroomManager.classController.activateClassroom()
        }
    }

    private static ToggleStartClass(): void {
        if (ClassroomManager.classController.inSession) {
            ClassroomManager.classController.endClass()
        }
        else {
            ClassroomManager.classController.startClass()
        }
    }

    private static ToggleJoinClass(): void {
        if (ClassroomManager.classController.activated) {
            ClassroomManager.classController.exitClass()
        }
        else {
            ClassroomManager.classController.joinClass()
        }
    }

    static Render() {
        return [
            ControllerUI.component()
        ]
    }

    static Show(): void {
        ControllerUI.visibility = true
    }

    static Hide(): void {
        ControllerUI.visibility = false
    }
}