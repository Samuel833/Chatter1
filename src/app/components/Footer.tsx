import React from 'react';
import Link from "next/link"


export default function Footer() {
    return (
        <footer className='fixed bottom-0 flex justify-center items-center text-black h-6 p-8 w-full'>
            <div className='flex justify-center items-center gap-3'>
                <div>
                    <Link href='#'>About Us</Link>
                </div>
                <div>
                    <Link href='#'>Contact Us</Link>
                </div>
                <div className='max-md:hidden'>
                    <Link href='#'>Privacy Policy</Link>
                </div>
                <div className='max-md:hidden'>
                    <Link href='#'>Terms of Service</Link>
                </div>
                <div>
                    <Link href='#'>Help</Link>
                </div>
            </div>
        </footer>
    )
}