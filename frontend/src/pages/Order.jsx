import React from 'react'
import { useParams } from 'react-router-dom'

function Order() {
  const {id} = useParams();
  return (
    <div>Order {id}</div>
  )
}

export default Order