import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Spinner } from "../../../components/ui/Spinner";
import Button from "../../../components/ui/Button";

interface GitService {
  unique_Name?: string;
  github_token: string;
  repo_owner: string;
  repo_name: string;
  workflow_id: string;
}

interface AddGitServiceProps {
  visible: boolean;
  gitNames: string[];
  onClose: () => void;
  onSubmit: (data: GitService) => void;
  initialData: GitService | null ;
}

const AddGitService: React.FC<AddGitServiceProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  gitNames
}) => {
  const [formData, setFormData] = useState<GitService>({
    unique_Name: "",
    github_token: "",
    repo_owner: "",
    repo_name: "",
    workflow_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Prefill form when editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        github_token: "",
        repo_owner: "",
        repo_name: "",
  
        workflow_id: "",
      });
    }
  }, [initialData, visible]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "unique_Name") {
      if (gitNames.includes(value)) {
        // toast.error("Name already exists. Please choose a different name.");
        setNameError('Name already exists. Please choose a different name.');
      } else {
        setNameError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.github_token || !formData.repo_owner || !formData.repo_name || !formData.workflow_id) {
      alert("All fields are required.");
      return;
    }
    try {
      await onSubmit(formData,);
      setFormData({
        unique_Name: "",
        github_token: "",
        repo_owner: "",
    
        repo_name: "",
        workflow_id: "",
      });
      onClose()
    }
    catch (err: any) {
      toast.error('Failed to submit form. Please try again.');
    }
    finally {
      setLoading(false);
    }

    // onClose();
  };

  if (!visible) return null;

  return (
    <div className="relative z-10" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <form onSubmit={handleSubmit} className="bg-white px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {initialData ? "Edit Git Credential" : "Add Git Credential"}
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Git Name
                </label>
                <input
                  type="text"
                  name="unique_Name"
                  value={formData.unique_Name || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  autoComplete="off"
                />
                <p className="text-red-600 text-xs mt-1">{nameError}</p>
              </div>


              {/* Repo Owner */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Repo Owner
                </label>
                <input
                  type="text"
                  name="repo_owner"
                  value={formData.repo_owner}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              {/* Repo Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Repo Name
                </label>
                <input
                  type="text"
                  name="repo_name"
                  value={formData.repo_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              






              {/* Workflow ID */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Workflow ID
                </label>
                <input
                  type="text"
                  name="workflow_id"
                  value={formData.workflow_id}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>


              {/* GitHub Token */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  GitHub Token
                </label>
                <input
                  type="text"
                  name="github_token"
                  value={formData.github_token}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end space-x-2">
                {/* Replace Cancel native button */}
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>

                {/* Replace Submit native button with loading */}
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={loading}
                  loadingText={initialData ? 'Updating...' : 'Saving...'}
                  disabled={!!nameError || loading}
                >
                  {initialData ? 'Update' : 'Save'}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGitService;
