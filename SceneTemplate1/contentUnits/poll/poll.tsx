import { Color4 } from "@dcl/sdk/math";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom";
import { IContentUnit } from "@dclu/dclu-liveteach/src/contentUnits";
import *  as  ui from 'dcl-ui-toolkit'

export class Poll implements IContentUnit {
    title: string = ""
    options: string[] = []
    selectedIndex: number = -1
    votedIndex: number = -1

    pollPrompt?: ui.CustomPrompt
    submitButton: any
    optionButtons: any[] = []
    optionButtonsSelected: any[] = []

    votes: number[] = []
    voteLabels: any[] = []

    constructor() { }

    start(_data: any): void {
        this.title = _data.title
        this.options = _data.options
        this.selectedIndex = -1
        this.votedIndex = -1
        this.optionButtons.splice(0)
        this.optionButtonsSelected.splice(0)
        this.votes.splice(0)
        this.voteLabels.splice(0)

        for (let i = 0; i < this.options.length; i++) {
            this.votes.push(0)
        }

        this.setupUI()
    }
    end(): void {
        this.pollPrompt.hide()
    }
    update(_data: any): void {
        const isStudent = ClassroomManager.classController?.isStudent()
        if (isStudent) {
            if (this.votedIndex >= 0) {
                for (let i = 0; i < this.options.length; i++) {
                    this.votes[i] = _data[i]
                    this.voteLabels[i].value = this.votes[i]
                }
            }
        }
        else {
            this.votes[_data]++
            this.voteLabels[_data].value = this.votes[_data]
            ClassroomManager.SendContentUnitData(this.votes)
        }
    }

    private setupUI(): void {
        const isStudent = ClassroomManager.classController?.isStudent()
        const height: number = (isStudent ? 150 : 100) + (this.options.length * 55)
        const startY: number = (height / 2) - 20
        this.pollPrompt = ui.createComponent(ui.CustomPrompt, {
            style: ui.PromptStyles.DARK,
            height: height,
            onClose: () => {
                if (!isStudent) {
                    ClassroomManager.EndContentUnit()
                }
            }
        })

        if (isStudent) {
            this.pollPrompt.closeIcon.width = 0
            this.pollPrompt.closeIcon.height = 0
        }

        //Title
        this.pollPrompt.addText({
            value: this.title,
            xPosition: 0,
            yPosition: startY,
            color: Color4.White(),
            size: 25,
        })

        //Options
        this.options.forEach((option, index) => {
            const promptButton = this.pollPrompt.addButton({
                style: ui.ButtonStyles.SQUAREBLACK,
                text: option,
                xPosition: 90,
                yPosition: startY - 70 - (index * 55),
                onMouseDown: () => {
                    if (isStudent && this.votedIndex < 0) {
                        this.select(index)
                    }
                },
            })
            if(promptButton.imageElement.uiTransform) promptButton.imageElement.uiTransform.width = 350

            const promptButtonSelected = this.pollPrompt.addButton({
                style: ui.ButtonStyles.SQUAREWHITE,
                text: option,
                xPosition: 90,
                yPosition: startY - 70 - (index * 55),
                onMouseDown: () => {
                    if (isStudent && this.votedIndex < 0) {
                        this.select(index)
                    }
                },
            })
            if(promptButtonSelected.imageElement.uiTransform) promptButtonSelected.imageElement.uiTransform.width = 350
            promptButtonSelected.hide()

            this.optionButtons.push(promptButton)
            this.optionButtonsSelected.push(promptButtonSelected)

            //Vote Labels
            const voteLabel = this.pollPrompt.addText({
                value: isStudent ? '' : this.votes[index],
                xPosition: 148,
                yPosition: startY - 63 - (index * 55),
                size: 25,
                color: Color4.Green()
            })
            this.voteLabels.push(voteLabel)
        })

        //Submit
        if (isStudent) {
            this.submitButton = this.pollPrompt.addButton({
                style: ui.ButtonStyles.RED,
                text: 'Submit',
                xPosition: 0,
                yPosition: startY - 80 - (this.options.length * 55),
                onMouseDown: () => {
                    if (this.votedIndex < 0) {
                        this.vote()
                    }
                },
            })
            this.submitButton.show()
        }

        this.pollPrompt.show()
    }

    private select(_index: number): void {
        this.unselectAll()

        this.selectedIndex = (this.selectedIndex == _index) ? -1 : _index
        if (this.selectedIndex == _index) {
            this.optionButtons[_index].hide()
            this.optionButtonsSelected[_index].show()
        }
        else {
            this.optionButtons[_index].show()
            this.optionButtonsSelected[_index].hide()
        }
    }

    private unselectAll(): void {
        for (let i = 0; i < this.optionButtons.length; i++) {
            this.optionButtons[i].show()
            this.optionButtonsSelected[i].hide()
        }
    }

    private vote(): void {
        this.votedIndex = this.selectedIndex
        if (this.votedIndex >= 0) {
            this.submitButton.hide()
            ClassroomManager.SendContentUnitData(this.votedIndex)
        }
    }
}