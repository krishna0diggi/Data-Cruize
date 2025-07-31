# # Crete the environment:
import requests  
# import base64  
# import nacl.encoding  
# import nacl.public  
from urllib.parse import quote
import time
  

# OWNER = "owner_name"  # Replace with the repository owner  
# REPO = "repository_name"  # Replace with the repository name  
# ENVIRONMENT_NAME = "my_new_environment"  # Replace with the name of the environment  
# SECRET_NAME = "MY_SECRET"  # Replace with the secret name  
# SECRET_VALUE = "my_secret_value"  # Replace with the secret value  
  
# Headers for API requests  

# HEADERS = {  
#     "Authorization": f"Bearer {TOKEN}",  
#     "Accept": "application/vnd.github+json",  
# }  
  
# Step 1: Create a new environment  
import requests

def create_environment(owner, repo, environment_name,git_token):
    url = f"https://api.github.com/repos/{owner}/{repo}/environments/{environment_name}"
    headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": f"Bearer {git_token}",
    "X-GitHub-Api-Version": "2022-11-28"
    }
    payload = {
    "deployment_branch_policy": {
        "protected_branches": False,
        "custom_branch_policies": True
        }
    }
    response = requests.put(url, headers=headers, json=payload)
    try:
        print("📥 Response JSON:", response.json())
    except Exception as e:
        # print("❌ Error parsing JSON response:", e)
        print("📥 Raw Response Text:", response.text)

    if response.status_code == 200:
        print("✅ Environment created or updated successfully")
    else:
        print(f"❌ Failed to create environment: {response.status_code}")

    # print(f"✅ Status Code: {response.status_code}")
    # print(f"📝 Response JSON: {response.json() if response.status_code == 200 else response.text}")

