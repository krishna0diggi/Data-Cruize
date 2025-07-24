import React, { useEffect, useState } from 'react'
import { getAllEnvironments } from '../../services/env_services/envService'
import DataTable from "datatables.net-react";
import DataTablesCore from "datatables.net-dt";
import { ToastContainer, toast } from 'react-toastify';
import ConfirmModal from '../../components/ui/ConfirmModal';

DataTable.use(DataTablesCore)

const DatabricksEnvironment = () => {

    const [loading, setLoading] = useState(true);
    const [environmentData, setEnvironmentData] = useState<any[]>([]);

    const fetchEnvironment = async () => {
        setLoading(true);
        try {
            const data = await getAllEnvironments();
            setEnvironmentData(data);
        } catch (err) {
            console.error("Error fetching environments", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEnvironment();
    }, []);

    useEffect(() => {
        if (!loading) {
            const table = document.querySelector(".dataTable") as HTMLElement;
            table?.addEventListener("click", async (e: any) => {
                const target = e.target;
                const id = target.getAttribute("data-id");

                //   if (target.classList.contains("edit-btn")) {
                //     console.log(environmentData);

                //     const selected = environmentData.find((item) => item.id === id);
                //     setSelectedService(selected);
                //     setDialogOpen(true);
                //   }

                //   if (target.classList.contains("delete-btn")) {
                //     setConfirmDelete({ open: true, id });
                //   }
                if (target.classList.contains("publish-btn")) {
                    // Call your publish API here
                    console.log("Publishing", id);
                }
            });

            return () => {
                table?.removeEventListener("click", () => { });
            };


        }

    }, [loading, environmentData])


    const columns = [
        { title: "Env ID", data: "env_id" },
        { title: "Name", data: "name" },
        { title: 'Status', data: "status" },
        // { title: "Description", data: "description" },
        { title: "Cloud Name", data: "cloud.unique_Name", defaultContent: "-" },
        { title: "Git Name", data: "git.unique_Name", defaultContent: "-" },
        {
            title: "Actions", data: null, orderable: false, render: function (data: any, type: any, row: any) {
                return `
         <div class="flex gap-2">
        
          <button class="delete-btn text-red-600 hover:underline" data-id="${row.id}">Publish</button>
        </div>
      `
            }
        }
    ];

    return (
          <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Databricks Environment</h1>
      </div>

        <div>
            <div className="bg-white rounded shadow p-4">
             
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable
                        data={environmentData}
                        columns={columns}
                        className="stripe hover"
                        options={{
                            dom: `
                <'flex flex-col md:flex-row justify-between items-center gap-4 mb-4'lf>
                <'overflow-x-auto't>
                <'flex flex-col md:flex-row justify-between items-center gap-4 mt-4'ip>
              `,
                            paging: true,
                            searching: true,
                            lengthChange: true,
                            info: true,
                        }}
                    />
                )}
            </div>
        </div>
    </div>
      
    )
}

export default DatabricksEnvironment