

// import React, { useMemo,useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { fetchLink } from './fetchComponent';
// const BRAND_API_URL = 'https://erpsmt.in/api/pos/posbrand';


// const CategoryPanel = ({ activeCategoryId, onCategoryClick }) => {
//     const [categories, setCategories] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

// const fetchBrands = useCallback(() => {
//     setIsLoading(true);
//     setError(null);
    
//     fetchLink({ address: `pos/posbrand` })
//         .then(response => {
//             console.log("Brand API Response:", response); 
            
//             const brandData = response?.data?.Pos_Brand;
            
//             if (brandData && Array.isArray(brandData) && brandData.length > 0) {
//                 const brandEntries = brandData[0]?.Brand_Entry;
                
//                 if (brandEntries && Array.isArray(brandEntries)) {
//                     const cleanedCategories = brandEntries.map(b => ({
//                         id: b.POS_Brand_Id, 
//                         name: b.POS_Brand_Name,
//                     }));

//                     setCategories([{ id: 'all', name: 'All Categories' }, ...cleanedCategories]);
//                     console.log("Categories set:", cleanedCategories); 
//                 } else {
//                     console.warn("No Brand_Entry found in response");
//                     setCategories([{ id: 'all', name: 'All Categories' }]);
//                 }
//             } else {
//                 console.warn("No Pos_Brand data found in response");
//                 setCategories([{ id: 'all', name: 'All Categories' }]);
//             }
//         })
//         .catch(err => {
//             console.error("Error fetching brand data:", err);
//             setError("Failed to fetch categories. Check console for details.");
//             setCategories([{ id: 'all', name: 'All Categories' }]);
//         })
//         .finally(() => {
//             setIsLoading(false);
//         });
// }, []);
//     useEffect(() => {
//         fetchBrands();
//     }, [fetchBrands]);

// const maxButtonWidth = useMemo(() => {
//     if (categories.length === 0) return 'auto';
    
//     // Test different widths
//     const widths = {
//         1: '120px',
//         2: '140px', 
//         3: '160px',
//         4: '180px',
//         5: '200px',
//         6: '220px',
//         7: '240px'
//     };
    
//     const maxLength = Math.max(...categories.map(cat => cat.name.length));
//     console.log("maxLength:", maxLength, "Longest category:", categories.find(cat => cat.name.length === maxLength)?.name);
    

//     if (maxLength <= 5) return widths[1];
//     if (maxLength <= 8) return widths[2];
//     if (maxLength <= 12) return widths[3];
//     if (maxLength <= 15) return widths[4];
//     if (maxLength <= 18) return widths[5];
//     if (maxLength <=20) return widths[6];
//     if(maxLength <=22) return widths[7]
//     return widths[7];
// }, [categories]);

//     const midPoint = Math.ceil(categories.length / 2);
//     const firstRow = categories.slice(0, midPoint);
//     const secondRow = categories.slice(midPoint);



//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center py-2 mb-4 bg-white rounded-lg shadow-md">
//                 <span className="text-gray-500">Loading Categories...</span>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex justify-center items-center py-2 mb-4 bg-red-100 rounded-lg border border-red-300">
//                 <span className="text-red-700 text-sm">Error loading categories.</span>
//             </div>
//         );
//     }

//     return (
//         <div className="py-3 mb-4 bg-white rounded-lg shadow-md border border-gray-200">
          
//             <div className="flex justify-start space-x-3 px-4 mb-2">
//                 {firstRow.map((category) => (
//                     <button
//                         key={category.id}
//                         onClick={() => onCategoryClick(category.id)}
//                          style={{ width: maxButtonWidth }}
//                         className={`
//                             inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
//                             ${activeCategoryId === category.id 
//                                 ? 'bg-pos-header text-white shadow-lg transform scale-105'
//                                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                             }
//                         `}
//                     >
//                         {category.name}
//                     </button>
//                 ))}
//             </div>
            
          
//             <div className="flex justify-start space-x-3 px-4">
//                 {secondRow.map((category) => (
//                     <button
//                         key={category.id}
//                         onClick={() => onCategoryClick(category.id)}
//                          style={{ width: maxButtonWidth }}
//                         className={`
//                             inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
//                             ${activeCategoryId === category.id 
//                                 ? 'bg-pos-header text-white shadow-lg transform scale-105'
//                                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                             }
//                         `}
//                     >
//                         {category.name}
//                     </button>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default CategoryPanel;

















import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchLink } from './fetchComponent';

const CategoryPanel = ({ activeCategoryId, onCategoryClick }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBrands = useCallback(() => {
        setIsLoading(true);
        setError(null);
        
        fetchLink({ address: `pos/posbrand` })
            .then(response => {
         
                
                const brandData = response?.data?.Pos_Brand;
                
                if (brandData && Array.isArray(brandData) && brandData.length > 0) {
                    const brandEntries = brandData[0]?.Brand_Entry;
                    
                    if (brandEntries && Array.isArray(brandEntries)) {
                        const cleanedCategories = brandEntries.map(b => ({
                            id: b.POS_Brand_Id, 
                            name: b.POS_Brand_Name,
                        }));

                        setCategories([{ id: 'all', name: 'All Categories' }, ...cleanedCategories]);
                     
                    } else {
                        console.warn("No Brand_Entry found in response");
                        setCategories([{ id: 'all', name: 'All Categories' }]);
                    }
                } else {
                    console.warn("No Pos_Brand data found in response");
                    setCategories([{ id: 'all', name: 'All Categories' }]);
                }
            })
            .catch(err => {
                console.error("Error fetching brand data:", err);
                setError("Failed to fetch categories. Check console for details.");
                setCategories([{ id: 'all', name: 'All Categories' }]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);



  const getButtonWidth = (name) => {
    const baseWidth = 100;
    const charWidth = 100; 
    const calculatedWidth = baseWidth + name.length * charWidth;
    return `${Math.min(Math.max(100, calculatedWidth), 180)}px`; 
  };

  const midPoint = Math.ceil(categories.length);
  const firstRow = categories.slice(0, midPoint);
  const secondRow = categories.slice(midPoint);


    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-2 mb-4 bg-white rounded-lg shadow-md">
                <span className="text-gray-500">Loading Categories...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-2 mb-4 bg-red-100 rounded-lg border border-red-300">
                <span className="text-red-700 text-sm">Error loading categories.</span>
            </div>
        );
    }

   return (
    <div className="py-3 mb-4 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* First Row */}
      <div className="flex flex-wrap justify-start gap-3 px-4 mb-2">
        {firstRow.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            style={{ width: getButtonWidth(category.name) }}
            className={`
              inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap
              ${activeCategoryId === category.id
                ? 'bg-orange-600 text-white shadow-md scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Second Row */}
      <div className="flex flex-wrap justify-start gap-3 px-4">
        {secondRow.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            style={{ width: getButtonWidth(category.name) }}
            className={`
              inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap
              ${activeCategoryId === category.id
                ? 'bg-orange-600 text-white shadow-md scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryPanel;