import React, { useEffect, useState } from 'react';

interface AddCategoryDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => Promise<void>;
  initialData?: Record<string, any> | null;
}

const providerFields: Record<
  string,
  { label: string; name: string; type?: string }[]
> = {
  aws: [
    { label: 'Subscription ID', name: 'subscription_id' },
    { label: 'Tenant ID', name: 'tenant_id' },
    { label: 'Client Secret', name: 'client_secret', type: 'password' },
    { label: 'ARM Access Key', name: 'arm_access_key', type: 'password' },
  ],
  azure: [
    { label: 'Subscription ID', name: 'subscription_id' },
    { label: 'Directory (Tenant) ID', name: 'tenant_id' },
    { label: 'Client ID', name: 'client_id' },
    { label: 'Client Secret', name: 'client_secret', type: 'password' },
  ],
  gcp: [
    { label: 'Project ID', name: 'project_id' },
    { label: 'Service Account Key', name: 'service_account_key', type: 'password' },
  ],
};

export default function AddHyperscaler({
  visible,
  onClose,
  onSubmit,
  initialData,
}: AddCategoryDialogProps) {
  const [provider, setProvider] = useState('aws');
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (initialData) {
      setProvider(initialData.provider || 'aws');
      setFormData(initialData);
    } else {
      setProvider('aws');
      setFormData({});
    }
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...formData, provider });
    onClose();
  };

  return (
    <div className="relative z-10" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <form onSubmit={handleSubmit}>
              <div className="bg-white px-6 pt-5 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {initialData ? 'Edit Hyperscaler' : 'Add Hyperscaler'}
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
                    <option value="gcp">Google Cloud</option>
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
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {initialData ? 'Update' : 'Save'} Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
