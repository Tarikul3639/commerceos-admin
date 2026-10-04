// src/hooks/use-unsaved-changes.ts

import { useCallback, useEffect } from "react"

export function useUnsavedChangesWarning(shouldWarn: boolean) {
    useEffect(() => {
        if (!shouldWarn) return

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault()
            event.returnValue = ""
        }

        window.addEventListener("beforeunload", handleBeforeUnload)

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [shouldWarn])

    const confirmNavigation = useCallback(() => {
        if (!shouldWarn) return true

        return window.confirm(
            "You have unsaved changes. Are you sure you want to leave?"
        )
    }, [shouldWarn])

    return {
        confirmNavigation,
    }
}
