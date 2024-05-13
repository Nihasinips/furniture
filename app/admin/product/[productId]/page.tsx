import Container from "@/app/components/Container";
import NullData from "@/app/components/NullData";
import ProductDetails from './ProductDetails';
import getProductById from "@/actions/getProductById";


interface Iprams {
    productId?:string;
}

const Product = async ({params}:{params:Iprams})=>{
    const product = await getProductById(params);
    if(!product) return <NullData title="There is no such product"></NullData>
    return (
      <div>  
        <Container>
            <ProductDetails product={product}/>
        </Container>
        </div>
    );
};

export default Product;

