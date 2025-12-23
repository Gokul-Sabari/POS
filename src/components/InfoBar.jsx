
import React, { useEffect, useState } from "react";
import { ISOString } from "../components/functions";
import { fetchLink } from "../components/fetchComponent";
import CustomerSearchModal from "./CustomerSearchModal";

const InfoField = ({ label, value, type = "text", onClick, options, onCustomerInputClick, onChange }) => {
  if (type === "search" || type === "text") {
    if (label === "Customer Name") {
      return (
        <div className="flex flex-col flex-shrink-0 w-[130px] mb-1">
          <label className="text-xs text-white mb-0.5 whitespace-nowrap">{label}</label>
          <input
            type="text"
            value={value || ""}
            onFocus={onCustomerInputClick}
            readOnly
            placeholder="Select Customer"
            className="bg-teal-500 rounded px-2 py-1 h-7 text-xs text-gray-900 font-medium shadow-inner 
                       focus:ring-1 focus:ring-teal-200 focus:outline-none cursor-pointer placeholder-gray-900"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col flex-shrink-0 w-[130px] mb-1">
        <label className="text-xs text-white mb-0.5 whitespace-nowrap">{label}</label>
        <input
          type="text"
          value={value || ""}
          readOnly
          onClick={onClick}
          className={`bg-teal-500 rounded px-2 py-1 h-7 text-xs text-gray-900 font-medium shadow-inner 
                     focus:ring-1 focus:ring-teal-200 focus:outline-none placeholder-gray-900
                     ${onClick ? 'cursor-pointer hover:bg-teal-400 transition-colors' : ''}`}
        />
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className="flex flex-col flex-shrink-0 w-[130px] mb-1">
        <label className="text-xs text-white mb-0.5 whitespace-nowrap">{label}</label>
        <select
          value={value || ""}
          onChange={onChange}
          className="bg-teal-500 rounded px-2 py-1 h-7 text-xs text-gray-900 font-medium shadow-inner 
                     focus:ring-1 focus:ring-teal-200 focus:outline-none appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' 
                              viewBox='0 0 20 20'%3E%3Cpath fill='%236B7280' 
                              d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 
                              10.828 5.757 6.586 4.343 8z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.5rem center",
            backgroundSize: "0.75rem",
          }}
        >
          <option value="">Select {label}</option>
          {options && options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-shrink-0 w-[130px] mb-1">
      <label className="text-xs text-white mb-0.5 whitespace-nowrap">{label}</label>
      <div
        className={`bg-teal-500 rounded px-2 py-1 h-7 text-xs text-gray-900 font-medium 
                    truncate flex items-center shadow-inner 
                    cursor-${onClick ? "pointer" : "default"} 
                    ${onClick ? "hover:bg-teal-400 transition-colors" : ""}`}
        onClick={onClick}
      >
        {value || "-"}
      </div>
    </div>
  );
};

const InfoBar = ({ currentCustomerName, onCustomerInputClick, onBrokerChange, onTransportChange }) => {
  const [fields, setFields] = useState({
    no: "C1-240",
    date: ISOString(),
    customer: "",
    broker: "",
    transport: "",
    QPay: "Q-Pay",
    frequencyDays: "",
    lastingBilling: "",
    voucherType: "POS SALE ORDER",
    voucherTypeId: "174",
    godownType: "Main Location",
    narrative: "",
    monthAvgTon: "",
    monthAvgAmma: "",
    lane: "",
    larry: "",
    outstanding: "",
    above300: "",
    existingAccount: "",
    Month_Avg_Ton: "",
    Month_Avg_Amo: ""
  });

  const [voucherTypes, setVoucherTypes] = useState([]);
  const [brokerOptions, setBrokerOptions] = useState([]);
  const [transportOptions, setTransportOptions] = useState([]);
  const [loading, setLoading] = useState({
    voucher: false,
    broker: false,
    transport: false
  });

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentSearchType, setCurrentSearchType] = useState("customer");

  useEffect(() => {
    const fetchVoucherTypes = () => {
      setLoading(prev => ({ ...prev, voucher: true }));
      
      fetchLink({
        address: `masters/voucher?module=POS`
      })
      .then((response) => {
        if (response?.success && response.data) {
          const types = response.data
            .filter(item => item?.Voucher_Type && item?.Vocher_Type_Id) 
            .map(item => ({
              value: item.Vocher_Type_Id.toString(), 
              label: item.Voucher_Type,    
              id: item.Vocher_Type_Id,
              name: item.Voucher_Type
            }))
            .filter((type, index, self) => 
              self.findIndex(t => t.value === type.value) === index 
            );
          
          setVoucherTypes(types);
      
        } else {
          console.warn("No voucher types found in response");
          setVoucherTypes([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching voucher types:", error);
        setVoucherTypes([]);
      })
      .finally(() => {
        setLoading(prev => ({ ...prev, voucher: false }));
      });
    };

    const fetchBrokers = () => {
      setLoading(prev => ({ ...prev, broker: true }));
      
      fetchLink({
        address: `pos/brokers`
      })
      .then((response) => {
        if (response?.data?.Brokers) {
          const brokers = response.data.Brokers.map(broker => ({
            value: broker.Broker_Id.toString(),
            label: broker.Broker_Name
          }));
          setBrokerOptions(brokers);
        } else {
          console.warn("No brokers found in response");
          setBrokerOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching brokers:", error);
        setBrokerOptions([]);
      })
      .finally(() => {
        setLoading(prev => ({ ...prev, broker: false }));
      });
    };

    const fetchTransports = () => {
      setLoading(prev => ({ ...prev, transport: true }));
      
      fetchLink({
        address: `pos/transporters`
      })
      .then((response) => {
        if (response?.data?.Transporters) {
          const transports = response.data.Transporters.map(transport => ({
            value: transport.Transporter_Id.toString(),
            label: transport.Transporter_Name
          }));
          setTransportOptions(transports);
        } else {
          setTransportOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching transporters:", error);
        setTransportOptions([]);
      })
      .finally(() => {
        setLoading(prev => ({ ...prev, transport: false }));
      });
    };

    fetchVoucherTypes();
    fetchBrokers();
    fetchTransports();
  }, []);

  const findBrokerIdByName = (brokerName) => {
    if (!brokerName) return "";
    const broker = brokerOptions.find(b => b.label === brokerName);
    return broker ? broker.value : "";
  };

  const findTransportIdByName = (transportName) => {
    if (!transportName) return "";
    const transport = transportOptions.find(t => t.label === transportName);
    return transport ? transport.value : "";
  };

  useEffect(() => {
    if (currentCustomerName) {
      const brokerId = findBrokerIdByName(currentCustomerName.Broker);
      const transportId = findTransportIdByName(currentCustomerName.Transporter);
      
      setFields((prev) => ({
        ...prev,
        customer: currentCustomerName.Short_Name || "",
        broker: brokerId || currentCustomerName.Broker || "", 
        transport: transportId || currentCustomerName.Transporter || "", 
        QPay: currentCustomerName.QPay || "",
        outstanding: currentCustomerName.Total_Outstanding || "",
        frequencyDays: currentCustomerName.Frequency_Days || "",
        lastingBilling: currentCustomerName.LastBilling_Amount || "",
        voucherType: currentCustomerName.voucherTypes || "POS SALE ORDER",
        voucherTypeId: currentCustomerName.voucherTypeId || "174",
        godownType: currentCustomerName.godown_type || "Main Location",
        narrative: currentCustomerName.narrative || "",
        existingAccount: currentCustomerName.existing_account || "",
        Month_Avg_Ton: currentCustomerName.Month_Avg_Ton || "",
        Month_Avg_Amo: currentCustomerName.Month_Avg_Amo || ""
      }));
    }
  }, [currentCustomerName, brokerOptions, transportOptions]);

  const handleBrokerInputClick = () => {
    setCurrentSearchType("broker");
    setShowSearchModal(true);
  };

  const handleTransportInputClick = () => {
    setCurrentSearchType("transport");
    setShowSearchModal(true);
  };

  const handleBrokerSelect = (selectedBroker) => {
    setFields(prev => ({
      ...prev,
      broker: selectedBroker.value
    }));
    if (onBrokerChange) {
      onBrokerChange(selectedBroker);
    }
  };

  const handleTransportSelect = (selectedTransport) => {
    setFields(prev => ({
      ...prev,
      transport: selectedTransport.value
    }));
    if (onTransportChange) {
      onTransportChange(selectedTransport);
    }
  };

  const handleVoucherTypeChange = (event) => {
    const selectedValue = event.target.value;
    
    if (selectedValue === "") {
      // Reset to default values if nothing selected
      setFields(prev => ({
        ...prev,
        voucherType: "POS SALE ORDER",
        voucherTypeId: "174"
      }));
      return;
    }

    // Find the selected voucher from voucherTypes
    const selectedVoucher = voucherTypes.find(voucher => voucher.value === selectedValue);
    
    if (selectedVoucher) {
      setFields(prev => ({
        ...prev,
        voucherType: selectedVoucher.label,
        voucherTypeId: selectedVoucher.value
      }));

      // You can also pass these values to parent component if needed
      // For example, if you want to use them in POSScreen:
      // onVoucherTypeChange({
      //   voucherTypeId: selectedVoucher.value,
      //   voucherType: selectedVoucher.label
      // });
    }
  };

  const getBrokerDisplayValue = () => {
    const broker = brokerOptions.find(b => b.value === fields.broker);
    return broker ? broker.label : fields.broker;
  };

  const getTransportDisplayValue = () => {
    const transport = transportOptions.find(t => t.value === fields.transport);
    return transport ? transport.label : fields.transport;
  };

  const getVoucherDisplayValue = () => {
    // Return the voucherTypeId for display, or you can return voucherType if you prefer
    return fields.voucherTypeId;
  };

  const allInfoFields = [
    { label: "Date", value: fields.date },
    { label: "Customer Name", value: fields.customer, type: "search", onCustomerInputClick },
    { 
      label: "Broker Name", 
      value: getBrokerDisplayValue(), 
      type: "text",
      onClick: handleBrokerInputClick
    },
    { 
      label: "Transport Name", 
      value: getTransportDisplayValue(), 
      type: "text",
      onClick: handleTransportInputClick
    },
    { label: "QPay", value: fields.QPay },
    { label: "Frequency Days", value: fields.frequencyDays },
    { label: "Lasting billing Rs", value: fields.lastingBilling },
    {
      label: "Voucher Type",
      value: getVoucherDisplayValue(), // This will show the voucherTypeId in the dropdown
      type: "select",
      options: voucherTypes, 
      onChange: handleVoucherTypeChange 
    },
    { label: "Narrative", value: fields.narrative, type: "text" },
    { label: "Month Avg Ton", value: fields.Month_Avg_Ton },
    { label: "Month Avg Amo", value: fields.Month_Avg_Amo },
    { label: "Lane Lane", value: fields.lane },
    { label: "Larry Street", value: fields.larry },
    { label: "Total Outstanding", value: fields.outstanding },
    { label: "Above 300 Days", value: fields.above300 },
    { label: "Existing Account", value: fields.existingAccount }
  ];

  return (
    <>
      <div className="bg-teal-700 p-2.5 rounded-lg shadow-md mb-3 flex flex-wrap justify-start gap-x-3 gap-y-1 overflow-x-hidden">
        {allInfoFields.map((field, index) => (
          <InfoField 
            key={`field-${index}`} 
            {...field} 
          />
        ))}
        
        {loading.voucher && (
          <div className="flex flex-col flex-shrink-0 w-[130px] mb-1">
            <label className="text-xs text-white mb-0.5 whitespace-nowrap">Voucher Type</label>
            <div className="bg-teal-500 rounded px-2 py-1 h-7 text-xs text-gray-900 font-medium shadow-inner flex items-center justify-center">
              Loading...
            </div>
          </div>
        )}

        {loading.broker && (
          <div className="flex flex-col flex-shrink-0 w-[130px] mb-1">
            <label className="text-xs text-white mb-0.5 whitespace-nowrap">Broker Name</label>
            <div className="bg-teal-500 rounded px-2 py-1 h-7 text-xs text-gray-900 font-medium shadow-inner flex items-center justify-center">
              Loading...
            </div>
          </div>
        )}

        {loading.transport && (
          <div className="flex flex-col flex-shrink-0 w-[130px] mb-1">
            <label className="text-xs text-white mb-0.5 whitespace-nowrap">Transport Name</label>
            <div className="bg-teal-500 rounded px-2 py-1 h-7 text-xs text-gray-900 font-medium shadow-inner flex items-center justify-center">
              Loading...
            </div>
          </div>
        )}
      </div>

      {showSearchModal && (
        <CustomerSearchModal
          onClose={() => setShowSearchModal(false)}
          onCustomerSelect={onCustomerInputClick}
          onBrokerSelect={handleBrokerSelect}
          onTransportSelect={handleTransportSelect}
          searchType={currentSearchType}
        />
      )}
    </>
  );
};

export default InfoBar;






// import React, { useEffect, useState } from "react";
// import { ISOString } from "../components/functions";
// import { fetchLink } from "../components/fetchComponent";
// import CustomerSearchModal from "./CustomerSearchModal";

// const InfoField = ({ label, value, type = "text", onClick, options, onCustomerInputClick, onChange }) => {
//   if (type === "search" || type === "text") {
//     if (label === "Customer Name") {
//       return (
//         <div className="flex flex-col flex-shrink-0 w-[130px] mb-1">
//           <label className="text-xs text-white mb-0.5 whitespace-nowrap">{label}</label>
//           <input
//             type="text"
//             value={value || ""}
//             onFocus={onCustomerInputClick}
//             readOnly
//             placeholder="Select Customer"
//             className="bg-teal-500 rounded px-2 py-1 h-7 text-xs text-gray-900 font-medium shadow-inner 
//                        focus:ring-1 focus:ring-teal-200 focus:outline-none cursor-pointer placeholder-gray-900"
//           />
//         </div>
//       );
//     }

//     return (
//       <div className="flex flex-col flex-shrink-0 w-[130px] mb-1">
//         <label className="text-xs text-white mb-0.5 whitespace-nowrap">{label}</label>
//         <input
//           type="text"
//           value={value || ""}
//           readOnly
//           onClick={onClick}
//           className={`bg-teal-500 rounded px-2 py-1 h-7 text-xs text-gray-900 font-medium shadow-inner 
//                      focus:ring-1 focus:ring-teal-200 focus:outline-none placeholder-gray-900
//                      ${onClick ? 'cursor-pointer hover:bg-teal-400 transition-colors' : ''}`}
//         />
//       </div>
//     );
//   }

//   if (type === "select") {
//     return (
//       <div className="flex flex-col flex-shrink-0 w-[130px] mb-1">
//         <label className="text-xs text-white mb-0.5 whitespace-nowrap">{label}</label>
//         <select
//           value={value || ""}
//           onChange={onChange}
//           className="bg-teal-500 rounded px-2 py-1 h-7 text-xs text-gray-900 font-medium shadow-inner 
//                      focus:ring-1 focus:ring-teal-200 focus:outline-none appearance-none cursor-pointer"
//           style={{
//             backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' 
//                               viewBox='0 0 20 20'%3E%3Cpath fill='%236B7280' 
//                               d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 
//                               10.828 5.757 6.586 4.343 8z'/%3E%3C/svg%3E")`,
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "right 0.5rem center",
//             backgroundSize: "0.75rem",
//           }}
//         >
//           <option value="">Select {label}</option>
//           {options && options.map((option, index) => (
//             <option key={index} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col flex-shrink-0 w-[130px] mb-1">
//       <label className="text-xs text-white mb-0.5 whitespace-nowrap">{label}</label>
//       <div
//         className={`bg-teal-500 rounded px-2 py-1 h-7 text-xs text-gray-900 font-medium 
//                     truncate flex items-center shadow-inner 
//                     cursor-${onClick ? "pointer" : "default"} 
//                     ${onClick ? "hover:bg-teal-400 transition-colors" : ""}`}
//         onClick={onClick}
//       >
//         {value || "-"}
//       </div>
//     </div>
//   );
// };

// const InfoBar = ({ currentCustomerName, onCustomerInputClick, onVoucherTypeChange, onBrokerChange, onTransportChange }) => {
//   const [fields, setFields] = useState({
//     no: "C1-240",
//     date: ISOString(),
//     customer: "",
//     broker: "",
//     transport: "",
//     QPay: "Q-Pay",
//     frequencyDays: "",
//     lastingBilling: "",
//     voucherType: "",
//     voucherTypeId: "",
//     godownType: "Main Location",
//     narrative: "",
//     monthAvgTon: "",
//     monthAvgAmma: "",
//     lane: "",
//     larry: "",
//     outstanding: "",
//     above300: "",
//     existingAccount: "",
//     Month_Avg_Ton: "",
//     Month_Avg_Amo: ""
//   });

//   const [voucherTypes, setVoucherTypes] = useState([]);
//   const [brokerOptions, setBrokerOptions] = useState([]);
//   const [transportOptions, setTransportOptions] = useState([]);
//   const [loading, setLoading] = useState({
//     voucher: false,
//     broker: false,
//     transport: false
//   });

//   const [showSearchModal, setShowSearchModal] = useState(false);
//   const [currentSearchType, setCurrentSearchType] = useState("customer");

//   useEffect(() => {
//     const fetchVoucherTypes = () => {
//       setLoading(prev => ({ ...prev, voucher: true }));
      
//       fetchLink({
//         address: `masters/voucher?module=POS`
//       })
//       .then((response) => {
//         console.log("Voucher API Response:", response);
//         if (response?.success && response.data) {
//           const types = response.data
//             .filter(item => item?.Voucher_Type && item?.Vocher_Type_Id) 
//             .map(item => ({
//               value: item.Vocher_Type_Id.toString(), 
//               label: item.Voucher_Type,    
//               id: item.Vocher_Type_Id,
//               name: item.Voucher_Type
//             }))
//             .filter((type, index, self) => 
//               self.findIndex(t => t.value === type.value) === index 
//             );
          
//           setVoucherTypes(types);
//           console.log("Processed voucher types:", types); 
//         } else {
//           console.warn("No voucher types found in response");
//           setVoucherTypes([]);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching voucher types:", error);
//         setVoucherTypes([]);
//       })
//       .finally(() => {
//         setLoading(prev => ({ ...prev, voucher: false }));
//       });
//     };

//     const fetchBrokers = () => {
//       setLoading(prev => ({ ...prev, broker: true }));
      
//       fetchLink({
//         address: `pos/brokers`
//       })
//       .then((response) => {
//         console.log("Brokers API Response:", response);
//         if (response?.data?.Brokers) {
//           const brokers = response.data.Brokers.map(broker => ({
//             value: broker.Broker_Id.toString(),
//             label: broker.Broker_Name
//           }));
//           setBrokerOptions(brokers);
//           console.log("Processed brokers:", brokers);
//         } else {
//           console.warn("No brokers found in response");
//           setBrokerOptions([]);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching brokers:", error);
//         setBrokerOptions([]);
//       })
//       .finally(() => {
//         setLoading(prev => ({ ...prev, broker: false }));
//       });
//     };

//     const fetchTransports = () => {
//       setLoading(prev => ({ ...prev, transport: true }));
      
//       fetchLink({
//         address: `pos/transporters`
//       })
//       .then((response) => {
//         console.log("Transporters API Response:", response);
//         if (response?.data?.Transporters) {
//           const transports = response.data.Transporters.map(transport => ({
//             value: transport.Transporter_Id.toString(),
//             label: transport.Transporter_Name
//           }));
//           setTransportOptions(transports);
//           console.log("Processed transporters:", transports);
//         } else {
//           console.warn("No transporters found in response");
//           setTransportOptions([]);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching transporters:", error);
//         setTransportOptions([]);
//       })
//       .finally(() => {
//         setLoading(prev => ({ ...prev, transport: false }));
//       });
//     };

//     fetchVoucherTypes();
//     fetchBrokers();
//     fetchTransports();
//   }, []);

//   const findBrokerIdByName = (brokerName) => {
//     if (!brokerName) return "";
//     const broker = brokerOptions.find(b => b.label === brokerName);
//     return broker ? broker.value : "";
//   };

//   const findTransportIdByName = (transportName) => {
//     if (!transportName) return "";
//     const transport = transportOptions.find(t => t.label === transportName);
//     return transport ? transport.value : "";
//   };

//   useEffect(() => {
//     if (currentCustomerName) {
//       const brokerId = findBrokerIdByName(currentCustomerName.Broker);
//       const transportId = findTransportIdByName(currentCustomerName.Transporter);
      
//       setFields((prev) => ({
//         ...prev,
//         customer: currentCustomerName.Short_Name || "",
//         broker: brokerId || currentCustomerName.Broker || "", 
//         transport: transportId || currentCustomerName.Transporter || "", 
//         QPay: currentCustomerName.QPay || "",
//         outstanding: currentCustomerName.Total_Outstanding || "",
//         frequencyDays: currentCustomerName.Frequency_Days || "",
//         lastingBilling: currentCustomerName.LastBilling_Amount || "",
//         voucherType: currentCustomerName.voucherTypes || "",
//         voucherTypeId: currentCustomerName.voucherTypeId || "",
//         godownType: currentCustomerName.godown_type || "Main Location",
//         narrative: currentCustomerName.narrative || "",
//         existingAccount: currentCustomerName.existing_account || "",
//         Month_Avg_Ton: currentCustomerName.Month_Avg_Ton || "",
//         Month_Avg_Amo: currentCustomerName.Month_Avg_Amo || ""
//       }));
//     }
//   }, [currentCustomerName, brokerOptions, transportOptions]);

//   const handleBrokerInputClick = () => {
//     setCurrentSearchType("broker");
//     setShowSearchModal(true);
//   };

//   const handleTransportInputClick = () => {
//     setCurrentSearchType("transport");
//     setShowSearchModal(true);
//   };

//   const handleBrokerSelect = (selectedBroker) => {
//     setFields(prev => ({
//       ...prev,
//       broker: selectedBroker.value
//     }));
//     if (onBrokerChange) {
//       onBrokerChange(selectedBroker);
//     }
//   };

//   const handleTransportSelect = (selectedTransport) => {
//     setFields(prev => ({
//       ...prev,
//       transport: selectedTransport.value
//     }));
//     if (onTransportChange) {
//       onTransportChange(selectedTransport);
//     }
//   };

//   const handleFieldChange = (fieldName) => (event) => {
//     const value = event.target.value;

//     if (fieldName === "voucherType") {
//       const selectedVoucher = voucherTypes.find(voucher => voucher.value === value);
      
//       setFields(prev => ({
//         ...prev,
//         voucherType: selectedVoucher ? selectedVoucher.label : "",
//         voucherTypeId: selectedVoucher ? selectedVoucher.value : ""
//       }));

//       if (onVoucherTypeChange && selectedVoucher) {
//         onVoucherTypeChange({
//           voucherTypeId: selectedVoucher.value,
//           voucherType: selectedVoucher.label
//         });
//       } else if (onVoucherTypeChange && value === "") {
//         onVoucherTypeChange({
//           voucherTypeId: "",
//           voucherType: ""
//         });
//       }
//     } else {
//       setFields(prev => ({
//         ...prev,
//         [fieldName]: value
//       }));
//     }
//   };

//   const getBrokerDisplayValue = () => {
//     const broker = brokerOptions.find(b => b.value === fields.broker);
//     return broker ? broker.label : fields.broker;
//   };

//   const getTransportDisplayValue = () => {
//     const transport = transportOptions.find(t => t.value === fields.transport);
//     return transport ? transport.label : fields.transport;
//   };

//   // FIX: Use voucherTypeId as the value for the select field
//   const allInfoFields = [
//     { label: "Date", value: fields.date },
//     { label: "Customer Name", value: fields.customer, type: "search", onCustomerInputClick },
//     { 
//       label: "Broker Name", 
//       value: getBrokerDisplayValue(), 
//       type: "text",
//       onClick: handleBrokerInputClick
//     },
//     { 
//       label: "Transport Name", 
//       value: getTransportDisplayValue(), 
//       type: "text",
//       onClick: handleTransportInputClick
//     },
//     { label: "QPay", value: fields.QPay },
//     { label: "Frequency Days", value: fields.frequencyDays },
//     { label: "Lasting billing Rs", value: fields.lastingBilling },
//     {
//       label: "Voucher Type",
//       value: fields.voucherTypeId, // Use voucherTypeId as the value
//       type: "select",
//       options: voucherTypes, 
//       onChange: handleFieldChange("voucherType") 
//     },
//     { label: "Narrative", value: fields.narrative, type: "text" },
//     { label: "Month Avg Ton", value: fields.Month_Avg_Ton },
//     { label: "Month Avg Amo", value: fields.Month_Avg_Amo },
//     { label: "Lane Lane", value: fields.lane },
//     { label: "Larry Street", value: fields.larry },
//     { label: "Total Outstanding", value: fields.outstanding },
//     { label: "Above 300 Days", value: fields.above300 },
//     { label: "Existing Account", value: fields.existingAccount }
//   ];

//   return (
//     <>
//       <div className="bg-teal-700 p-2.5 rounded-lg shadow-md mb-3 flex flex-wrap justify-start gap-x-3 gap-y-1 overflow-x-hidden">
//         {allInfoFields.map((field, index) => (
//           <InfoField 
//             key={`field-${index}`} 
//             {...field} 
//           />
//         ))}
        
//         {loading.voucher && (
//           <div className="flex flex-col flex-shrink-0 w-[130px] mb-1">
//             <label className="text-xs text-white mb-0.5 whitespace-nowrap">Voucher Type</label>
//             <div className="bg-teal-500 rounded px-2 py-1 h-7 text-xs text-gray-900 font-medium shadow-inner flex items-center justify-center">
//               Loading...
//             </div>
//           </div>
//         )}

//         {loading.broker && (
//           <div className="flex flex-col flex-shrink-0 w-[130px] mb-1">
//             <label className="text-xs text-white mb-0.5 whitespace-nowrap">Broker Name</label>
//             <div className="bg-teal-500 rounded px-2 py-1 h-7 text-xs text-gray-900 font-medium shadow-inner flex items-center justify-center">
//               Loading...
//             </div>
//           </div>
//         )}

//         {loading.transport && (
//           <div className="flex flex-col flex-shrink-0 w-[130px] mb-1">
//             <label className="text-xs text-white mb-0.5 whitespace-nowrap">Transport Name</label>
//             <div className="bg-teal-500 rounded px-2 py-1 h-7 text-xs text-gray-900 font-medium shadow-inner flex items-center justify-center">
//               Loading...
//             </div>
//           </div>
//         )}
//       </div>

//       {showSearchModal && (
//         <CustomerSearchModal
//           onClose={() => setShowSearchModal(false)}
//           onCustomerSelect={onCustomerInputClick}
//           onBrokerSelect={handleBrokerSelect}
//           onTransportSelect={handleTransportSelect}
//           searchType={currentSearchType}
//         />
//       )}
//     </>
//   );
// };

// export default InfoBar;