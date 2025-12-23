import React, { forwardRef, useRef,useState } from "react";
import { Dialog, DialogContent, DialogTitle, Button, DialogActions } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import { getSessionUser } from "../components/functions";
import { toast } from 'react-toastify';

const QuotationPrint = forwardRef(({ customer, cartItems, totals, storage }, ref) => {
 
  const safeNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
  const rupee = (n) =>
    safeNum(n).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div
      ref={ref}
      style={{
        width: "80mm",
        fontFamily: "Courier New, monospace",
        fontSize: "13px",
        padding: "3mm", 
        lineHeight: 1.4,
        color: "#000",
        fontWeight: "bold", 
      }}
    >

  
      <div style={{ 
        textAlign: "center", 
        fontWeight: "950", 
        borderBottom: "3px solid #000",
        marginBottom: "4mm", 
        fontSize: "18px", 
        paddingBottom: "3mm",
        textTransform: "uppercase",
        letterSpacing: "1px"
      }}>
        QUOTATION
      </div>


      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        marginBottom: "3mm", 
        minHeight: "5mm", 
        borderBottom: "2px solid #000",
        paddingBottom: "2mm",
        fontWeight: "950",
        fontSize: "12px" 
      }}>
        <div><strong>DATE:</strong> {new Date().toLocaleDateString("en-GB")}/{new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
        <div><strong>TAKEN:</strong> {storage?.UserName}</div>
      </div>


      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        marginBottom: "3mm", 
        minHeight: "5mm",
        fontWeight: "950"
      }}>
        <span style={{ 
          minWidth: "25mm", 
          fontWeight: 950,
          marginRight: "2mm", 
          fontSize: "13px"
        }}>PARTY NAME:</span>
        <div style={{ 
          flex: 1, 
          minHeight: "4mm", 
          fontSize: "13px", 
          fontWeight: "950"
        }}>{customer?.Billl_Name || customer?.Short_Name || "—"}</div>
      </div>

      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        marginBottom: "3mm", 
        minHeight: "5mm",
        fontWeight: "950"
      }}>
        <span style={{ 
          minWidth: "25mm", 
          fontWeight: 950, 
          marginRight: "2mm", 
          fontSize: "13px" 
        }}>LOCATION:</span>
        <div style={{ 
          flex: 1, 
          minHeight: "4mm", 
          fontSize: "13px",
          fontWeight: "950"
        }}>
          {[customer?.Party_Location, customer?.City].filter(Boolean).join(", ") || "—"}
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        marginBottom: "3mm", 
        minHeight: "5mm",
        fontWeight: "950"
      }}>
        <span style={{ 
          minWidth: "25mm", 
          fontWeight: 950, 
          marginRight: "2mm", 
          fontSize: "13px" 
        }}>PH.NO:</span>
        <div style={{ 
          flex: 1, 
          minHeight: "4mm", 
          fontSize: "13px",
          fontWeight: "950"
        }}>{customer?.Mobile_No || customer?.Land_Line || "—"}</div>
      </div>

      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        marginBottom: "3mm", 
        minHeight: "5mm",
        fontWeight: "950"
      }}>
        <span style={{ 
          minWidth: "25mm", 
          fontWeight: 950, 
          marginRight: "2mm", 
          fontSize: "13px" 
        }}>TRANSPORT:</span>
        <div style={{ 
          flex: 1, 
          minHeight: "4mm", 
          fontSize: "13px",
          fontWeight: "950"
        }}>{customer?.Transporter || "—"}</div>
      </div>

      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        marginBottom: "4mm", 
        minHeight: "5mm",
        fontWeight: "950"
      }}>
        <span style={{ 
          minWidth: "25mm", 
          fontWeight: 950, 
          marginRight: "2mm", 
          fontSize: "13px" 
        }}>BROKER:</span>
        <div style={{ 
          flex: 1, 
          minHeight: "4mm", 
          fontSize: "13px",
          fontWeight: "950"
        }}>{customer?.Broker || "—"}</div>
      </div>


 <table style={{ 
    width: "100%", 
    borderCollapse: "collapse", 
    marginTop: "4mm", 
    border: "3px solid #000", 
    fontSize: "15px", 
    fontWeight: "950" 
}}>
    <thead>
        <tr>
            <th style={{ 
                width: "5%", // EXTREMELY SMALL
                border: "2px solid #000", 
                padding: "1mm", // Minimal padding
                background: "#e0e0e0", 
                fontWeight: "950", 
                fontSize: "15px", // Very small font
                height: "6mm",
                textTransform: "uppercase"
            }}>RATE</th>
            <th style={{ 
                width: "85%", // MAXIMUM POSSIBLE
                border: "2px solid #000", 
                padding: "2mm",
                background: "#e0e0e0",
                fontWeight: "950",
                fontSize: "13px",
                height: "7mm",
                textTransform: "uppercase"
            }}>ITEM NAME</th>
            <th style={{ 
                width: "10%", // EXTREMELY SMALL
                border: "2px solid #000", 
                padding: "1mm", // Minimal padding
                background: "#e0e0e0",
                fontWeight: "950",
                fontSize: "15px", // Very small font
                height: "6mm",
                textTransform: "uppercase"
            }}>BAGS</th>
        </tr>
    </thead>
    <tbody>
        {cartItems && cartItems.length > 0 ? (
            cartItems.map((item, i) => (
                <tr key={i} style={{ height: "6mm", fontWeight: "950" }}>
                    <td style={{ 
                        border: "2px solid #000", 
                        textAlign: "center", 
                        verticalAlign: "top", 
                        padding: "1mm", // Minimal padding
                        fontWeight: "850", 
                        fontSize: "13px", // Very small font
                        width: "15%" // EXTREMELY SMALL
                    }}>₹{rupee(item.price)}</td>
                    <td style={{ 
                        border: "2px solid #000", 
                        textAlign: "left", 
                        padding: "2mm",
                        paddingLeft: "2mm",
                        fontWeight: "950",
                        fontSize: "15px",
                        width: "80%" // MAXIMUM POSSIBLE
                    }}>{item.Print_Name}</td>
                    <td style={{ 
                        border: "2px solid #000", 
                        textAlign: "center", 
                        padding: "0.5mm", 
                        fontWeight: "950",
                        fontSize: "15px", 
                        width: "15%" 
                    }}>{Number(item.qty).toFixed(0)}</td>
                </tr>
            ))
        ) : (
            Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} style={{ height: "6mm" }}>
                    <td style={{ border: "2px solid #000", height: "6mm", width: "5%" }}></td>
                    <td style={{ border: "2px solid #000", height: "6mm", width: "85%" }}></td>
                    <td style={{ border: "2px solid #000", height: "6mm", width: "10%" }}></td>
                </tr>
            ))
        )}
      
        <tr style={{ 
            fontWeight: "950", 
            background: "#d0d0d0", 
            borderTop: "3px solid #000" 
        }}>
            <td style={{ 
                // border: "2px solid #000", 
                // textAlign: "center",
                padding: "1mm",
                fontWeight: "950",
                fontSize: "11px",
                width: "10%" // Consistent width
            }}>
                <strong>₹{rupee(totals?.subtotal)}</strong>
            </td>
            <td style={{ 
                // border: "2px solid #000", 
                textAlign: "center",
                // padding: "2mm",
                fontWeight: "950",
                fontSize: "13px",
                width: "80%" // Consistent width
            }}>
                <strong>
                    {cartItems && cartItems.length > 0 
                        ? cartItems.reduce((sum, item) => sum + safeNum(item.kgs), 0).toFixed(2)
                        : "0.00"
                    } KGS
                </strong>
            </td>
            <td style={{ 
                // border: "2px solid #000", 
                textAlign: "center",
                padding: "2mm",
                fontWeight: "950",
                fontSize: "13px",
                width: "10%" // Consistent width
            }}>
                <strong>
                    {cartItems && cartItems.length > 0 
                        ? cartItems.reduce((sum, item) => sum + safeNum(item.qty), 0).toFixed(0)
                        : "0"
                    }
                </strong>
            </td>
        </tr>
    </tbody>
