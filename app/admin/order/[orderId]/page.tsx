import Container from "@/app/components/Container";
import NullData from "@/app/components/NullData";
import getOrderById from "@/actions/getOrderById";
import OrderDetails from "./OrderDetails";


interface Iprams {
    orderId?:string;
}

const Order = async ({params}:{params:Iprams})=>{
    const order = await getOrderById(params);
    if(!order) return <NullData title="There is no such order"></NullData>
    return (
      <div>  
        <Container>
            <OrderDetails order={order}/>
        </Container>
        </div>
    );
};

export default Order;

