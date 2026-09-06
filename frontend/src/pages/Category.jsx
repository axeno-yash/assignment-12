import React from 'react'
import { useParams } from 'react-router-dom'

function Category() {
  const {id} = useParams();
  return (
    <div>Category {id}</div>
  )
}

export default Category