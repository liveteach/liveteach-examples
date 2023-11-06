import { ReactEcsRenderer } from "@dcl/sdk/react-ecs"
import { seatingUIComponent } from "@dclu/dclu-liveteach/src/seating/ui"
import { Render } from '@dclu/dclu-liveteach/src/setup/ui'

const uiComponent = () => (
    [
      //seatingUIComponent(), // Hide seat UI for now
      Render()
    ]
  )

  export function setupUi() {
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }