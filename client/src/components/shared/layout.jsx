import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from "./sidebar"

const layout = () => {
  return (
    <div className='flex flex-row bg-neutral-100 h-screen overflow-hidden'>
          <Sidebar />       
        <main className='p-4 mx-auto flex-1 overflow-y-auto bg-lblue bg-bgMain bg-scroll bg-cover'>
            {/* <div className='font-italic bg-blue'>header</div> */}
            <div>{<Outlet />}</div>
        </main>
    </div>
  )
}

export default layout