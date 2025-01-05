import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory }) => {

    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);
    useEffect(() => {
        if (products.length > 0) {
            let productscopy = products.slice();
            productscopy = productscopy.filter((item) => category === item.category);
            productscopy = productscopy.filter((item) => subCategory === item.subCategory);
            setRelated(productscopy.slice(0, 5));
        }
       
    }, [products])
    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'RELATED'} text2={'PRODUCTS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore fugiat delectus accusamus iure illum voluptatibus dolor impedit, ducimus eum corporis repellendus veniam et quasi nam sint nesciunt fugit adipisci fuga.</p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    related.map((item, index) => (
                        <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))

                }

            </div>



        </div>
    )
}

export default RelatedProducts