import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from "./sidebar"

const layout = () => {
  return (
    <div className='flex flex-row bg-neutral-100 h-screen overflow-hidden'>
        <Sidebar />
        <div className='p-4'>
            <div className='font-italic bg-blue'>header</div>
            <div>{<Outlet />}</div>
        </div>
    </div>
  )
}

export default layout