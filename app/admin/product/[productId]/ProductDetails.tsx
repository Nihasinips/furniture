'use client'

import Heading from '@/app/components/Heading';
import Status from '@/app/components/Status';
import { formatPrice } from '@/utils/formatPrice';
import { Product } from '@prisma/client';
import Image from "next/image";

interface ProductDetailsProps {
    product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
    return (
        <div className='max-w-[1150px] m-auto flex flex-col gap-2'>
            <div className='mt-8'>
                <Heading title="Product Details" />
            </div>
            <div><strong>Product ID:</strong> {product.id}</div>
            <div><strong>Total Amount:</strong> <span className='font-bold'>{formatPrice(product.price)}</span></div>
            <div><strong>Description:</strong> {product.description}</div>
            <div><strong>Brand:</strong> {product.brand}</div>
            <div><strong>Category:</strong> {product.category}</div>
            <div><strong>In Stock:</strong> {product.inStock ? 'Yes' : 'No'}</div>
            <div className="grid grid-cols-5 text-xs md:text-sm gap-4 border-t-[1.5px] border-slate-200 py-4 items-center">
                {product.images.map((image, index) => (
                    <div key={index} className="col-span-2 flex flex-col md:flex-row gap-2 md:gap-4 justify-start items-center">
                        <div className="relative w-[200px] h-[200px]"> 
                            <Image src={image.image} alt={`Product Image ${index + 1}`} layout="fill" objectFit="contain" />
                        </div>
                        <div><strong>Color:</strong> {image.color}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductDetails;
