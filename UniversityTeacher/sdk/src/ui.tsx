import { ReactEcsRenderer } from "@dcl/sdk/react-ecs"
import { ToastUI } from "./NotificationSystem/Toaster"

const uiComponent = () => (
    [
      ToastUI()
    ]
  )

  export function setupUi() {
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }