import React, { useState } from 'react'

const providerFields: Record<string, { label: string; name: string; type?: string }[]> = {
  aws: [
    { label: 'Subscription ID', name: 'subscriptionId' },
    { label: 'Tenant ID', name: 'tenantId' },
    { label: 'Client Secret', name: 'clientSecret', type: 'password' },
    { label: 'ARM Access Key', name: 'armAccessKey', type: 'password' },
  ],
  azure: [
    { label: 'Subscription ID', name: 'subscriptionId' },
    { label: 'Directory (Tenant) ID', name: 'tenantId' },
    { label: 'Client ID', name: 'clientId' },
    { label: 'Client Secret', name: 'clientSecret', type: 'password' },
  ],
  gcp: [
    { label: 'Project ID', name: 'projectId' },
    { label: 'Service Account Key', name: 'serviceAccountKey', type: 'password' },
  ],
};

const HyperScaler = () => {
  const [provider, setProvider] = useState('aws');
  const [form, setForm] = useState<Record<string, string>>({});

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvider(e.target.value);
    setForm({}); // Reset form on provider change
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hyperscaler Settings</h1>
        <p className="text-gray-600">Configure cloud provider settings and preferences.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Configuration</h2>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={provider}
          onChange={handleProviderChange}
        >
          <option value="aws">AWS</option>
          <option value="azure">Azure</option>
          <option value="gcp">Google Cloud</option>
        </select>
      </div>

      {/* Conditional card for provider form */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">{provider.toUpperCase()} Credentials</h3>
        <form className="space-y-4">
          {providerFields[provider].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 mb-1" htmlFor={field.name}>{field.label}</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type={field.type || 'text'}
                id={field.name}
                name={field.name}
                value={form[field.name] || ''}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
          ))}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  )
}

export default HyperScaler