</table>
       {/* <table>
          <tbody>
            <tr style={{ 
            fontWeight: "950", 
            background: "#d0d0d0", 
            border: "3px solid #000", 
            borderTop:"0px solid #000"
        }}>
            <td style={{ 
                // border: "2px solid #000", 
                // textAlign: "center",
                padding: "2mm",
                fontWeight: "950",
                fontSize: "11px",
                width: "10%" // Consistent width
            }}>
                <strong>₹{rupee(totals?.subtotal)}</strong>
            </td>
            <td style={{ 
                // border: "2px solid #000", 
                textAlign: "center",
                padding: "2mm",
                fontWeight: "950",
                fontSize: "13px",
                width: "80%" // Consistent width
            }}>
                <strong>
                    {cartItems && cartItems.length > 0 
                        ? cartItems.reduce((sum, item) => sum + safeNum(item.kgs), 0).toFixed(2)
                        : "0.00"
                    } KGS
                </strong>
            </td>
            <td style={{ 
                // border: "2px solid #000", 
                textAlign: "center",
                padding: "1mm",
                fontWeight: "950",
                fontSize: "13px",
                width: "10%" // Consistent width
            }}>
                <strong>
                    {cartItems && cartItems.length > 0 
                        ? cartItems.reduce((sum, item) => sum + safeNum(item.qty), 0).toFixed(0)
                        : "0"
                    }
                </strong>
            </td>
        </tr>
          </tbody>
        </table> */}
    </div>
  );
});

QuotationPrint.displayName = "QuotationPrint";

const PrintPreviewModal = ({ open, onClose, customer, cartItems, totals, onPrintAndSave, storage,   isReprint = false }) => {
  
  const printRef = useRef();
  const[isPrinting,setIsPrinting]=useState(false)
  const handlePrint = useReactToPrint({
    contentRef: printRef, 
    documentTitle: "QuotationBill",
    onAfterPrint: () => {
      toast.success("Print completed successfully");
    },
    onError: (err) => {
      console.error("Print Error:", err);
      toast.error("Print failed");
    },
  });
 const handleReactPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "QuotationBill",
    onBeforeGetContent: () => {
      setIsPrinting(true);
    },
    onAfterPrint: () => {
      setIsPrinting(false);
      toast.success("Print completed successfully");
    },
    onError: (err) => {
      setIsPrinting(false);
      console.error("Print Error:", err);
      toast.error("Print failed");
    },
  });
  const handlePrintAndSave = async () => {
    setIsPrinting(true);
    try {
      if (isReprint) {
     

        await handleReactPrint(); 
        toast.success("Order reprinted successfully");
        return true;
      } else {
    
        const result = await onPrintAndSave();
        if (result) {
    
          await handleReactPrint();
        }
        return result;
      }
    } catch (error) {
      console.error('Error in print operation:', error);
      toast.error('Error printing order');
      return false;
    } finally {
      setIsPrinting(false);
    }
  };


 
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle style={{ fontWeight: "bold", fontSize: "20px" }}>
        {isReprint ? 'Reprint Quotation' : 'Print Preview - Quotation'}
      </DialogTitle>
    
      <DialogContent>
        <QuotationPrint 
          ref={printRef} 
          customer={customer} 
          cartItems={cartItems} 
          totals={totals} 
          storage={storage} 
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          variant="outlined"
          disabled={isPrinting}
        >
          Close
        </Button>
        <Button 
          variant="contained" 
          onClick={handlePrintAndSave} 
          disabled={isPrinting}
          style={{ fontWeight: "bold" }}
        >
          {isPrinting ? 'Processing...' : (isReprint ? 'Print' : 'Print & Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintPreviewModal;