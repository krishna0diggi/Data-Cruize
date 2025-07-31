import { useEffect, useState } from "react";
import AddHyperscaler from "./AddHyperscaler";
import Button from "../../../components/ui/Button";
import {
  getAllCloudServices,
  createCloudService,
  UpdateCloudService,
  deleteCloudService,
} from "../../../services/cloud_services/cloudService";
import ConfirmModal from '../../../components/ui/ConfirmModal';

// DataTables
import DataTable from "datatables.net-react";
import DataTablesCore from "datatables.net-dt";
import "datatables.net-rowgroup-dt"; // Optional: Grouping
import { ToastContainer, toast } from 'react-toastify';

DataTable.use(DataTablesCore);

type CloudService = {
  id: string;
  provider: string;
  account: string;
  unique_Name: string;
  subscription_id: string;
  tenant_id?: string | null;
  client_id?: string | null;
  client_secret?: string | null;
  arm_access_key?: string | null;
  region: string;
  role: string;
  cloud_id: string;
};

export default function HyperScaler() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [cloudServices, setCloudServices] = useState<CloudService[]>([]);
  const [selectedService, setSelectedService] = useState<CloudService | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloudNames, setCloudNames] = useState<string[]>([]);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  const fetchCloudServices = async () => {
    setLoading(true);
    try {
      const data = await getAllCloudServices(0, 1000, "");
      setCloudServices(data);
      setCloudNames(data.map((service: CloudService) => service.unique_Name));
    } catch (err) {
      toast.error("Error fetching cloud services");
      console.error("Error fetching cloud services", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCloudServices();
  }, []);

  useEffect(() => {
    if (!loading) {
      const table = document.querySelector(".dataTable") as HTMLElement;
      const clickHandler = async (e: any) => {
        const target = e.target;
        const id = target.getAttribute("data-id");

        if (target.classList.contains("edit-btn")) {
          const selected = cloudServices.find((item) => item.id === id);
          setSelectedService(selected ?? null);
          setDialogOpen(true);
          setEdit(true);
        }

        if (target.classList.contains("delete-btn")) {
          setConfirmDelete({ open: true, id });
        }
      };

      table?.addEventListener("click", clickHandler);
      return () => table?.removeEventListener("click", clickHandler);
    }
  }, [loading, cloudServices]);

  const handleDeleteConfirmed = async () => {
    if (confirmDelete.id) {
      try {
        await deleteCloudService(parseInt(confirmDelete.id));
        toast.success("Cloud service deleted successfully.");
        fetchCloudServices();
      } catch (err) {
        toast.error("Failed to delete cloud service.");
      }
    }
    setConfirmDelete({ open: false, id: null });
  };

  const handleAddOrEdit = async (formData: Record<string, any>) => {
    try {
      if (formData.id) {
        await UpdateCloudService(formData.id, formData);
        toast.success("Cloud service updated successfully.");
      } else {
        await createCloudService(formData);
        toast.success("Cloud service created successfully.");
        formData.id = '',
        formData.cloud_id = '',
        formData.unique_Name = '';
        formData.subscription_id = '';
        formData.tenant_id = '';
        formData.client_id = '';
        formData.client_secret = '';
        formData.arm_access_key = '';
        
        
      }
      setDialogOpen(false);
      setSelectedService(null);
      fetchCloudServices();
    } catch (err) {
      toast.error("Failed to save cloud service.");
      console.error("Failed to save cloud service", err);
    }
  };

  const columns = [
    // { title: "Cloud ID", data: "cloud_id" },
    { title: "Provider Name", data: "provider" },
    { title: "Subscription Name", data: "unique_Name" },
    { title: "Subscription ID", data: "subscription_id" },
    { title: "Tenant ID", data: "tenant_id" },
     { title: "Client ID", data: "client_id" },
    // { title: "Account", data: "account" },
    { title: "Region", data: "region" },
    // { title: "Role", data: "role" },
    {
      title: "Actions", data: null, orderable: false, render: function (data: any, type: any, row: any) {
        return `
         <div class="flex gap-2">
        
          <button class="delete-btn text-red-600 hover:underline" data-id="${row.id}">Delete</button>
        </div>
      `;
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Cloud Credentials</h2>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedService(null);
            setDialogOpen(true);
          }}
        >
           Add Cloud credential
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
        {/* <ConfirmModal
          open={confirmDelete.open}
          message="Are you sure you want to delete this cloud service?"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmDelete({ open: false, id: null })}
        /> */}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <DataTable
            data={cloudServices}
            columns={columns}
            className="stripe hover dataTable"
            options={{
              dom: '<"flex justify-between items-center px-4 py-2"lf>rt<"flex justify-between items-center px-4 py-2"ip>',
              paging: true,
              searching: true,
              lengthChange: true,
            }}
          >
            <thead>
              <tr>
                <th>Provider</th>
                <th>Account</th>
                <th>Subscription ID</th>
                <th>Region</th>
                <th>Role</th>
                <th>Cloud ID</th>
              </tr>
            </thead>
          </DataTable>
        )}
      </div>

      <AddHyperscaler
        visible={isDialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedService(null);
        }}
        cloudNames={cloudNames}
        onSubmit={handleAddOrEdit}
        initialData={selectedService}
      />
    </div>
  );
}
