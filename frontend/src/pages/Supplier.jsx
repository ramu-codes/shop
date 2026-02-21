import { useState, useEffect } from "react";
import api from "../api"; // UPDATED IMPORT
import { Plus, X, Truck, Calendar, CheckCircle2 } from "lucide-react";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [supplierName, setSupplierName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [expectedSellPrice, setExpectedSellPrice] = useState("");
  const [dueDate, setDueDate] = useState("");

  const fetchSuppliers = async () => {
    try {
      const { data } = await api.get("/suppliers"); // UPDATED API CALL
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAddPurchase = async (e) => {
    e.preventDefault();
    if (!supplierName || !productName || !totalCost || !quantity || !dueDate) return;

    const unitBuyPrice = Number(totalCost) / Number(quantity);
    const paid = Number(paidAmount) || 0;
    const remainingDue = Number(totalCost) - paid;

    let paymentStatus = "pending";
    if (paid >= Number(totalCost)) paymentStatus = "paid";
    else if (paid > 0 && paid < Number(totalCost)) paymentStatus = "partial";

    try {
      await api.post("/suppliers", { // UPDATED API CALL
        supplierName,
        productName,
        quantity: Number(quantity),
        buyPrice: unitBuyPrice,
        totalCost: Number(totalCost),
        paidAmount: paid,
        remainingDue,
        expectedSellPrice: Number(expectedSellPrice) || 0,
        paymentStatus,
        dueDate,
      });

      setIsModalOpen(false);
      setSupplierName("");
      setProductName("");
      setQuantity("");
      setTotalCost("");
      setPaidAmount("");
      setExpectedSellPrice("");
      setDueDate("");
      fetchSuppliers();
    } catch (error) {
      console.error("Error adding supplier purchase:", error);
    }
  };

  const handleMarkAsPaid = async (id) => {
    if (!window.confirm("Confirm full remaining payment made to supplier?")) return;

    try {
      await api.put(`/suppliers/${id}/pay`); // UPDATED API CALL
      fetchSuppliers();
    } catch (error) {
      console.error("Error marking as paid:", error);
    }
  };

  const totalPendingSupplier = suppliers
    .filter((s) => s.paymentStatus !== "paid")
    .reduce((acc, curr) => acc + (curr.totalCost - (curr.paidAmount || 0)), 0);

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Suppliers</h1>
          <p className="text-xs text-gray-500">Purchases & stock management</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1e40af] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center shadow-md active:scale-95 transition-transform"
        >
          <Plus size={18} className="mr-1" /> Add Stock
        </button>
      </div>

      {/* Pending Card */}
      <div className="bg-[#fffbeb] border border-[#fde68a] p-5 rounded-2xl shadow-sm">
        <p className="text-[#d97706] text-sm font-bold uppercase tracking-wider">
          Market Pending Dues
        </p>
        <p className="text-3xl font-black text-[#d97706] mt-1">
          ₹{totalPendingSupplier.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Supplier List */}
      <div className="space-y-3 pb-4">
        {suppliers.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-8">No supplier records found.</p>
        ) : (
          suppliers.map((item) => {
            const remainingDue = item.totalCost - (item.paidAmount || 0);

            return (
              <div key={item._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#fef3c7] p-2 rounded-xl">
                      <Truck size={20} className="text-[#d97706]" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-[#0f172a] leading-tight">
                        {item.supplierName}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">
                        {item.productName}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider ${
                      item.paymentStatus === "pending"
                        ? "bg-[#fee2e2] text-[#dc2626]"
                        : item.paymentStatus === "partial"
                        ? "bg-[#dbeafe] text-[#1d4ed8]"
                        : "bg-[#dcfce7] text-[#16a34a]"
                    }`}
                  >
                    {item.paymentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 bg-[#f8fafc] p-3 rounded-xl mb-4 border border-gray-100">
                  <p>Qty: <span className="font-bold text-[#0f172a]">{item.quantity}</span></p>
                  <p>Unit Price: <span className="font-bold text-[#0f172a]">₹{item.buyPrice?.toFixed(2)}</span></p>
                  
                  <div className="col-span-2 h-px bg-gray-200 my-1"></div>
                  
                  <p>Total Bill: <span className="font-bold text-[#0f172a]">₹{item.totalCost}</span></p>
                  <p>Paid Upfront: <span className="font-bold text-[#16a34a]">₹{item.paidAmount || 0}</span></p>
                  
                  {item.expectedSellPrice > 0 && (
                    <>
                      <div className="col-span-2 h-px bg-gray-200 my-1"></div>
                      <p>Sell Price (Unit): <span className="font-bold text-[#0f172a]">₹{item.expectedSellPrice}</span></p>
                      <p className="font-bold text-[#16a34a]">
                        Exp. Profit: ₹{((item.expectedSellPrice * item.quantity) - item.totalCost).toFixed(2)}
                      </p>
                    </>
                  )}

                  {item.paymentStatus !== "paid" && (
                    <p className="col-span-2 text-base mt-2 border-t border-gray-200 pt-2">
                      Remaining Due: <span className="font-black text-[#dc2626]">₹{remainingDue}</span>
                    </p>
                  )}

                  <p className="col-span-2 flex items-center mt-1 text-gray-500 font-medium text-xs">
                    <Calendar size={14} className="mr-1" /> Due Date:{" "}
                    {new Date(item.dueDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {item.paymentStatus !== "paid" && (
                  <button
                    onClick={() => handleMarkAsPaid(item._id)}
                    className="w-full py-3 bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] rounded-xl text-sm font-bold flex justify-center items-center active:bg-[#dcfce7] transition-colors"
                  >
                    <CheckCircle2 size={18} className="mr-2" /> Mark Remaining ₹{remainingDue} as Paid
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Purchase Modal */}
      {/* Add Purchase Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 pb-12 animate-slide-up sm:animate-none max-h-[85vh] overflow-y-auto overscroll-contain">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0f172a]">Add Stock Purchase</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-600 active:bg-gray-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPurchase} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Supplier / Wholesaler *</label>
                <input type="text" required value={supplierName} onChange={(e) => setSupplierName(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-[#1e40af]" placeholder="e.g. Metro Wholesale" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Product Details *</label>
                <input type="text" required value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-[#1e40af]" placeholder="e.g. Refined Oil 15L Cartons" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Total Quantity *</label>
                  <input type="number" required value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-[#1e40af]" min="1" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#dc2626] mb-1">Total Bill (₹) *</label>
                  <input type="number" required value={totalCost} onChange={(e) => setTotalCost(e.target.value)} className="w-full border-2 border-[#fecaca] bg-[#fef2f2] rounded-xl p-3 outline-none focus:border-[#dc2626] font-bold" />
                </div>
              </div>

              <div className="bg-[#f8fafc] p-4 rounded-xl border border-gray-200">
                <label className="block text-sm font-bold text-[#1e40af] mb-1">Amount Paid Now (₹)</label>
                <input type="number" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} className="w-full border-2 border-[#bfdbfe] bg-white rounded-xl p-3 outline-none focus:border-[#1e40af] font-bold" placeholder="Leave blank if fully Udhar" />
                
                {totalCost && (
                  <p className="text-sm font-bold text-[#dc2626] mt-3 flex justify-between">
                    Remaining Udhar: <span>₹{Math.max(0, Number(totalCost) - (Number(paidAmount) || 0))}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-[#16a34a] mb-1">Expected Sell Price (per unit)</label>
                <input type="number" value={expectedSellPrice} onChange={(e) => setExpectedSellPrice(e.target.value)} className="w-full border-2 border-[#bbf7d0] bg-[#f0fdf4] rounded-xl p-3 outline-none focus:border-[#16a34a]" placeholder="To calculate profit" />
              </div>

              {(quantity && totalCost) && (
                <div className="bg-gray-100 p-4 rounded-xl text-sm">
                  <p className="flex justify-between text-gray-600 mb-1">Per Unit Buy Price: <span className="font-bold text-[#0f172a]">₹{(totalCost / quantity).toFixed(2)}</span></p>
                  {expectedSellPrice && (
                    <p className="flex justify-between text-[#16a34a] font-black border-t border-gray-300 pt-2 mt-2 text-base">
                      Expected Profit: <span>₹{((expectedSellPrice * quantity) - totalCost).toFixed(2)}</span>
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 mt-2">Payment Due Date *</label>
                <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-[#1e40af]" />
              </div>

              <button type="submit" className="w-full bg-[#16a34a] text-white font-black text-lg py-4 rounded-xl mt-6 active:scale-95 transition-transform shadow-lg">
                Save Purchase Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier;