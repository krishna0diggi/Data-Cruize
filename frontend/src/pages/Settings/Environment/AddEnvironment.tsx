// --- AddEnvironment.tsx ---
import React, { useState, useEffect } from "react";
import Button from "../../../components/ui/Button";
import { getCloudWithID } from "../../../services/cloud_services/cloudService";
import { getGitServiceWithID } from "../../../services/git_services/gitService";

interface AddEnvironmentDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
  initialData?: any;
}

const AddEnvironment: React.FC<AddEnvironmentDialogProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cloud: "",
    git: "",
  });

  const [cloudOptions, setCloudOptions] = useState<any[]>([]);
  const [gitOptions, setGitOptions] = useState<any[]>([]);

  const [cloudDropdownOpened, setCloudDropdownOpened] = useState(false);
  const [gitDropdownOpened, setGitDropdownOpened] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        cloud: initialData.cloud?.id || "",
        git: initialData.git?.id || "",
      });
    } else {
      setFormData({ name: "", description: "", cloud: "", git: "" });
    }
  }, [initialData, visible]);

  const handleCloudDropdownOpen = async () => {
    if (cloudOptions.length === 0) {
      try {
        const data = await getCloudWithID();
        setCloudOptions(data);
      } catch (err) {
        console.error("Error fetching cloud IDs:", err);
      }
    }
    setCloudDropdownOpened(true);
  };

  const handleGitDropdownOpen = async () => {
    if (gitOptions.length === 0) {
      try {
        const data = await getGitServiceWithID();
        setGitOptions(data);
      } catch (err) {
        console.error("Error fetching Git IDs:", err);
      }
    }
    setGitDropdownOpened(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      name: formData.name,
      description: formData.description,
      cloud: formData.cloud ? parseInt(formData.cloud) : null,
      git: formData.git ? parseInt(formData.git) : null,
    };
    onSubmit(payload);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-10 bg-black/40 flex justify-center items-center">
      <div className="bg-white rounded p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{initialData ? "Edit" : "Add"} Environment</h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Environment Name"
          className="border p-2 mb-2 w-full"
        />

        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 mb-2 w-full"
        />

        <select
          name="cloud"
          onClick={handleCloudDropdownOpen}
          onChange={handleChange}
          value={formData.cloud}
          className="border p-2 mb-2 w-full"
        >
          <option value="">Select Cloud</option>
          {cloudOptions.map((cloud) => (
            <option key={cloud.id} value={cloud.id}>
              {cloud.cloud_id} — {cloud.name}
            </option>
          ))}
        </select>

        <select
          name="git"
          onClick={handleGitDropdownOpen}
          onChange={handleChange}
          value={formData.git}
          className="border p-2 mb-4 w-full"
        >
          <option value="">Select Git</option>
          {gitOptions.map((git) => (
            <option key={git.id} value={git.id}>
              {git.git_id} — {git.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default AddEnvironment;
