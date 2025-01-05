import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, setSearch } = useContext(ShopContext); // Get products from context
  const [showFilter, setShowFilter] = useState(false);

  const [filterProducts, setFilterProducts] = useState(products);  // Initial filter is all products

  const [category, setCategory] = useState([]);  // Categories selected by the user
  const [subcategory, setSubCategory] = useState([]);  // Subcategories selected by the user
  const [sortType, setSortType] = useState('relevent');  // Sorting type

  // Update filterProducts based on selected category, subcategory, and sortType
  useEffect(() => {
    let filtered = products.slice();

    // Filter by search term
    if (search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) // Search filter
      );
    }

    // Filter by category if any categories are selected
    if (category.length > 0) {
      filtered = filtered.filter(product =>
        category.includes(product.category) // Assuming each product has a 'category' property
      );
    }

    // Filter by subcategory if any subcategories are selected
    if (subcategory.length > 0) {
      filtered = filtered.filter(product =>
        subcategory.includes(product.subCategory) // Assuming each product has a 'subcategory' property
      );
    }

    // Sort products based on sortType
    switch (sortType) {
      case 'low-high':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        // No sorting needed for "relevant"
        break;
    }

    // Update the filtered products after sorting
    setFilterProducts(filtered);

  }, [category, subcategory, sortType, products, search]); // Dependency array ensures it re-runs on category, subcategory, or sortType change

  // Handle toggling of categories
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);  // Remove category if already selected
      } else {
        return [...prev, value];  // Add category to filter list
      }
    });
  };

  // Handle toggling of subcategories
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);  // Remove subcategory if already selected
      } else {
        return [...prev, value];  // Add subcategory to filter list
      }
    });
  };

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      <div className='min-w-60'>
        <p className='my-2 text-xl flex items-center cursor-pointer gap-2' onClick={() => setShowFilter(prevState => !prevState)}>
          FILTERS <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="Dropdown Icon" />
        </p>

        {/* Categories Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>Categories</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input type="checkbox" value={'Men'} onChange={toggleCategory} /> Men
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" value={'Women'} onChange={toggleCategory} /> Women
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" value={'Kids'} onChange={toggleCategory} /> Kids
            </p>
          </div>
        </div>

        {/* Subcategories Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>Type</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input type="checkbox" value={'Topwear'} onChange={toggleSubCategory} /> Topwear
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory} /> Bottomwear
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" value={'Winterwear'} onChange={toggleSubCategory} /> Winterwear
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relevent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Display filtered products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item, index) => (
              <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Collection;
