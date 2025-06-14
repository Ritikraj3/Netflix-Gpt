import React from 'react'
import GptSearchBar from './GptSearchBar'
import GptMovieSuggestions from './GptMovieSuggestions'

const GptSearch = () => {
  return (
    <div className='bg-[#141414] min-h-screen '>
      <GptSearchBar />
      <GptMovieSuggestions />
    </div>
  )
}



export default GptSearch