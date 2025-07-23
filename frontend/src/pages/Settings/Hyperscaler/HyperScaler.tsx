import { useEffect, useState } from "react";
import AddHyperscaler from "./AddHyperscaler";
import Button from "../../../components/ui/Button";
import {
  getAllCloudServices,
  createCloudService,
  UpdateCloudService,
} from "../../../services/cloud_services/cloudService";

// DataTables
import DataTable from "datatables.net-react";
import DataTablesCore from "datatables.net-dt";
import "datatables.net-rowgroup-dt"; // Optional: Grouping
DataTable.use(DataTablesCore);

type CloudService = {
  id: string;
  provider: string;
  account: string;
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

  const fetchCloudServices = async () => {
    setLoading(true);
    try {
      const data = await getAllCloudServices(0, 1000, ""); // You can customize this
      setCloudServices(data);
    } catch (err) {
      console.error("Error fetching cloud services", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCloudServices();
  }, []);

  const handleAddOrEdit = async (formData: Record<string, any>) => {
    try {
      if (formData.id) {
        await UpdateCloudService(formData.id, formData);
      } else {
        await createCloudService(formData);
      }
      setDialogOpen(false);
      setSelectedService(null);
      fetchCloudServices();
    } catch (err) {
      console.error("Failed to save cloud service", err);
    }
  };

  const columns = [
    { title: "Provider", data: "provider" },
    { title: "Account", data: "account" },
    { title: "Subscription ID", data: "subscription_id" },
    { title: "Region", data: "region" },
    { title: "Role", data: "role" },
    { title: "Cloud ID", data: "cloud_id" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cloud Credentials</h2>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedService(null);
            setDialogOpen(true);
          }}
        >
          Add Hyperscaler
        </Button>
      </div>

      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <DataTable
            data={cloudServices}
            columns={columns}
            className="display stripe hover"
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

      {/* Modal for Add */}
      <AddHyperscaler
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
}
