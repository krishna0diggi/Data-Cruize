// --- Environment.tsx ---
import React, { useEffect, useState } from "react";
import Button from "../../../components/ui/Button";
import AddEnvironment from "./AddEnvironment";
import DataTable from "datatables.net-react";
import DataTablesCore from "datatables.net-dt";
import { getAllEnvironments, createEnvironment, updateEnvironment } from "../../../services/env_services/envService";


DataTable.use(DataTablesCore);

const Environment = () => {
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [environmentData, setEnvironmentData] = useState<any[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

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

  const columns = [
    { title: "Env ID", data: "env_id" },
    { title: "Name", data: "name" },
    { title: "Description", data: "description" },
    { title: "Cloud Provider", data: "cloud.provider", defaultContent: "-" },
    { title: "Git Repo", data: "git.repo_name", defaultContent: "-" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Environment</h2>
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
