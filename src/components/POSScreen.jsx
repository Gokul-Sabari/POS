import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLink } from './fetchComponent';
import InfoBar from './InfoBar';
import CategoryPanel from './CategoryPanel';
import ProductList from './ProductList';
import CustomerSearchModal from './CustomerSearchModal';
import PrintPreviewModal from './PrintPreview';
import { getSessionUser } from "../components/functions";
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const POSScreen = () => {
    const navigate = useNavigate();
    const storage = getSessionUser().user;
    const [activeCategoryId, setActiveCategoryId] = useState('all'); 
    const [cartItems, setCartItems] = useState([]);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [selectedVoucherTypeId, setSelectedVoucherTypeId] = useState("174");
    const [selectedVoucherType, setSelectedVoucherType] = useState("POS SALE ORDER");
    const [allProducts, setAllProducts] = useState([]);
      const location = useLocation(); 

        const localData = localStorage.getItem("user");
         const parseData = JSON.parse(localData);
    const [customer, setCustomer] = useState({
        Above_30Days: '',
        Address: '',
        Bill_Name: '',
        Broker: '',
        Broker_Id: '',
        City: '',
        Customer_Id: '',
        Frequency_Days: '',
        Land_Line: '',
        LastBilling_Amount: '',
        Lorry_Shed: '',
        Mobile_No: '',
        Month_Avg_Amo: '',
        Month_Avg_Ton: '',
        QPay: '',
        Short_Name: '',
        Total_Outstanding: '',
        Transporter: '',
        Transporter_Id: ''
    }); 
    
    const [retailerId, setRetailerId] = useState("");
    const [branchId, setBranchId] = useState(storage?.BranchId || "");
    const [voucherTypes, setVoucherTypes] = useState([]);
    const [currentCustomer, setCurrentCustomer] = useState({});
    const [selectedBroker, setSelectedBroker] = useState("");
    const [selectedTransport, setSelectedTransport] = useState("");

    const handleBrokerChange = (brokerData) => {
        setSelectedBroker(brokerData);
    };

    const handleTransportChange = (transportData) => {
        setSelectedTransport(transportData);
    };


    const getProductPackGet = (productId) => {
        const product = allProducts.find(p => p.Product_Id == productId || p.Product_Id == productId);
        return product?.PackGet || 1; 
    };

   
    const calculateAmount = (qty, price, packGet) => {
        const kgs = qty * packGet;
        return kgs * price;
    };

    // const updateQuantity = (itemId, delta) => {
    //     setCartItems(prevItems => {
    //         if (!Array.isArray(prevItems)) return [];
            
    //         return prevItems.map(item => {
    //             if (item.id === itemId) {
    //                 const newQty = Math.max(0, item.qty + delta);
    //                 if (newQty === 0) {
    //                     return null; 
    //                 }
    //                 const newAmount = calculateAmount(newQty, item.price, item.packGet);
    //                 return { 
    //                     ...item, 
    //                     qty: newQty, 
    //                     amount: newAmount,
    //                     kgs: newQty * item.packGet
    //                 };
    //             }
    //             return item;
    //         }).filter(item => item !== null); 
    //     });
    // };

  useEffect(() => {
      
        if (location.state?.editMode && location.state?.orderData) {
            const orderData = location.state.orderData;
            
         
            
          
            if (orderData.customer) {
                setCustomer(orderData.customer);
                setRetailerId(orderData.customer.Customer_Id || "");
            }
            
           
            if (orderData.cartItems && Array.isArray(orderData.cartItems)) {
                const formattedCartItems = orderData.cartItems.map(item => ({
                    id: item.id || item.Item_Id,
                    name: item.name || item.Item_Name,
                    Print_Name: item.Print_Name || item.name,
                    price: item.price || item.Item_Rate,
                    qty: item.qty || item.Total_Qty,
                    amount: item.amount || item.Amount,
                    packGet: item.packGet || item.PackGet || 1,
                    kgs: item.kgs || item.Total_Kgs,
                    hsn: item.hsn || "210690",
                    taxRate: item.taxRate || 12,
                }));
                setCartItems(formattedCartItems);
            }
            
            // Set voucher type
            // if (orderData.voucherTypeId) {
            //     setSelectedVoucherTypeId(orderData.voucherTypeId);
            // }
            // if (orderData.voucherType) {
            //     setSelectedVoucherType(orderData.voucherType);
            // }
            
            // Set broker and transport
            if (orderData.broker) {
                setSelectedBroker(orderData.broker);
            }
            if (orderData.transport) {
                setSelectedTransport(orderData.transport);
            }
            
            toast.info(`Editing order ${orderData.orderId}`);
            
            // Clear the router state to prevent re-loading on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);


    const updateQuantity = (itemId, delta) => {
    setCartItems(prevItems => {
        if (!Array.isArray(prevItems)) return [];
        
        return prevItems.map(item => {
            if (item.id === itemId) {
                const newQty = Math.max(0, item.qty + delta);
                if (newQty === 0) {
                    return null; 
                }
                const newKgs = newQty * item.packGet;
                const newAmount = newKgs * item.price; // kgs * price
                
                return { 
                    ...item, 
                    qty: newQty, 
                    amount: newAmount,
                    kgs: newKgs
                };
            }
            return item;
        }).filter(item => item !== null); 
    });
};
    const increaseQuantity = (itemId) => updateQuantity(itemId, 1);
    const decreaseQuantity = (itemId) => updateQuantity(itemId, -1);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await fetchLink({
                    address: `masters/products/allProducts`
                });
                
                if (response?.success && response.data) {
                    setAllProducts(response.data);
                } else {
                    console.warn("No products found or failed to fetch");
                }
            } catch (error) {
                console.error("Error fetching all products:", error);
                toast.error("Failed to load product details");
            }
        };
        
        fetchAllProducts();
    }, []);

    // const enhancedCartItems = useMemo(() => {
    //     return cartItems.map(item => {
    //         const packGet = getProductPackGet(item.id);
    //         const kgs = item.qty * packGet;
    //         const amount = calculateAmount(item.qty, item.price, packGet);
            
    //         return {
    //             ...item,
    //             packGet,
    //             kgs,
    //             amount
    //         };
    //     });
    // }, [cartItems, allProducts]);


    const enhancedCartItems = useMemo(() => {
    return cartItems.map(item => {
        const packGet = getProductPackGet(item.id);
        const kgs = item.qty * packGet;
        const amount = kgs * item.price; 
        
        return {
            ...item,
            packGet,
            kgs,
            amount
        };
    });
}, [cartItems, allProducts]);

    const logout = () => {
        localStorage.clear();
        toast.info("Logged out Successfully")
        window.location = '/';
    }

    const totals = useMemo(() => {
        const subtotal = enhancedCartItems.reduce((sum, item) => sum + (item.amount || 0), 0);
        const totalQty = enhancedCartItems.reduce((sum, item) => sum + (item.qty || 0), 0);
        const totalKgs = enhancedCartItems.reduce((sum, item) => sum + (item.kgs || 0), 0);
        const totalTax = enhancedCartItems.reduce((sum, item) => sum + ((item.amount || 0) * ((item.taxRate || 0) / 100)), 0);
        const cgstTotal = totalTax / 2;
        const sgstTotal = totalTax / 2;
        const totalInvoiceValue = subtotal + totalTax;

        return {
            subtotal: subtotal.toFixed(2),
            totalRs: totalInvoiceValue.toFixed(2), 
            totalQty: totalQty.toFixed(0), 
            totalKgs: totalKgs.toFixed(2),
            itemCount: enhancedCartItems.length,
            discount: (0.0).toFixed(2),
            cgstTotal: cgstTotal.toFixed(2),
            sgstTotal: sgstTotal.toFixed(2),
            totalTax: totalTax.toFixed(2),
        };
    }, [enhancedCartItems]);

useEffect(() => {
    const fetchVoucherTypes = () => {
        fetchLink({
            address: `masters/voucher?module=POS`
        })
        .then((response) => {
            if (response?.success && response.data) {
                const types = response.data
                    .map(item => item?.Voucher_Type)
                    .filter(Boolean)
                    .filter((type, index, self) => self.indexOf(type) === index); 
                setVoucherTypes(types);
                
         
                const defaultVoucherType = "POS"; 
                const defaultVoucherData = response.data.find(item => 
                    item.Voucher_Type === defaultVoucherType
                );
                
       
                const finalVoucherData = defaultVoucherData || response.data[0];
                
                // if (finalVoucherData) {
                //     // setSelectedVoucherTypeId(finalVoucherData.Voucher_Type_Id || "");
                //     // setSelectedVoucherType(finalVoucherData.Voucher_Type);
                    
          
                //     // handleVoucherTypeChange({
                //     //     voucherTypeId: finalVoucherData.Voucher_Type_Id,
                //     //     voucherType: finalVoucherData.Voucher_Type
                //     // });
                // }
            } else {
                console.warn("No voucher types found");
            }
        })
        .catch((error) => {
            console.error("Error fetching voucher types:", error);
        });
    };
    fetchVoucherTypes();
}, []);

    // const handleVoucherTypeChange = (voucherData) => {
    //     setSelectedVoucherTypeId(voucherData.voucherTypeId);
    //     setSelectedVoucherType(voucherData.voucherType);
    // };

    // const addItemToCart = (product) => {
    //     setCartItems(prevItems => {
    //         if (!Array.isArray(prevItems)) prevItems = [];
    //         const existingItem = prevItems.find(item => item.id === product.Item_Id || item.id === product.id);

    //         if (existingItem) {
    //             return prevItems.map(item =>
    //                 item.id === (product.Item_Id || product.id)
    //                     ? { 
    //                         ...item, 
    //                         qty: item.qty + 1, 
    //                         amount: calculateAmount(item.qty + 1, item.price, item.packGet),
    //                         kgs: (item.qty + 1) * item.packGet
    //                     }
    //                     : item
    //             );
    //         } else {
    //             const packGet = getProductPackGet(product.Item_Id || product.id);
    //             const initialQty = 1;
    //             const initialKgs = initialQty * packGet;
    //             const initialAmount = calculateAmount(initialQty, parseFloat(product.Rate || product.price), packGet);

    //             const newItem = {
    //                 id: product.Item_Id || product.id,
    //                 name: product.Item_Name || product.name,
    //                 Print_Name: product.Print_Name || product.printName || product.name,
    //                 price: parseFloat(product.Rate || product.price),
    //                 qty: initialQty,
    //                 amount: initialAmount,
    //                 packGet: packGet,
    //                 kgs: initialKgs,
    //                 hsn: "210690",
    //                 taxRate: 12,
    //             };

    //             return [...prevItems, newItem];
    //         }
    //     });
    // };



    const addItemToCart = (product) => {
    setCartItems(prevItems => {
        if (!Array.isArray(prevItems)) prevItems = [];
        const existingItem = prevItems.find(item => item.id === product.Item_Id || item.id === product.id);

        if (existingItem) {
            const newQty = existingItem.qty + 1;
            const newKgs = newQty * existingItem.packGet;
            const newAmount = newKgs * existingItem.price; 
            
            return prevItems.map(item =>
                item.id === (product.Item_Id || product.id)
                    ? { 
                        ...item, 
                        qty: newQty, 
                        amount: newAmount,
                        kgs: newKgs
                    }
                    : item
            );
        } else {
            const packGet = getProductPackGet(product.Item_Id || product.id);
            const initialQty = 1;
            const initialKgs = initialQty * packGet;
            const initialAmount = initialKgs * parseFloat(product.Rate || product.price); // kgs * price

            const newItem = {
                id: product.Item_Id || product.id,
                name: product.Item_Name || product.name,
                Print_Name: product.Print_Name || product.printName || product.name,
                price: parseFloat(product.Rate || product.price),
                qty: initialQty,
                amount: initialAmount,
                packGet: packGet,
                kgs: initialKgs,
                hsn: "210690",
                taxRate: 12,
            };

            return [...prevItems, newItem];
        }
    });
};
    const removeItemFromCart = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };



    useEffect(() => {
    const editOrderData = localStorage.getItem('editOrderData');
    if (editOrderData) {
        try {
            const orderData = JSON.parse(editOrderData);
            
       
            if (orderData.customer) {
                setCustomer(orderData.customer);
                setRetailerId(orderData.customer.Customer_Id || "");
            }
            
            
            if (orderData.cartItems && Array.isArray(orderData.cartItems)) {
                const formattedCartItems = orderData.cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    Print_Name: item.name,
                    price: item.price,
                    qty: item.qty,
                    amount: item.amount,
                    packGet: item.packGet,
                    kgs: item.kgs,
                    hsn: "210690",
                    taxRate: 12,
                }));
                setCartItems(formattedCartItems);
            }
            
            // Set voucher type
            if (orderData.voucherTypeId) {
                setSelectedVoucherTypeId(orderData.voucherTypeId);
                setSelectedVoucherType(orderData.voucherType);
            }
            
            // Set broker and transport
            if (orderData.broker) {
                setSelectedBroker(orderData.broker);
            }
            if (orderData.transport) {
                setSelectedTransport(orderData.transport);
            }
            
            toast.info(`Editing order ${orderData.orderId}`);
            
            // Clear the stored data
            localStorage.removeItem('editOrderData');
            
        } catch (error) {
            console.error('Error loading edit order data:', error);
            toast.error('Error loading order for editing');
        }
    }
}, []);


    const handleProductListAction = (action) => {
        alert(`Product List Action: ${action} not yet implemented.`);
    };

    const handleSaveSale = async () => {
        if (enhancedCartItems.length === 0) {
            toast.error("Cart is empty. Cannot process payment.");
            return false;
        } 
       
        const staffInvolvedList = [];
        const finalBrokerId = selectedBroker?.value || customer?.Broker_Id;
        const finalTransportId = selectedTransport?.value || customer?.Transporter_Id;

        if (finalBrokerId) {
            staffInvolvedList.push({
                Involved_Emp_Id: parseInt(finalBrokerId),
                Cost_Center_Type_Id: 3, 
            });
        }

        if (finalTransportId) {
            staffInvolvedList.push({
                Involved_Emp_Id: parseInt(finalTransportId),
                Cost_Center_Type_Id: 2,
            });
        }

        setIsProcessingPayment(true);

        try {
            const productArray = enhancedCartItems.map((item, index) => {
                const taxRate = item.taxRate || 12;
                const cgstSgstRate = taxRate / 2;
                  const taxableAmount = (item.kgs * item.price * item.packGet).toFixed(2);
                const taxAmount = (item.amount * (taxRate / 100)).toFixed(2);
                const cgstSgstAmount = (parseFloat(taxAmount) / 2).toFixed(2);
                const finalAmount = (parseFloat(taxableAmount) + parseFloat(taxAmount)).toFixed(2);
                
                return {
                    "BrandID": "",
                    "GroupID": 2,
                    "Group": "POS_SALE_ITEM",
                    "So_Date": getFormattedDate(),
                    "Amount": item.amount,
                    "Bill_Qty": item.qty.toString() * item.packGet,
                    "Cgst": cgstSgstRate,
                    "Cgst_Amo": cgstSgstAmount,
                    "Final_Amo": finalAmount,
                    "HSN_Code": item.hsn || "210690",
                    "Item_Id": item.id.toString(),
                    "Item_Rate": item.price,
                    "S_No": index + 1,
                    "Sgst": cgstSgstRate,
                    "Sgst_Amo": cgstSgstAmount,
                    "Tax_Rate": taxRate,
                    "Taxable_Amount": taxableAmount,
                    "Total_Qty": item.qty.toString(),
                    "Total_Kgs": item.kgs.toString(),
                    "Unit_Id": 7,
                    "Unit_Name": "QTY",
                    "PackGet": item.packGet.toString() 
                };
            });

            const saleData = {
                "So_Date": getFormattedDate(),
                "Sales_Person_Id": 0,
                "Branch_Id": branchId,
                "CSGT_Total": totals.cgstTotal,
                "Created_by": "1",
                "GST_Inclusive": 2,
                "Retailer_Id": retailerId, 
                "Retailer_Name": customer.Bill_Name || customer.Short_Name || "Customer",
                "SGST_Total": totals.sgstTotal,
                "Total_Before_Tax": totals.subtotal,
                "Total_Invoice_value": totals.totalRs,
                "Total_Kgs": totals.totalKgs,
                "Total_Tax": totals.totalTax,
                "Product_Array": productArray,
                "VoucherType": selectedVoucherTypeId,
                "VoucherType_Name": selectedVoucherType,
                "Staff_Involved_List": staffInvolvedList
            };

            const response = await fetchLink({
                address: `sales/saleOrder`,
                method: 'POST',
                bodyData:{ 
                    ...saleData,
                    Created_by:parseData?.UserId
                }
            });

            if (response?.success) {
                toast.success(response?.message || "Order Created Successfully!");
                setCartItems([]);
                setCustomer({
                    Above_30Days: '',
                    Address: '',
                    Bill_Name: '',
                    Broker: '',
                    Broker_Id: '',
                    City: '',
                    Customer_Id: '',
                    Frequency_Days: '',
                    Land_Line: '',
                    LastBilling_Amount: '',
                    Lorry_Shed: '',
                    Mobile_No: '',
                    Month_Avg_Amo: '',
                    Month_Avg_Ton: '',
                    QPay: '',
                    Short_Name: '',
                    Total_Outstanding: '',
                    Transporter: '',
                    Transporter_Id: ''
                });
                setShowPrintPreview(false)
                setRetailerId("");
                setSelectedVoucherTypeId("");
                setSelectedVoucherType("");
                toast.success("Sale Order Created successfully")
                return true;
            } else {
                toast.error(response?.message || "Failed to create order");
                return false;
            }
        } catch (error) {
            toast.error("Payment failed! Check console for details.");
            return false;
        } finally {
            setIsProcessingPayment(false);
            setSelectedBroker("")
            setSelectedTransport("")
        }
    };

    const handleCustomerSelect = (selectedCustomer) => {
        setCustomer(selectedCustomer);
        setRetailerId(selectedCustomer.Customer_Id || selectedCustomer.Retailer_Id || "");
        setIsCustomerModalOpen(false);
    };

    const handleCartAction = (action) => {
        if (action === 'CLEAR') {
            setCartItems([]);
            toast.info("Cart cleared!");
        } else if (action === 'HOLD') {
            toast.info("Cart held! (Functionality not implemented)");
        }
    };

    return (
        <div className="h-full bg-green-50 p-4 font-sans overflow-hidden">
            
            {isCustomerModalOpen && (
                <CustomerSearchModal 
                    onClose={() => setIsCustomerModalOpen(false)}
                    onCustomerSelect={handleCustomerSelect}
                />
            )}
            
            <header className="bg-teal-700 text-white rounded-xl shadow-2xl mb-4 p-4 flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <div className="text-2xl font-extrabold bg-white text-teal-700 px-4 py-1.5 rounded-lg shadow-md h-10 flex items-center tracking-wider">
                        LOGO (.png)
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-xl bg-white text-teal-700 p-1.5 rounded-full w-9 h-9 flex items-center justify-center font-bold shadow-md">
                            👤
                        </div>
                        {/* <span className="text-xl font-bold text-gray-100">{storage?.UserName}- {(storage?.Name)}</span> */}
                        <span className="text-xl font-bold text-gray-100">
  {storage?.UserName}
  {storage?.UserTypeId !== '0' && ` - ${storage?.Name}`}
</span>

                    </div>
                </div>
                
                <div className="flex items-center space-x-5">
                    <button 
                        className="bg-teal-400 hover:bg-teal-500 text-gray-900 px-5 py-2 rounded-lg text-base transition-colors font-bold shadow-md"
                        onClick={() => navigate('/sales-orders')} 
                    >
                        SALES ORDER
                    </button>

                    <span className="bg-white text-teal-700 font-extrabold px-4 py-1.5 rounded-lg text-base shadow-md">POS</span>
                    
                    <button 
                        className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-base transition-colors font-bold shadow-md"
                        onClick={() => logout()}
                    >
                        LOGOUT
                    </button>
                </div>
            </header>

            <main className="flex flex-col h-[calc(100vh-7.5rem)]"> 
                <InfoBar 
                    currentCustomerName={customer}
                    onCustomerInputClick={() => setIsCustomerModalOpen(true)}
                    // onVoucherTypeChange={handleVoucherTypeChange} 
                    onBrokerChange={handleBrokerChange}
                    onTransportChange={handleTransportChange}
                />

                <CategoryPanel 
                    activeCategoryId={activeCategoryId} 
                    onCategoryClick={setActiveCategoryId}
                />

                <div className="flex flex-1 gap-4 overflow-hidden">
                    <div className="w-[40%] flex flex-col bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="flex bg-teal-700 text-white text-lg font-extrabold px-4 py-3 shadow-md">
                            <div className="w-2/5">Item</div>
                            <div className="w-[15%] text-center">Qty</div>
                            <div className="w-[20%] text-right">Price</div>
                            <div className="w-[20%] text-right">Amount</div>
                            <div className="w-6 ml-2 text-right">X</div>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-white p-2 space-y-0.5">
                            {enhancedCartItems.map(item => (
                                <div key={item.id} className="flex items-center text-base border-b border-gray-100 py-2.5 px-3 bg-white hover:bg-teal-50 transition-colors rounded-md">
                                    <div className="w-2/5">
                                        <div className="font-medium text-gray-800 truncate">{item.Print_Name}</div>
                                        {item.short_Name && (
                                            <div className="text-xs text-gray-500 truncate">{item.short_Name}</div>
                                        )}
                                        <div className="text-xs text-gray-400">
                                            {item.qty} × {item.packGet}kg = {item.kgs}kg
                                        </div>
                                    </div>
                                    <div className="w-[15%] flex justify-center items-center space-x-1">
                                        <button 
                                            className="bg-teal-400 hover:bg-teal-500 text-gray-900 font-bold w-6 h-6 rounded-md text-sm flex items-center justify-center transition-colors shadow-sm"
                                            onClick={() => increaseQuantity(item.id)}
                                        >
                                            +
                                        </button>
                                        <span className="text-lg font-extrabold text-gray-900 w-8 text-center">{item.qty}</span>
                                        <button 
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold w-6 h-6 rounded-md text-sm flex items-center justify-center transition-colors shadow-sm"
                                            onClick={() => decreaseQuantity(item.id)}
                                        >
                                            −
                                        </button>
                                    </div>

                                    <div className="w-[20%] text-right text-gray-600 font-medium">{item.price.toFixed(2)}</div>
                                    <div className="w-[20%] text-right font-extrabold text-gray-900 text-lg">{item.amount.toFixed(2)}</div>
                    
                                    <button 
                                        className="w-8 ml-3 text-red-600 hover:text-red-800 font-bold text-2xl p-1 rounded-full hover:bg-red-50 transition-colors"
                                        onClick={() => removeItemFromCart(item.id)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            {enhancedCartItems.length === 0 && (
                                <p className="text-gray-500 text-center py-12 text-lg font-medium">
                                    Cart is empty. Select products from the right panel.
                                </p>
                            )}
                        </div>

                        <footer className="bg-gray-500 p-4 text-white shadow-2xl rounded-b-xl">
                            <div className="flex justify-between text-base border-b border-gray-700 pb-2 mb-2">
                                <span className="font-medium text-gray-300">Qty: <span className="font-bold">{totals.totalQty}</span></span>
                                <span className="font-medium text-gray-300">Kgs: <span className="font-bold">{totals.totalKgs}</span></span>
                                <span className="font-medium text-gray-300">Item: <span className="font-bold">{totals.itemCount}</span></span>
                                <span className="font-medium text-yellow-400">Discount: <span className="font-bold">{totals.discount}</span></span>
                            </div>
                            
                            <div className="flex justify-between items-center text-xl font-bold pt-2 mt-1">
                                <span>Subtotal: <span className='text-gray-300'>Rs {totals.subtotal}</span></span>
                                <span className='text-teal-400 text-3xl font-extrabold'>Total Rs: {totals.subtotal}</span>
                            </div>

                            <div className="flex mt-3 space-x-3">
                                <button 
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-lg font-extrabold transition-colors flex items-center justify-center shadow-lg"
                                    onClick={() => handleCartAction('CLEAR')}
                                >
                                    CLEAR <span className="ml-2 text-xl">✖</span>
                                </button>
                                {/* <button 
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg text-lg font-extrabold transition-colors flex items-center justify-center shadow-lg"
                                    onClick={() => handleCartAction('HOLD')}
                                >
                                    HOLD <span className="ml-2 text-xl">⌕</span>
                                </button> */}
                                <button
                                    className="flex-1 bg-teal-400 hover:bg-teal-500 text-gray-900 py-3 rounded-lg text-lg font-extrabold transition-colors flex items-center justify-center shadow-lg"
                                    onClick={() => setShowPrintPreview(true)} 
                                    disabled={enhancedCartItems.length === 0 || isProcessingPayment}
                                >
                                    {isProcessingPayment ? 'PROCESSING...' : 'PAY'} <span className="ml-2 text-xl">💵</span>
                                </button>
                            </div>
                        </footer>
                    </div>

                    <PrintPreviewModal
                        open={showPrintPreview}
                        onClose={() => setShowPrintPreview(false)}
                        customer={{
                            ...customer,
                            Broker: selectedBroker.label || customer?.Broker || "",
                            Transporter: selectedTransport.label || customer?.Transporter || ""
                        }}
                        cartItems={enhancedCartItems}
                        totals={totals}
                        storage={storage}
                        branchId={branchId}
                        retailerId={retailerId}
                        selectedVoucherTypeId={selectedVoucherTypeId}
                        selectedVoucherType={selectedVoucherType}
                        onPrintAndSave={handleSaveSale}  
                    />

                    <ProductList 
                        activeCategoryId={activeCategoryId} 
                        onAction={handleProductListAction}
                        addItemToCart={addItemToCart}
                    />
                </div>
            </main>
        </div>
    );
};

export default POSScreen;