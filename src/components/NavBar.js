import React from 'react'

export default function NavBar() {
  return (
    <div className='fixed justify-around flex w-full bg-gray-800 text-white p-2 text-center items-center'>
        <p>Stonks</p>
        <a href='https://drive.google.com/drive/folders/1HA9w4OwQvbPb_-RgcfNRwp0WbpzbSah0?usp=drive_link' className='border border-slate-400 p-3 bg-cyan-500 rounded-md text-white font-medium hover:bg-cyan-400'>Donate Memes here</a>
    </div>
  )
}
