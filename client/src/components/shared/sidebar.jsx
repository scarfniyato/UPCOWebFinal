import React from 'react'
import { Dashboard_Sidebar_Links, Dashboard_Sidebar_Links_Bottom} from '../../library/Constants/navigation'
import { Link, useLocation } from 'react-router-dom'
import classnames from 'classnames'

const linkClasses = 'flex item-center gap-3 font-ligh px-3 py-3 hover:text-blue hover:no-underline active:text-blue rounded-sm text-sm text-wrap'

const sidebar = () => {
  return (
    <div className='flex flex-col bg-dark text-white p-4 pt-6 w-64'>
        <div className='flex items-center gap-3 px-1 mb-5'>  
            <Link to="/">
            <img src='/UPCO_logo.png' className='size-11'/></Link>
            <span className='text-xl font-bold '>UPCO | CVSU<br/>
            <span className='text-xs font-normal'>State of the Environment</span>
            </span>
        </div>
        <div className='flex-1 py-2 flex flex-col gap-5'>
            {Dashboard_Sidebar_Links.map((item)=>(
                <SidebarLink key={item.key} item={item}/>
            ))}
        </div>
        <div><hr/>
            {Dashboard_Sidebar_Links_Bottom.map((item)=>(
                <SidebarLink key={item.key} item={item}/>
            ))}
        </div>
    </div>
  )
}

function SidebarLink({ item }) {
    const { pathname } = useLocation()

    return (
        <Link to={item.path} className={classnames(pathname === item.path ? 'text-blue' : '', linkClasses)}>
            <span className='text-xl'>{item.icon}</span>
            {item.label}
        </Link>
    )
    
}

export default sidebar