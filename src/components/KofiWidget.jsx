import { useEffect } from 'react'

/**
 * Ko-fi floating donation widget component.
 * Loads the Ko-fi overlay script and initializes the floating chat button.
 * Handles cleanup on unmount and prevents duplicate script loading.
 */
function KofiWidget() {
  useEffect(() => {
    const SCRIPT_ID = 'kofi-widget-script'

    // Check if script is already loaded
    if (document.getElementById(SCRIPT_ID)) {
      // Script exists, try to initialize widget if not already done
      if (window.kofiWidgetOverlay && !document.querySelector('.floatingchat-container')) {
        window.kofiWidgetOverlay.draw('reeseallison', {
          'type': 'floating-chat',
          'floating-chat.donateButton.text': 'Support me',
          'floating-chat.donateButton.background-color': '#00b9fe',
          'floating-chat.donateButton.text-color': '#fff'
        })
      }
      return
    }

    // Create and load the script
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'
    script.async = true

    script.onload = () => {
      if (window.kofiWidgetOverlay) {
        window.kofiWidgetOverlay.draw('reeseallison', {
          'type': 'floating-chat',
          'floating-chat.donateButton.text': 'Support me',
          'floating-chat.donateButton.background-color': '#00b9fe',
          'floating-chat.donateButton.text-color': '#fff'
        })
      }
    }

    document.body.appendChild(script)

    // Cleanup function
    return () => {
      // Remove the widget container if it exists
      const widgetContainer = document.querySelector('.floatingchat-container')
      if (widgetContainer) {
        widgetContainer.remove()
      }

      // Remove the Ko-fi iframe if it exists
      const kofiFrame = document.querySelector('iframe[src*="ko-fi.com"]')
      if (kofiFrame) {
        kofiFrame.remove()
      }
    }
  }, [])

  // This component doesn't render anything visible itself
  // The Ko-fi script handles all DOM manipulation
  return null
}

export default KofiWidget
