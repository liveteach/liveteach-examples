import { ReactEcsRenderer } from "@dcl/sdk/react-ecs"
import { ToastUI } from "./NotificationSystem/Toaster"
import { Render } from '@dclu/dclu-liveteach/src/setup/ui'

const uiComponent = () => (
    [
      ToastUI(),
      Render()
    ]
  )

  export function setupUi() {
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }