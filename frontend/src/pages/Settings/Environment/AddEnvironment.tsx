// --- AddEnvironment.tsx ---
import React, { useState, useEffect } from "react";
import Button from "../../../components/ui/Button";
import { getCloudWithID } from "../../../services/cloud_services/cloudService";
import { getGitServiceWithID } from "../../../services/git_services/gitService";
import { toast } from "react-toastify";

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

    const [loading, setLoading] = useState(false);
    const [nameError, setNameError] = useState<string | null>(null);
  


  // console.log(initialData);

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

  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    // const payload = {
    //   name: formData.name,
    //   description: formData.description,
    //   cloud: formData.cloud ? parseInt(formData.cloud) : null,
    //   git: formData.git ? parseInt(formData.git) : null,
    // };
    // onSubmit(payload);


        e.preventDefault();
        if (!formData.name || !formData.cloud || !formData.git) {
          alert("Name fields are required.");
          return;
        }
        try {
          await onSubmit(formData,);
          toast.success(`Environment ${formData.name} added successfully`)
          setFormData({
           name:" ",
           description:" ",
           cloud: " ",
           git: " ",
          });
          onClose()
        }
        catch (err: any) {
          toast.error('Failed to submit form. Please try again.');
        }
        finally {
          setLoading(false);
        }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-10 bg-black/40 flex justify-center items-center">
      <div className="bg-white rounded p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{initialData ? "Edit" : "Add"} Environment</h2>

        <div className="mb-4">
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Environment Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Environment Name"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cloud" className="block text-sm font-medium text-gray-700 mb-1">
            Select Cloud
          </label>
          <select
            name="cloud"
            onClick={handleCloudDropdownOpen}
            onChange={handleChange}
            value={formData.cloud}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Cloud</option>
            {cloudOptions.map((cloud) => (
              <option key={cloud.id} value={cloud.id}>
                {cloud.cloud_id} — {cloud.unique_Name} 
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="git" className="block text-sm font-medium text-gray-700 mb-1">
            Select Git
          </label>
          <select
            name="git"
            onClick={handleGitDropdownOpen}
            onChange={handleChange}
            value={formData.git}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Git</option>
            {gitOptions.map((git) => (
              <option key={git.id} value={git.id}>
                {git.git_id} — {git.unique_Name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default AddEnvironment;