def trigger_workflow(owner, repo, workflow_id,branch,git_token):
    print("Called the function")
    # branch = "testing-worflow-branch"
    url = f"https://api.github.com/repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {git_token}",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    data = {
        "ref": branch  # e.g., "main" or "master"
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 204:
        print(f"🚀 Workflow {workflow_id} triggered successfully!")
        # Immediately start polling until run completes
        poll_workflow_run_until_complete(owner, repo, workflow_id, branch, git_token)
        return True
    else:
        print(f"❌ Failed to trigger workflow {workflow_id}.")
        print("Response:", response.status_code, response.json())
        return False

    # else:
    #     print(f"❌ Failed to trigger workflow {workflow_id}.")
    #     print("Response:", response.status_code, response.json())


def poll_workflow_run_until_complete(owner, repo, workflow_id, branch, token, poll_interval=10, timeout=600):
    """
    Poll the workflow runs API until the latest run on the branch completes or timeout.

    Args:
        owner, repo, workflow_id: GitHub repo and workflow info
        branch: branch name the workflow was triggered on
        token: GitHub PAT token
        poll_interval: how many seconds between checks
        timeout: max seconds to wait before giving up

    Returns:
        The final workflow run dict if found and completed, else None
    """
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    runs_url = f"https://api.github.com/repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs?branch={branch}&event=workflow_dispatch&per_page=5"

    elapsed = 0

    while elapsed < timeout:
        response = requests.get(runs_url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to get runs: {response.status_code} {response.text}")
            return None

        runs = response.json().get("workflow_runs", [])
        if runs:
            latest = runs[0]
            status = latest["status"]     # e.g., queued, in_progress, completed
            conclusion = latest.get("conclusion")  # e.g., success, failure, cancelled, None
            run_number = latest["run_number"]
            print(f"Run #{run_number} status: {status}, conclusion: {conclusion}")

            if status == "completed":
                print(f"Workflow run completed with conclusion: {conclusion}")
                return latest
            # else keep polling
        else:
            print("No workflow runs found yet.")

        time.sleep(poll_interval)
        elapsed += poll_interval

    print(f"Timeout reached after {timeout} seconds waiting for workflow run to complete.")
    return None



def list_workflow_run(owner, repo, workflow_id, branch, token):

    # url = f"https://api.github.com/repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs?branch={branch}&per_page=10"
    url = f"https://api.github.com/repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs?branch={branch}"
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        runs = response.json().get("workflow_runs", [])
        print(f"Found {len(runs)} workflow runs on branch '{branch}':")
        for run in runs:
            # print(f"- Run #{run['run_number']} [ID: {run['id']}]")
            # print(f"  Status: {run['status']} | Conclusion: {run['conclusion']}")
            # print(f"  Created at: {run['created_at']} | Updated at: {run['updated_at']}")
            # print(f"  URL: {run['html_url']}")
            print("-----")
    else:
        print(f"Failed to list workflow runs: {response.status_code} {response.text}")
    
# # Step 2: Get the environment's public key  
# def get_public_key(owner, repo, environment_name):  
#     url = f"https://api.github.com/repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key"  
#     response = requests.get(url, headers=HEADERS)  
#     if response.status_code == 200:  
#         return response.json()  
#     else:  
#         print(f"Failed to get public key: {response.status_code}")  
#         print(response.json())  
#         exit()  
  
# # Step 3: Encrypt the secret value using the public key  
# def encrypt_secret(public_key, secret_value):  
#     """Encrypt a secret value using the public key."""  
#     public_key = nacl.public.PublicKey(public_key.encode("utf-8"), nacl.encoding.Base64Encoder())  
#     sealed_box = nacl.public.SealedBox(public_key)  
#     encrypted = sealed_box.encrypt(secret_value.encode("utf-8"))  
#     return base64.b64encode(encrypted).decode("utf-8")  
  
# # Step 4: Add a secret to the environment  
# def add_secret_to_environment(owner, repo, environment_name, secret_name, secret_value):  
#     # Get the public key for the environment  
#     public_key_data = get_public_key(owner, repo, environment_name)  
#     public_key = public_key_data["key"]  
#     key_id = public_key_data["key_id"]  
  
#     # Encrypt the secret value  
#     encrypted_value = encrypt_secret(public_key, secret_value)  
  
#     # Add the secret to the environment  
#     url = f"https://api.github.com/repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"  
#     payload = {  
#         "encrypted_value": encrypted_value,  
#         "key_id": key_id,  
#     }  
#     response = requests.put(url, headers=HEADERS, json=payload)  
#     if response.status_code == 201 or response.status_code == 204:  
#         print(f"Secret '{secret_name}' added to environment '{environment_name}' successfully!")  
#     else:  
#         print(f"Failed to add secret: {response.status_code}")  
#         print(response.json())  
  
# # Run the steps  
# create_environment(OWNER, REPO, ENVIRONMENT_NAME)  
# add_secret_to_environment(OWNER, REPO, ENVIRONMENT_NAME, SECRET_NAME, SECRET_VALUE)

def create_branch (owner, repo, base_branch,new_branch,token):
    headers = {
        "Accept":"application/vnd.github+json",
        "Authorization":f"Bearer {token}",
         "X-GitHub-Api-Version": "2022-11-28"
    }

    # Step 1: Get the latest commit SHA of the base branch
    url_ref = f"https://api.github.com/repos/{owner}/{repo}/git/ref/heads/{base_branch}"
    resp_ref = requests.get(url_ref, headers=headers)
    if resp_ref.status_code != 200:
        print(f"Failed to get base branch ref: {resp_ref.status_code}", resp_ref.json())
        return False
    sha = resp_ref.json()['object']['sha']
    # print(f"Base branch {base_branch} SHA: {sha}")
    
     # Step 2: Create new branch ref pointing to the base SHA
    url_create_ref = f"https://api.github.com/repos/{owner}/{repo}/git/refs"
    data = {
        "ref": f"refs/heads/{new_branch}",
        "sha": sha
    }
    resp_create = requests.post(url_create_ref, headers=headers, json=data)

    if resp_create.status_code == 201:
        print(f"Branch '{new_branch}' created successfully.")
        return True
    elif resp_create.status_code == 422:
        print(f"Branch '{new_branch}' already exists.")
        return True
    else:
        print(f"Failed to create branch '{new_branch}': {resp_create.status_code}", resp_create.json())
        return False


# def process_environment_payload(payload):
#     env = payload.get('env')
#     cloud = payload.get('cloud')
#     git = payload.get('git')
    
#     env_name = env.name if env else None
#     repo_owner = git.repo_owner if git else None
#     repo_name = git.repo_name if git else None
#     workflow_id = git.workflow_id if git else None
#     git_token = git.github_token  if git else None

#     # print("Workflow", workflow_id)
#     # print("ENV_ name",env_name)
#     # print("Repo Owner",repo_owner)
#     # print("Repo name",repo_name)
#     # print("Git token", git_token)

#     # ✅ Call GitHub create_environment function
#     if env_name and repo_owner and repo_name:
#         create_environment(repo_owner, repo_name, env_name,git_token)
#         # create_environment()
#     else:
#         print("❗️Missing repo owner, repo name, or environment name. Skipping GitHub environment creation.")

#     # def trigger_workflow(owner, repo, workflow_id, branch,git_token):

#     base_branch = "main"
#     new_branch = "pipeline-trigger-Initial-setup"

#     if create_branch(repo_owner, repo_name, base_branch, new_branch, git_token):
#         if trigger_workflow(repo_owner, repo_name, workflow_id, new_branch, git_token):
#             print("Waiting for workflow run to start...")
#             # time.sleep(5)
#             # list_workflow_run(repo_owner, workflow_id, new_branch, git_token)


#     # if repo_owner and repo_name and git_token:
#     #     print("Calling the function to tringer the workflow")
#     #     trigger_workflow(repo_owner,repo_name,workflow_id,git_token)
    
#     return {
#         "env_name": env.name if env else None,
#         "cloud_provider": cloud.provider if cloud else None,
#         "git_repo_owner": git.repo_owner if git else None,
#         "git_repo_name": git.repo_name if git else None,
#         "workflow_id": git.workflow_id if git else None,
#         "github_token": git.github_token if git else None,
#     }
def process_environment_payload(payload):
    env = payload.get('env')
    cloud = payload.get('cloud')
    git = payload.get('git')

    steps_status = [
        {"step": "environment_setup", "status": "PENDING", "progress": "0/5"},
        {"step": "branch_creation", "status": "PENDING", "progress": "0/5"},
        {"step": "workflow_trigger", "status": "PENDING", "progress": "0/5"},
        {"step": "workflow_running", "status": "PENDING", "progress": "0/5"},
        {"step": "completed", "status": "PENDING", "progress": "0/5"},
    ]
    current_step = 0

    def update_status(index, status):
        steps_status[index]["status"] = status
        steps_status[index]["progress"] = f"{index + 1}/5"

    # Extract data
    env_name = env.name if env else None
    repo_owner = git.repo_owner if git else None
    repo_name = git.repo_name if git else None
    workflow_id = git.workflow_id if git else None
    git_token = git.github_token if git else None

    try:
        # STEP 1: Environment Setup
        update_status(current_step, "RUNNING")
        if env_name and repo_owner and repo_name:
            create_environment(repo_owner, repo_name, env_name, git_token)
            print("Environment Successfull Created or updated")
            update_status(current_step, "SUCCESS")
        else:
            update_status(current_step, "FAILED")
            return {"error": "Missing environment details", "steps": steps_status}
    except Exception as e:
        update_status(current_step, "FAILED")
        return {"error": f"Environment creation failed: {str(e)}", "steps": steps_status}
    current_step += 1

    # STEP 2: Create Branch
    base_branch = "main"
    new_branch = "trigger-pipeline-for-deploy"
    try:
        update_status(current_step, "RUNNING")
        if not create_branch(repo_owner, repo_name, base_branch, new_branch, git_token):
            update_status(current_step, "FAILED")
            return {"error": "Branch creation failed", "steps": steps_status}
        update_status(current_step, "SUCCESS")
        print("Branch Successfull Created or updated")
    except Exception as e:
        update_status(current_step, "FAILED")
        return {"error": f"Branch creation error: {str(e)}", "steps": steps_status}
    current_step += 1

    # STEP 3: Trigger Workflow
    try:
        update_status(current_step, "RUNNING")
        if not trigger_workflow(repo_owner, repo_name, workflow_id, new_branch, git_token):
            update_status(current_step, "FAILED")
            return {"error": "Workflow trigger failed", "steps": steps_status}
        update_status(current_step, "SUCCESS")
        print("Workflow Triggered Created or updated")
    except Exception as e:
        update_status(current_step, "FAILED")
        return {"error": f"Workflow trigger error: {str(e)}", "steps": steps_status}
    current_step += 1

    # STEP 4: Workflow Running
    try:
        update_status(current_step, "RUNNING")
        run_result = poll_workflow_run_until_complete(repo_owner, repo_name, workflow_id, new_branch, git_token)
        if not run_result:
            update_status(current_step, "FAILED")
            return {"error": "Workflow did not complete", "steps": steps_status}
        update_status(current_step, "SUCCESS")
        print("Workflow Running Successfull Created or updated")
    except Exception as e:
        update_status(current_step, "FAILED")
        return {"error": f"Polling workflow error: {str(e)}", "steps": steps_status}
    current_step += 1

    # STEP 5: All Done
    update_status(current_step, "SUCCESS")
    print("ALL done")

    return {
        "message": "Environment setup pipeline completed",
        "env_name": env_name,
        "cloud_provider": cloud.provider if cloud else None,
        "git_repo_owner": repo_owner,
        "git_repo_name": repo_name,
        "workflow_id": workflow_id,
        "steps": steps_status
    }
