import { useEffect } from 'react'

const KOFI_BUTTON_CONFIG = {
  type: 'floating-chat',
  'floating-chat.donateButton.text': 'Support',
  'floating-chat.donateButton.background-color': '#323842',
  'floating-chat.donateButton.text-color': '#fff',
}

/**
 * Ko-fi floating donation widget component.
 * Loads the Ko-fi overlay script and initializes the floating chat button.
 */
function KofiWidget() {
  useEffect(() => {
    const SCRIPT_ID = 'kofi-widget-script'

    // Add title to Ko-fi iframes for accessibility
    const addTitlesToIframes = () => {
      document.querySelectorAll('iframe[src*="ko-fi"]').forEach(iframe => {
        if (!iframe.title) {
          iframe.title = 'Ko-fi donation widget'
        }
      })
    }

    // Watch for dynamically created iframes
    const observer = new MutationObserver(addTitlesToIframes)
    observer.observe(document.body, { childList: true, subtree: true })

    // Check for script already loaded
    if (document.getElementById(SCRIPT_ID)) {
      if (window.kofiWidgetOverlay && !document.querySelector('.floatingchat-container')) {
        window.kofiWidgetOverlay.draw('reeseallison', KOFI_BUTTON_CONFIG)
      }
      addTitlesToIframes()
    } else {
      const script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'
      script.async = true
      script.onload = () => {
        if (window.kofiWidgetOverlay) {
          window.kofiWidgetOverlay.draw('reeseallison', KOFI_BUTTON_CONFIG)
        }
        addTitlesToIframes()
      }
      document.body.appendChild(script)
    }

    return () => {
      observer.disconnect()
      document.querySelector('.floatingchat-container')?.remove()
    }
  }, [])

  return null
}

export default KofiWidget
