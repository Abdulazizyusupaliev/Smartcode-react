import React, { useRef } from 'react'
const closeSearch=()=>{
    document.querySelector('.search').classList.remove("active")
}


export default function Search() {
  const name = useRef()
  return (
    <div className='search'> 
      <input type="text" ref={name} placeholder='Search...' />
      <span onClick={closeSearch} className='search-close'><i className="bi bi-x-circle"></i></span>
    </div>
  )
}
