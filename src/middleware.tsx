import { NextResponse } from 'next/server'


export async function middleware(request: { nextUrl: { pathname: string }; url: string | URL | undefined }) {

    if(request.nextUrl.pathname === '/users') {
        return NextResponse.redirect(new URL('/', request.url))
    }
}

export const config = {
    matcher: '/users/:path*'
}