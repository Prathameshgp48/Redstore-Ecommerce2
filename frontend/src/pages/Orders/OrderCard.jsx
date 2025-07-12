import React from 'react'

function OrderCard({order}) {
    if (!order) {
        return <div className="text-red-500">Order data is not available.</div>;
      }
    
      const formattedDate = order?.created_at
        ? new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date(order.created_at))
        : 'N/A';

  return (
    <div className="w-4/5 mx-auto px-5 p-1 mt-3 flex items-center justify-between bg-red-400 rounded-md">
       <div>
          <img src={order.productimgurl} alt="" className="h-20 w-20 object-cover bg-white rounded-md"/>
       </div>
       <h3 className="text-light-200 font-poppins font-bold"> {order.product_name || `Order #${order.id}`}</h3>
       <p className="text-light-400">Order Date: {formattedDate}</p>
       <p className="p-1 text-white bg-green-500 rounded-md">{order.status.toUpperCase()}</p>
    </div>
  )
}

export default OrderCard
