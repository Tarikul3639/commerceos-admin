import { NextRequest, NextResponse } from "next/server"

export function proxy(req: NextRequest) {
    const accessToken = req.cookies.get("user_access_token")?.value

    if (!accessToken) {
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)

        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*"],
}
