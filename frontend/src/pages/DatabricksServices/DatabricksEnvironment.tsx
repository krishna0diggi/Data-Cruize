import React, { useEffect, useState } from 'react'
import { getAllEnvironments } from '../../services/env_services/envService'
import DataTable from "datatables.net-react";
import DataTablesCore from "datatables.net-dt";
import { ToastContainer, toast } from 'react-toastify';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { runEnvironment } from '../../services/env_services/runEnvironmentApi';

DataTable.use(DataTablesCore)
const DatabricksEnvironment = () => {

    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<string[]>([]);
    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [environmentData, setEnvironmentData] = useState<any[]>([]);
    const [getResponse, setGetResponse] = useState<any[]>([]);
    // For publish confirmation modal
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [pendingPublish, setPendingPublish] = useState<{env: string, cloud: string, git: string} | null>(null);

    const fetchEnvironment = async () => {
        setLoading(true);
        try {
            const data = await getAllEnvironments();
            setEnvironmentData(data);
        } catch (err) {
            console.error("Error fetching environments", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEnvironment();
    }, []);

    const handlePublish = async (env: string, cloud: string, git: string) => {
        const payload = {
            env: Number(env),
            cloud: Number(cloud),
            git: Number(git),
        };
        setLoading(true);
        setError(null);
        setLogs([]); // Clear previous logs

        try {
            const runEnv = await runEnvironment(payload); // your API call
            console.log("API response:", runEnv.steps);
            setGetResponse(runEnv.steps)

            // Assume runEnv.log is the array of status messages from backend
            if (runEnv.log && Array.isArray(runEnv.log)) {
                setLogs(runEnv.log);
            } else {
                // fallback: stringify whole response if no `log` key
                setLogs([JSON.stringify(runEnv, null, 2)]);
            }
        } catch (err: any) {
            console.error("Error running environment:", err);
            setError(err.message || "Unknown error occurred");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!loading) {
            const table = document.querySelector(".dataTable") as HTMLElement;
            // Define the handler outside so you can remove it
            const handleTableClick = (e: any) => {
                const target = e.target;
                if (target.classList.contains("publish-btn")) {
                    const envId = target.getAttribute("data-envid");
                    const cloudId = target.getAttribute("data-cloudid");
                    const gitId = target.getAttribute("data-gitid");
                    setPendingPublish({ env: envId, cloud: cloudId, git: gitId });
                    setShowPublishModal(true);
                }
            };
            table?.addEventListener("click", handleTableClick);

            return () => {
                table?.removeEventListener("click", handleTableClick);
            };
        }
    }, [loading, environmentData]);

    const columns = [
        // { title: "Env ID", data: "env_id" },
        { title: "Env Name", data: "name" },
        // { title: "Description", data: "description" },
        { title: "Cloud Name", data: "cloud.unique_Name", defaultContent: "-" },
        { title: "Git Name", data: "git.unique_Name", defaultContent: "-" },
        { title: 'Status', data: "status" },
        {
            title: "Actions", data: null, orderable: false, render: function (data: any, type: any, row: any) {
                return `
         <div class="flex gap-2">
        
            <button 
          class="publish-btn text-blue-600 hover:underline" 
          data-envid="${row.id}" 
          data-cloudid="${row.cloud?.id}" 
          data-gitid="${row.git?.id}">
          Publish
        </button>
        </div>
      `
            }
        }
    ];
const statusBadgeClass = {
  SUCCESS: "bg-redOrange",
  FAILURE: "bg-redOrange",
  IN_PROGRESS: "bg-gableGreen",
  DEFAULT: "bg-gray-300",
};

const statusTextClass = {
  SUCCESS: "text-redOrange",
  FAILURE: "text-redOrange",
  IN_PROGRESS: "text-gableGreen",
  DEFAULT: "text-gray-600",
};
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">Run Databricks Environment</h1>
            </div>

            {error && <div style={{ color: "red" }}>Error: {error}</div>}
            <div>
                <div className="bg-white rounded shadow p-4">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <DataTable
                            data={environmentData}
                            columns={columns}
                            className="stripe hover"
                            options={{
                                dom: `
                <'flex flex-col md:flex-row justify-between items-center gap-4 mb-4'lf>
                <'overflow-x-auto't>
                <'flex flex-col md:flex-row justify-between items-center gap-4 mt-4'ip>
              `,
                                paging: true,
                                searching: true,
                                lengthChange: true,
                                info: true,
                            }}
                        />
                    )}
                </div>
            </div>


            {/* Publish confirmation modal */}
            {showPublishModal && pendingPublish && (
                <ConfirmModal
                    open={showPublishModal}
                    title="Run Workspace?"
                    description="Are you sure you want to run the Workspace?"
                    onConfirm={() => {
                        setShowPublishModal(false);
                        handlePublish(pendingPublish.env, pendingPublish.cloud, pendingPublish.git);
                        setPendingPublish(null);
                    }}
                    onCancel={() => {
                        setShowPublishModal(false);
                        setPendingPublish(null);
                    }}
                />
            )}

            {getResponse && getResponse.length > 0 && (
                <div className="my-6 p-4 bg-springWood rounded-lg shadow-md max-w-xl mx-auto">
                    <h2 className="text-lg font-semibold mb-4 text-gableGreen">
                        Workflow Execution Steps
                    </h2>
                    <div className="space-y-4">
                        {getResponse.map((stepObj, index) => {
                            // Use only safelisted classes for badge and text color
                            let badgeColor = "bg-gray-300";
                            let statusTextColor = "text-gray-600";
                            if (stepObj.status === "SUCCESS") {
                                badgeColor = "bg-redOrange";
                                statusTextColor = "text-redOrange";
                            } else if (stepObj.status === "FAILURE") {
                                badgeColor = "bg-redOrange";
                                statusTextColor = "text-redOrange";
                            } else if (stepObj.status === "IN_PROGRESS") {
                                badgeColor = "bg-gableGreen";
                                statusTextColor = "text-gableGreen";
                            }

                            return (
                                <div key={index} className="flex items-center space-x-4">
                                    <span
                                        className={`w-5 h-5 rounded-full flex-shrink-0 bg-green-600`}
                                        aria-label={`Status: ${stepObj.status}`}
                                    />
                                    <div className="flex-1 grid grid-cols-4 gap-4 text-sm md:text-base text-gableGreen">
                                        <div className="font-medium capitalize">
                                            {stepObj.step.replaceAll('_', ' ')}
                                        </div>
                                        <div className={`text-green-700 col-span-2`}>
                                            {stepObj.status}
                                        </div>
                                        <div className="text-gray-500 text-right">{stepObj.progress}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}


        </div>

    )
}

export default DatabricksEnvironment