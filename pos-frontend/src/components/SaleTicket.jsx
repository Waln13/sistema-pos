import { forwardRef } from 'react'

const SaleTicket = forwardRef(({ sale, change, amountPaid }, ref) => {
  return (
    <div ref={ref} className="p-6 bg-white text-gray-800 font-mono text-sm w-72 mx-auto">
      {/* Encabezado */}
      <div className="text-center mb-4">
        <p className="text-lg font-bold">SISTEMA POS</p>
        <p className="text-xs text-gray-500">Tu tienda de confianza</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(sale.createdAt).toLocaleString('es-DO')}
        </p>
        <p className="text-xs text-gray-400">Atendido por: {sale.userName}</p>
      </div>

      <div className="border-t border-dashed border-gray-300 my-3" />

      {/* Productos */}
      <div className="space-y-2 mb-3">
        {sale.items.map((item, i) => (
          <div key={i} className="flex justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium">{item.name}</p>
              <p className="text-xs text-gray-400">{item.quantity} x RD$ {item.unitPrice.toFixed(2)}</p>
            </div>
            <p className="text-xs font-semibold">RD$ {(item.quantity * item.unitPrice).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-gray-300 my-3" />

      {/* Totales */}
      <div className="space-y-1">
        <div className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>RD$ {sale.total.toFixed(2)}</span>
        </div>
        {amountPaid && (
          <>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Efectivo recibido</span>
              <span>RD$ {parseFloat(amountPaid).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-green-600">
              <span>Cambio</span>
              <span>RD$ {(parseFloat(amountPaid) - sale.total).toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      <div className="border-t border-dashed border-gray-300 my-3" />

      {/* Pie */}
      <div className="text-center">
        <p className="text-xs text-gray-400">¡Gracias por su compra!</p>
        <p className="text-xs text-gray-400">Vuelva pronto 😊</p>
        <p className="text-xs text-gray-300 mt-2">Ticket #{sale.id}</p>
      </div>
    </div>
  )
})

SaleTicket.displayName = 'SaleTicket'
export default SaleTicket