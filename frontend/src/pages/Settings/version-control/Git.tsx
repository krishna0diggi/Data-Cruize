import { useEffect, useState } from "react";
import AddGitService from "./AddGitService";
import Button from "../../../components/ui/Button";
import {
  getAllGitServices,
  createGitService,
  updateGitService,
} from "../../../services/git_services/gitService";

// DataTables integration
import DataTable from "datatables.net-react";
import DataTablesCore from "datatables.net-dt";
import "datatables.net-rowgroup-dt"; // Optional, remove if not grouping rows

DataTable.use(DataTablesCore);

// Type definition
type GitService = {
  id: number;
  github_token: string;
  repo_owner: string;
  repo_name: string;
  workflow_id: string;
  git_id: string;
};

export default function GitServiceManager() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [gitServices, setGitServices] = useState<GitService[]>([]);
  const [selectedService, setSelectedService] = useState<GitService | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGitServices = async () => {
    setLoading(true);
    try {
      const data = await getAllGitServices();
      setGitServices(data);
    } catch (err) {
      console.error("Error fetching Git services", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGitServices();
  }, []);

  const handleAddOrEdit = async (formData: Record<string, any>) => {
    try {
      if (formData.id) {
        await updateGitService(formData.id, formData);
      } else {
        await createGitService(formData);
      }
      setDialogOpen(false);
      setSelectedService(null);
      fetchGitServices();
    } catch (err) {
      console.error("Failed to save Git service", err);
    }
  };

  const columns = [
    { title: "Repo Owner", data: "repo_owner" },
    { title: "Repo Name", data: "repo_name" },
    { title: "Workflow ID", data: "workflow_id" },
    { title: "Git ID", data: "git_id" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Git Services</h2>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedService(null);
            setDialogOpen(true);
          }}
        >
          Add Git Service
        </Button>
      </div>

      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <DataTable
            data={gitServices}
            columns={columns}
            className="display stripe hover"
          >
            <thead>
              <tr>
                <th>Repo Owner</th>
                <th>Repo Name</th>
                <th>Workflow ID</th>
                <th>Git ID</th>
              </tr>
            </thead>
          </DataTable>
        )}
      </div>

      {/* Add/Edit Git Modal */}
      <AddGitService
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
