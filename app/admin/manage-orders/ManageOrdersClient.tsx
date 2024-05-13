'use client'

import { Order, User } from "@prisma/client";
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import { MdAccessTimeFilled,  MdDeliveryDining, MdDone, MdRemoveRedEye } from "react-icons/md";
import ActionBts from "@/app/components/ActionBts";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import moment from "moment";
import getOrderById from "@/actions/getOrderById";

interface ManageOrdersClientProps {
    orders: ExtendedOrder[];
}

type ExtendedOrder = Order & {
    user:User
}

const ManageOrdersClient: React.FC<ManageOrdersClientProps> = ({ orders, }) => {
    
    
    const router=useRouter();
    // const storage = getStorage(firebaseApp);   
    let rows: any = [];

    if (orders) {
        rows = orders.map((order) => {
            return {
                id: order.id,
                customer: order.user.name,
                amount: formatPrice(order.amount/100),
                paymentStatus: order.status,
                date: moment(order.createDate).fromNow(),
                deliveryStatus: order.deliveryStatus,
            };
        });
    }
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 220 },

        { field: 'customer', headerName: 'Customer Name', width: 130 },

        //<div>Date : {moment(order.createDate).fromNow()}</div>

        {
            field: 'amount',
            headerName: 'Amount(INR)',
            width: 130,
            renderCell: (params) => {
                return (
                    <div className="font-bold text-slate-800">{params.row.amount}</div>
                );
            },
        },
        {
            field: 'createDate',
            headerName: 'Date',
            width: 130,
            renderCell: (params) => {
                return (
                    <div className="font-bold text-slate-800">
                        {moment(params.row.createDate).fromNow()}
                    </div>
                );
            },
        },
        

        {
            field: 'paymentStatus',
            headerName: 'Payment Status',
            width: 130,
            renderCell: (params) => {
                return (
                    <div >{params.row.paymentStatus === 'pending' ? <Status 
                        text="Pending"
                        icon={MdAccessTimeFilled}
                        bg="bg-slate-200"
                        color="text-slate-700"
                    /> : params.row.paymentStatus === 'complete' ? (
                    <Status 
                        text="Completed"
                        icon={MdDone}
                        bg="bg-green-200"
                        color="text-green-700"
                    /> 
                    ): (<></>)}
                    </div>
                );
            },
        },
        {
            field: 'deliveryStatus',
            headerName: 'Delivery Status',
            width: 130,
            renderCell: (params) => {
                return (
                    <div >{params.row.deliveryStatus === 'pending' ? 
                    <Status 
                        text="Pending"
                        icon={MdAccessTimeFilled}
                        bg="bg-slate-200"
                        color="text-slate-700"
                    /> : params.row.deliveryStatus === 'dispatched' ? (
                    <Status 
                        text="Dispatched"
                        icon={MdDeliveryDining}
                        bg="bg-purple-200"
                        color="text-purple-700"
                    /> 
                    ):params.row.deliveryStatus === 'delivered' ? (
                        <Status 
                            text="Delivered"
                            icon={MdDone}
                            bg="bg-green-200"
                            color="text-green-700"
                        /> 
                        ) : <></>}
                    </div>
                );
            },
        },

        

        {
            field: 'actions', 
            headerName: 'Actions', 
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="flex justify-between gap-4 w-full">
                        <ActionBts
                         icon={MdDeliveryDining} 
                        onClick={()=>{
                            handleDispatch(params.row.id);
                        }}/>
                        <ActionBts 
                        icon={MdDone}
                         onClick={()=>{
                            handleDeliver(params.row.id);
                        }}/>
                      <ActionBts 
                        icon={MdRemoveRedEye}
                         onClick={()=>{
                            router.push(`/admin/order/${params.row.id}`)
                        }}/>
                    </div>
                );
            },
        },

    ];

    const handleDispatch = useCallback((id:string)=>{
        axios.put('/api/order',{ 
            id,
            deliveryStatus:'dispatched'
            // inStock:!inStock
        }).then((res)=>{
            toast.success("Order Dispatched")
            router.refresh()
        }).catch((err)=>{
            toast.error("Oops!Something went wrong")
            console.log(err)
        });
    },[]);


const handleDeliver = useCallback((id:string)=>{
        axios.put('/api/order',{
            id,
            deliveryStatus:'delivered'
            // inStock:!inStock
        }).then((res)=>{
            toast.success("Order Delivered")
            router.refresh()
        }).catch((err)=>{
            toast.error("Oops!Something went wrong")
            console.log(err)
        });
    },[]);
    
    return (
        <div className="max-w-[1150px] m-auto text-xl">
            <div className="mb-4 mt-8">
                <Heading title="Manage Orders" center/>
            </div>
            <div style={{
                height:600,width:"100%"
            }}>
                <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 20]}
                checkboxSelection
                disableRowSelectionOnClick
            />
            </div>
            
        </div>);
}

export default ManageOrdersClient;