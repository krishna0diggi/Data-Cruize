import { useEffect, useState } from "react";
import AddGitService from "./AddGitService";
import Button from "../../../components/ui/Button";
import {
  getAllGitServices,
  createGitService,
  updateGitService,
  deleteGitService,
} from "../../../services/git_services/gitService";

// DataTables integration
import DataTable from "datatables.net-react";
import DataTablesCore from "datatables.net-dt";
import "datatables.net-rowgroup-dt"; // Optional, remove if not grouping rows
import { toast, ToastContainer } from "react-toastify";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import type { unique } from "jquery";

DataTable.use(DataTablesCore);

// Type definition
type GitService = {
  id: number;
  unique_Name: string;
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
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [gitNames, setGitNames] = useState<string[]>([]);

  const fetchGitServices = async () => {
    setLoading(true);
    try {
      const data = await getAllGitServices();
      setGitServices(data);
      setGitNames(data.map((service:GitService)=> service.unique_Name))
    } catch (err) {
      toast.error("Error fetching Git services");
      console.error("Error fetching Git services", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGitServices();
  }, []);

  useEffect(() => {
    if (!loading) {
      const table = document.querySelector(".dataTable") as HTMLElement;
      const clickHandler = async (e: any) => {
        const target = e.target;
        const id = target.getAttribute("data-id");

        if (target.classList.contains("edit-btn")) {
          const selected = gitServices.find((item) => item.id === id);
          setSelectedService(selected ?? null);
          setDialogOpen(true);
          // setEdit(true);
        }

        if (target.classList.contains("delete-btn")) {
          setConfirmDelete({ open: true, id });
        }
      };

      table?.addEventListener("click", clickHandler);
      return () => table?.removeEventListener("click", clickHandler);
    }
  }, [loading, gitServices]);

  const handleDeleteConfirmed = async () => {
    if (confirmDelete.id) {
      try {
        await deleteGitService(parseInt(confirmDelete.id));
        toast.success("Git service deleted successfully.");
        fetchGitServices();
      } catch (err) {
        toast.error("Failed to delete git service.");
      }
    }
    setConfirmDelete({ open: false, id: null });
  };


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
    // { title: "Git ID", data: "git_id" },
    { title: "Git Name", data: "unique_Name" },
    { title: "Repo Owner", data: "repo_owner" },
    { title: "Repo Name", data: "repo_name" },
    { title: "Workflow ID", data: "workflow_id" },
    { title: "Github Token", data: "github_token" },
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
        <h2 className="text-2xl ">Git Credentials</h2>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedService(null);
            setDialogOpen(true);
          }}
        >
          Add Git
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
            data={gitServices}
            columns={columns}
            className="display stripe hover"
          >
            <thead>
              <tr>
                <th>Repo Owner</th>
                <th>Repo Name</th>
                <th>Workflow ID</th>
                <th>Github Token</th>
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
        gitNames = {gitNames}
        onSubmit={handleAddOrEdit}
        initialData={selectedService}
      />
    </div>
  );
}
