import React, { useEffect, useState } from "react";

interface GitService {
  github_token: string;
  repo_owner: string;
  repo_name: string;
  workflow_id: string;
}

interface AddGitServiceProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: GitService) => void;
  initialData: GitService | null;
}

const AddGitService: React.FC<AddGitServiceProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<GitService>({
    github_token: "",
    repo_owner: "",
    repo_name: "",
    workflow_id: "",
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
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
                {initialData ? "Edit Git Service" : "Add Git Service"}
              </h2>

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

              {/* Footer buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                  {initialData ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGitService;
