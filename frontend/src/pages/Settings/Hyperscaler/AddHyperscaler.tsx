// import React, { useState } from 'react'

// const providerFields: Record<string, { label: string; name: string; type?: string }[]> = {
//   aws: [
//     { label: 'Subscription ID', name: 'subscriptionId' },
//     { label: 'Tenant ID', name: 'tenantId' },
//     { label: 'Client Secret', name: 'clientSecret', type: 'password' },
//     { label: 'ARM Access Key', name: 'armAccessKey', type: 'password' },
//   ],
//   azure: [
//     { label: 'Subscription ID', name: 'subscriptionId' },
//     { label: 'Directory (Tenant) ID', name: 'tenantId' },
//     { label: 'Client ID', name: 'clientId' },
//     { label: 'Client Secret', name: 'clientSecret', type: 'password' },
//   ],
//   gcp: [
//     { label: 'Project ID', name: 'projectId' },
//     { label: 'Service Account Key', name: 'serviceAccountKey', type: 'password' },
//   ],
// };

// const AddHyperscaler = () => {
//   const [provider, setProvider] = useState('aws');
//   const [form, setForm] = useState<Record<string, string>>({});

//   const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setProvider(e.target.value);
//     setForm({}); // Reset form on provider change
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   return (
//     <div>
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Hyperscaler Settings</h1>
//         <p className="text-gray-600">Configure cloud provider settings and preferences.</p>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h2 className="text-xl font-semibold mb-4">Configuration</h2>
//         <select
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={provider}
//           onChange={handleProviderChange}
//         >
//           <option value="aws">AWS</option>
//           <option value="azure">Azure</option>
//           <option value="gcp">Google Cloud</option>
//         </select>
//       </div>

//       {/* Conditional card for provider form */}
//       <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h3 className="text-lg font-semibold mb-4">{provider.toUpperCase()} Credentials</h3>
//         <form className="space-y-4">
//           {providerFields[provider].map((field) => (
//             <div key={field.name}>
//               <label className="block text-gray-700 mb-1" htmlFor={field.name}>{field.label}</label>
//               <input
//                 className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 type={field.type || 'text'}
//                 id={field.name}
//                 name={field.name}
//                 value={form[field.name] || ''}
//                 onChange={handleInputChange}
//                 autoComplete="off"
//               />
//             </div>
//           ))}
//           <button
//             type="submit"
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Save
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default AddHyperscaler

interface AddCategoryDialogProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddHyperscaler({ visible, onClose }: AddCategoryDialogProps) {
  if (!visible) return null;

  return (
    <div className="relative z-10" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

      {/* Dialog wrapper */}
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          {/* Dialog panel */}
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                    className="size-6 text-red-600"
                  >
                    <path
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 id="dialog-title" className="text-base font-semibold text-gray-900">
                    Add Category
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Fill in the details to add a new category to your system.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
                onClick={onClose}
              >
                Add
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
