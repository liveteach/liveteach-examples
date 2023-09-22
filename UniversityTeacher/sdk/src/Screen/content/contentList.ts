import { ScreenContentType } from "../enums"
import { ScreenContent } from "./screenContent"

export class ContentList {
    content: ScreenContent[] = []
    contentType: ScreenContentType
    index: number = 0

    constructor(_content: ScreenContent[], _contentType: ScreenContentType) {
        this.content = _content
        this.contentType = _contentType
    }

    getContent() {
        return this.content[this.index]
    }

    stop(){
        this.content[this.index].stop()
    }

    next() {
        this.content[this.index].stop()
        this.index++
        if (this.index > this.content.length - 1) {
            this.index = 0
        }
    }

    previous() {
        this.content[this.index].stop()
        this.index--
        if (this.index < 0) {
            this.index = this.content.length - 1
        }
    }

    toStart() {
        this.content[this.index].stop()
        this.index = 0
    }

    toEnd() {
        this.content[this.index].stop()
        this.index = this.content.length - 1
    }
}