import { Color4 } from "@dcl/sdk/math"
import ReactEcs, { UiEntity } from "@dcl/sdk/react-ecs"

export class DebugPanel {
    static visibility: boolean = false

    private static component = () => (
        <UiEntity
            uiTransform={{
                position: { left: '0px', bottom: '380px' },
                height: "240px",
                width: "380px",
                positionType: 'absolute',
                display: DebugPanel.visibility ? 'flex' : 'none'
            }}
            uiBackground={{ color: Color4.create(0, 0, 0, 0.8) }}
        >
        </UiEntity>
    )

    static Render() {
        return [
            DebugPanel.component()
        ]
    }

    static Show(): void {
        DebugPanel.visibility = true
    }

    static Hide(): void {
        DebugPanel.visibility = false
    }
}