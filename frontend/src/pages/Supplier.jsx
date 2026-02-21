import { useState, useEffect } from "react";
import api from "../api";
import { Plus, X, Truck, Calendar, CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSuppliers = async () => {
    try {
      const { data } = await api.get("/suppliers");
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
    if (!supplierName || !productName || !totalCost || !quantity || !dueDate || isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Saving supplier record...");

    const unitBuyPrice = Number(totalCost) / Number(quantity);
    const paid = Number(paidAmount) || 0;
    const remainingDue = Number(totalCost) - paid;

    let paymentStatus = "pending";
    if (paid >= Number(totalCost)) paymentStatus = "paid";
    else if (paid > 0 && paid < Number(totalCost)) paymentStatus = "partial";

    try {
      await api.post("/suppliers", {
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

      toast.success("Stock purchase saved!", { id: toastId });

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
      toast.error("Failed to save record.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsPaid = async (id) => {
    if (!window.confirm("Confirm full remaining payment made to supplier?")) return;

    const toastId = toast.loading("Processing payment...");
    try {
      await api.put(`/suppliers/${id}/pay`);
      toast.success("Market debt cleared!", { id: toastId });
      fetchSuppliers();
    } catch (error) {
      console.error("Error marking as paid:", error);
      toast.error("Failed to process payment.", { id: toastId });
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
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex justify-center">
          <div
            className="fixed bottom-0 w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 max-h-[90dvh] overflow-y-auto overscroll-contain animate-slide-up"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 80px)" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0f172a]">Add Stock Purchase</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-600 active:bg-gray-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPurchase} className="space-y-4">
              <input type="text" required value={supplierName} onChange={(e) => setSupplierName(e.target.value)} placeholder="Supplier Name" className="w-full border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-[#1e40af]" />
              <input type="text" required value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product Details" className="w-full border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-[#1e40af]" />

              <div className="grid grid-cols-2 gap-4">
                <input type="number" required value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" className="border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-[#1e40af]" />
                <input type="number" required value={totalCost} onChange={(e) => setTotalCost(e.target.value)} placeholder="Total Bill ₹" className="border-2 border-[#fecaca] bg-[#fef2f2] rounded-xl p-3 outline-none focus:border-[#dc2626] font-bold" />
              </div>

              <input type="number" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} placeholder="Amount Paid Now (₹)" className="w-full border-2 border-[#bfdbfe] bg-white rounded-xl p-3 outline-none focus:border-[#1e40af] font-bold" />

              <input type="number" value={expectedSellPrice} onChange={(e) => setExpectedSellPrice(e.target.value)} placeholder="Expected Sell Price (per unit)" className="w-full border-2 border-[#bbf7d0] bg-[#f0fdf4] rounded-xl p-3 outline-none focus:border-[#16a34a]" />

              <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-[#1e40af]" />

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white font-black text-lg py-4 rounded-xl mt-6 active:scale-95 transition-transform shadow-lg flex justify-center items-center ${
                  isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-[#16a34a]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={24} /> Saving...
                  </>
                ) : (
                  'Save Purchase Record'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier;