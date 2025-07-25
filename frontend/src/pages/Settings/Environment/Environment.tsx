// --- Environment.tsx ---
import React, { useEffect, useState } from "react";
import Button from "../../../components/ui/Button";
import AddEnvironment from "./AddEnvironment";
import DataTable from "datatables.net-react";
import DataTablesCore from "datatables.net-dt";
import { getAllEnvironments, createEnvironment, updateEnvironment, deleteEnvironment } from "../../../services/env_services/envService";
import { toast, ToastContainer } from "react-toastify";
import ConfirmModal from "../../../components/ui/ConfirmModal";


DataTable.use(DataTablesCore);

const Environment = () => {
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [environmentData, setEnvironmentData] = useState<any[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });


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

  const handleAddOrEdit = async (formData: Record<string, any>) => {
    try {
      if (selectedService) {
        await updateEnvironment(selectedService.id, formData);
      } else {
        await createEnvironment(formData);
      }
      setDialogOpen(false);
      setSelectedService(null);
      fetchEnvironment();
    } catch (err) {
      console.error("Failed to save environment", err);
    }
  };
  useEffect(() => {
    if (!loading) {
      const table = document.querySelector(".dataTable") as HTMLElement;
      table?.addEventListener("click", async (e: any) => {
        const target = e.target;
        const id = target.getAttribute("data-id");

        if (target.classList.contains("edit-btn")) {
          console.log(environmentData);

          const selected = environmentData.find((item) => item.id === id);
          setSelectedService(selected);
          setDialogOpen(true);
        }

        if (target.classList.contains("delete-btn")) {
          setConfirmDelete({ open: true, id });
        }
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


  const handleDeleteConfirmed = async () => {
    if (confirmDelete.id) {
      try {
        await deleteEnvironment(parseInt(confirmDelete.id));
        toast.success("Environment deleted successfully.");
        fetchEnvironment();
      } catch (err) {
        toast.error("Failed to delete environment.");
      }
    }
    setConfirmDelete({ open: false, id: null });
  };

  const columns = [
    // { title: "Env ID", data: "env_id" },
    { title: "Name", data: "name" },
    { title: 'Status', data: "status" },
    // { title: "Description", data: "description" },
    { title: "Cloud Name", data: "cloud.unique_Name", defaultContent: "-" },
    { title: "Git Name", data: "git.unique_Name", defaultContent: "-" },
    {
      title: "Actions", data: null, orderable: false, render: function (data: any, type: any, row: any) {
        return `
         <div class="flex gap-2">
        
          <button class="delete-btn text-red-600 hover:underline" data-id="${row.id}">Delete</button>
        </div>
      `
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Environments</h2>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedService(null);
            setDialogOpen(true);
          }}
        >
          Add Environment
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
        <ConfirmModal
          open={confirmDelete.open}
          message="Are you sure you want to delete this cloud service?"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmDelete({ open: false, id: null })}
        />
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

      <AddEnvironment
        visible={isDialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedService(null);
        }}
        onSubmit={handleAddOrEdit}
        initialData={selectedService}
      />
    </div>
  );
};

export default Environment;
