import { useContext, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Provider/Provider";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { DataGrid } from '@mui/x-data-grid';



const MyEmployeeList = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);

  


 
    // const [perPageProducts, setPerPageProducts] = useState(10);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [total, setTotal] = useState(null);
    // console.log(total)

    // const totalPages = Math.ceil(total / perPageProducts);

    // // console.log(totalPages)

    // const pages = [...Array(totalPages).keys()];

    // // console.log(pages)


    const { data: MyEmployeeList = [], refetch } = useQuery({
        queryKey: ['MyEmployeeList', user?.email],


        queryFn: async () => {
            const res = await axiosSecure.get(`/myEmployees/${user.email}`);
            console.log(res.data);
            // setTotal(res.data.length);
            return res.data;
        },

    })
    console.log(MyEmployeeList);

    const columns = [
        
        { field: 'id', headerName: 'SL', width: 100,  },
        {
            field: 'Image',
            headerName: 'Image',
            width: 300,
            renderCell: (params) => (
              <img
                src={params.row.Image}  // Assuming 'Image' is the key for the image URL in your data
                alt="Employee Avatar"
                style={{ width: '50px', height: '50px', borderRadius: '50%'}}
              />
            ),
          },
          { field: 'Name', headerName: 'Name', width: 300, },
          {
            field: 'Action',
            headerName: 'Action',
            width: 300,
            renderCell: (params) => (
                console.log(params),
              <button
                onClick={() => handleRemove(params.row._id, params.row.email)}
                className="btn bg-red-500 btn-sm text-white"
              >
                Remove from Team
              </button>
            ),
          },
        
    
    
    ];

    const rows = MyEmployeeList.map((employee,idx) => ({
        id: idx+1,
        Name: employee.name,
        Image: employee.image,
        _id: employee._id,  // Add _id and email to the rows
        email: employee.email,
        
        
        // Add other fields based on your employee data structure
      }));


    const handleRemove = async (employeeId, email) => {

        console.log(employeeId, email)

        const res = await axiosSecure.delete(`/removeEmployee/${employeeId}/${email}`);

        console.log(res.data);

        if (res.data.result.deletedCount > 0) {

            Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Successfully Deleted from Your Team",

            });

            refetch();
        }
    }

    // const handlePrev = () => {

    // }
    // const handleNext = () => {

    // }
    return (
        <div className="max-w-screen-xl mx-auto ">
            <Helmet>
                <title>Employee | Lists</title>
            </Helmet>

            <div style={{ height: '550px', width: '100%', marginTop: '30px'  }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 15]}
                    // checkboxSelection
                />
            </div>
            {/* <div>
                <div className="overflow-x-auto">
                    <table className="table">
                        
                        <thead>
                            <tr>
                                <th>
                                    <label>
                                        <input type="checkbox" className="checkbox" />
                                    </label>
                                </th>
                                <th>SL</th>
                                <th>Employee Image</th>
                                <th>Employee Name</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                MyEmployeeList?.map((employee, idx) => (
                                    <tr key={employee._id}>
                                        <th>
                                            <label>
                                                <input type="checkbox" className="checkbox" />
                                            </label>
                                        </th>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <p>{idx + 1}</p>
                                                
                                            </div>
                                        </td>
                                        <td>
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={employee?.image} alt="Avatar Tailwind CSS Component" />
                                            </div>


                                        </td>
                                        <td>{employee.name}</td>
                                        <th>
                                            <button onClick={() => handleRemove(employee._id, employee.email)} className="btn bg-red-500 btn-sm text-white">Remove from Team</button>
                                        </th>
                                    </tr>
                                ))
                            }

                        </tbody>



                    </table>

                
                </div>
            </div> */}



        </div>
    );
};

export default MyEmployeeList;