import React from 'react'
import { useParams } from 'react-router-dom'

function Cart() {
  const {id} = useParams();
  
  return (
    <div>Cart {id}</div>
  )
}

export default Cart