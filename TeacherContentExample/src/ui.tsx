import { ReactEcsRenderer } from "@dcl/sdk/react-ecs"
import { Render } from '@dclu/dclu-liveteach/src/setup/ui'

const uiComponent = () => (
    [
      Render()
    ]
  )

  export function setupUi() {
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }