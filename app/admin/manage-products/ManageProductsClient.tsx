'use client'

import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { formatPrice } from "@/utils/formatPrice";
import { dividerClasses } from "@mui/material";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import { MdCached, MdClose, MdDelete, MdDone, MdRemoveRedEye } from "react-icons/md";
import ActionBts from "@/app/components/ActionBts";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "@/libs/firebase";

interface ManageProductsClientProps {
    products: Product[]
}

const ManageProductsClient: React.FC<ManageProductsClientProps> = ({ products }) => {
    
    
    const router=useRouter();
    const storage = getStorage(firebaseApp);   
    let rows: any = []

    if (products) {
        rows = products.map((product) => {
            return {
                id: product.id,
                name: product.name,
                price: formatPrice(product.price),
                category: product.category,
                brand: product.brand,
                inStock: product.inStock,
                images: product.images,
            }
        })
    }
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 220 },

        { field: 'name', headerName: 'Name', width: 220 },

        {
            field: 'price',
            headerName: 'Price(INR)',
            width: 100,
            renderCell: (params) => {
                return (
                    <div className="font-bold text-slate-800">{params.row.price}</div>
                );
            },
        },
        { field: 'category', headerName: 'Category', width: 100 },

        { field: 'brand', headerName: 'Brand', width: 100 },

        {
            field: 'inStock',
            headerName: 'inStock',
            width: 120,
            renderCell: (params) => {
                return (
                    <div >{params.row.inStock === true ? <Status 
                        text="in stock"
                        icon={MdDone}
                        bg="bg-teal-200"
                        color="text-teal-700"
                    /> : 
                    <Status 
                        text="out of stock"
                        icon={MdClose}
                        bg="bg-rose-200"
                        color="text-rose-700"
                    /> 
                    }</div>
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
                        <ActionBts icon={MdCached} onClick={()=>{
                            handleToggleStock(params.row.id,params.row.inStock);
                        }}/>
                        <ActionBts icon={MdDelete} onClick={()=>{
                            handleDelete(params.row.id,params.row.images);
                        }}/>
                        <ActionBts icon={MdRemoveRedEye} onClick={()=>{
                             router.push(`/admin/product/${params.row.id}`); 
                        }}/>
                    </div>
                );
            },
        },

    ];

    const handleToggleStock = useCallback((id:string,inStock:boolean)=>{
        axios.put('/api/product',{
            id,
            inStock:!inStock
        }).then((res)=>{
            toast.success("Product status changed")
            router.refresh()
        }).catch((err)=>{
            toast.error("Oops!Something went wrong")
            console.log(err)
        });
    },[]);

    const handleDelete = useCallback(async(id:string,images:any[])=>{
        toast('Deleting product, please wait!')
    
        const handleImageDelete = async()=>{
            try {
                for(const item of images){
                    if(item.image){
                        const imageRef = ref(storage,item.image);
                        await deleteObject(imageRef)
                        console.log('Image deleted',item.image);
                    }
                }
            } catch (error) {
                console.error("Deleting images error", error);
                // Handle error
            }
        };
    
        await handleImageDelete()
    
        try {
            const response = await axios.delete(`/api/product/${id}`);
            if (response.status === 200) {
                toast.success("Product deleted")
                router.refresh();
            } else {
                toast.error('Failed to delete product');
                console.error("Failed to delete product", response);
            }
        } catch (error) {
            toast.error('Failed to delete product');
            console.error("Failed to delete product", error);
        }
    },[]);
    

    return (
        <div className="max-w-[1150px] m-auto text-xl">
            <div className="mb-4 mt-8">
                <Heading title="Manage Products" center/>
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

export default ManageProductsClient;