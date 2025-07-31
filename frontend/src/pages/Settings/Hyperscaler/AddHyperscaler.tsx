import React, { useEffect, useState } from 'react';
import { Spinner } from '../../../components/ui/Spinner';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';

interface AddCategoryDialogProps {
  visible: boolean;
  cloudNames: string[];
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => Promise<void>;
  initialData?: Record<string, any> | null;
}

const providerFields: Record<
  string,
  { label: string; name: string; type?: string }[]
> = {
  aws: [
    { label: 'Subscription Name', name: 'unique_Name' },
    { label: 'Subscription ID', name: 'subscription_id' },
    { label: 'Tenant ID', name: 'tenant_id' },
    { label: 'Client Secret', name: 'client_secret', type: 'password' },
    { label: 'ARM Access Key', name: 'arm_access_key', type: 'password' },
    { label: 'Region', name: 'region' },
  ],
  azure: [
    { label: 'Subscription Name', name: 'unique_Name' },
    { label: 'Subscription ID', name: 'subscription_id' },
    { label: 'Directory (Tenant) ID', name: 'tenant_id' },
    { label: 'Client ID', name: 'client_id' },
    { label: 'Client Secret', name: 'client_secret', type: 'password' },
    // {label: 'ARM Access Key', name: 'arm_access_key', type: 'password' },
    { label: 'Region', name: 'region' },
  ],
  // gcp: [
  //     {label: 'Cloud Name', name: 'unique_Name'},
  //   { label: 'Project ID', name: 'project_id' },
  //   { label: 'Service Account Key', name: 'service_account_key', type: 'password' },
  // ],
};

export default function AddHyperscaler({
  visible,
  onClose,
  onSubmit,
  initialData,
  cloudNames,
}: AddCategoryDialogProps) {
  // console.log(initialData);

  const [provider, setProvider] = useState('aws');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [nameError, setNameError] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);
   
  useEffect(() => {
    if (initialData) {
      setProvider(initialData.provider || 'aws');
      setFormData(initialData);
    } else {
      setProvider('aws');
      setFormData({});
    }
    setNameError(null);
  }, [initialData]);

  if (!visible) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'unique_Name') {
      if (cloudNames.includes(value)) {
        setNameError('Name already exists. Please choose a different name.');
      } else {
        setNameError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     setLoading(true);
    if (nameError) return;
    // if(!formData.unique_Name || !formData.subscription_id || !formData.provider) {
    //   alert("Name, Subscription ID, and Provider are required.");
    //   return;
    // }
    // await onSubmit({ ...formData, provider });
   
    // setNameError(null);


     try {
      await onSubmit({ ...formData, provider });
       setFormData({});
    setProvider('aws');
      onClose();
    } catch (error) {
      // Optionally handle submit error here
      toast.error('Failed to submit form. Please try again.');
      // console.error('Submit failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 h-500 overflow-scroll" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto flex items-center justify-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 pt-5 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {initialData ? 'Edit Cloud Credential' : 'Add Cloud Credential'}
              </h3>

              {/* Provider Select */}
              <div className="mb-4">
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Provider
                </label>
                <select
                  id="provider"
                  name="provider"
                  value={provider}
                  onChange={(e) => {
                    setProvider(e.target.value);
                    setFormData((prev) => ({
                      provider: e.target.value
                    }));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={!!initialData} // disable provider change on edit
                >
                  <option value="aws">AWS</option>
                  <option value="azure">Azure</option>
                  {/* <option value="gcp">Google Cloud</option> */}
                </select>
              </div>

              {/* Dynamic Fields */}
              {providerFields[provider]?.map((field) => (
                <div key={field.name} className="mb-4">
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    autoComplete="off"
                  />
                  {field.name === 'unique_Name' && nameError && (
                    <p className="text-red-600 text-xs mt-1">{nameError}</p>
                  )}
                </div>
              ))}
            </div>

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
  );
}
