import AdminNav from "../components/admin/AdminNav";

export const metadata={
    title:'Jagan Admin',
    description:'Jagan Wood Furnitures Admin Dashboard'
};

const AdminLayout = ({children}:{children:React.ReactNode}) => {
    return ( <div>
        <AdminNav/>
        {children}
    </div> );
};
 
export default AdminLayout;